/*
  PRODUCT DETAIL PAGE LOGIC
  -------------------------
  This file runs only on product.html. It:
  1. Reads which product to show from the URL (?id=...)
  2. Renders name/price/description/colors
  3. Runs the image gallery: autoplay, thumbnails, dots, swipe
  4. Renders "You May Also Like" from the same category
*/

// ── STEP 1: figure out which product we're looking at ──
// window.location.search gives us everything after the "?" in the URL.
// URLSearchParams is a built-in browser tool for reading query params
// like ?id=laptop-backpack without writing manual string-splitting code.
var urlParams = new URLSearchParams(window.location.search);
var productId = urlParams.get("id");
var product = getProductById(productId);

if (!product) {
  // No matching product (bad link, typo, etc.) — send them somewhere useful
  // instead of showing a broken blank page.
  window.location.href = "products.html";
}

// ── GALLERY STATE ──
// These variables track what the gallery is currently doing.
var currentImages = [];
var currentIndex = 0;
var autoplayInterval = null;
var pausedByHover = false; // true while mouse is over the gallery (desktop) or mid-swipe

var mainImageEl = document.getElementById("pd-main-image");
var mainBgEl = document.getElementById("pd-main-bg");
var counterEl = document.getElementById("pd-image-counter");
var thumbsEl = document.getElementById("pd-thumbs");
var dotsEl = document.getElementById("pd-dots");
var galleryWrap = document.querySelector(".pd-main-wrap");

function setupProduct() {
  document.getElementById("pd-page-title").textContent =
    product.name + " — Udems Luxe Collections";
  document.getElementById("pd-meta-description").setAttribute(
    "content",
    product.name + " — " + formatNaira(product.price) + ". Shop at Udems Luxe Collections, Broad Street Lagos. Order via WhatsApp."
  );

  var category = getCategoryBySlug(product.category);
  document.getElementById("pd-category-label").textContent = category
    ? category.name
    : "";

  document.getElementById("pd-name").textContent = product.name;

  var priceLabel = product.priceMax
    ? formatNaira(product.price) + " – " + formatNaira(product.priceMax)
    : formatNaira(product.price);
  document.getElementById("pd-price").textContent = priceLabel;
  document.getElementById("pd-sticky-price").textContent = priceLabel;

  document.getElementById("pd-description").textContent = product.description;

  // Starting image set: first color if colors exist, else the product's own images
  currentImages = product.colors ? product.colors[0].images : product.images;
  currentIndex = 0;

  renderColorSwatches();
  renderGallery();
  startAutoplay();
  setupWhatsAppLinks();
  renderRelatedProducts();
}

// ── COLOR SWATCHES ──
function renderColorSwatches() {
  var container = document.getElementById("pd-colors");

  if (!product.colors) {
    container.innerHTML = "";
    return;
  }

  var html = "";
  product.colors.forEach(function (color, index) {
    var activeClass = index === 0 ? " active" : "";
    html +=
      '<button class="pd-swatch' +
      activeClass +
      '" data-color-index="' +
      index +
      '" style="background:' +
      color.swatch +
      '" title="' +
      color.name +
      '"></button>';
  });
  container.innerHTML = html;
}

// Event delegation again — swatches are rendered dynamically above,
// so we listen on the parent container rather than each button.
document.getElementById("pd-colors").addEventListener("click", function (event) {
  var swatch = event.target.closest(".pd-swatch");
  if (!swatch) return;

  var colorIndex = parseInt(swatch.getAttribute("data-color-index"), 10);
  var chosenColor = product.colors[colorIndex];

  // Never mix images from different colors — fully replace the set
  currentImages = chosenColor.images;
  currentIndex = 0;

  document.querySelectorAll(".pd-swatch").forEach(function (el) {
    el.classList.remove("active");
  });
  swatch.classList.add("active");

  renderGallery();
  restartAutoplay();
});

// ── GALLERY RENDERING ──
function renderGallery() {
  // Fade effect: briefly drop opacity to 0, swap the src while invisible,
  // then let CSS's "transition: opacity" (see .pd-main-image in styles.css)
  // fade it back in. This is what turns a plain src swap into the smooth
  // fade transition the design calls for.
  mainImageEl.classList.add("pd-fade");
  setTimeout(function () {
    mainImageEl.src = currentImages[currentIndex];
    mainImageEl.alt = product.name + " — image " + (currentIndex + 1);
    mainImageEl.classList.remove("pd-fade");
    // Same photo, blurred, filling the frame edge-to-edge behind it —
    // see buildShopCardHTML in products-data.js for the full reasoning.
    mainBgEl.src = currentImages[currentIndex];
  }, 220);

  var hasMultiple = currentImages.length > 1;

  // Thumbnails
  if (hasMultiple) {
    var thumbHtml = "";
    currentImages.forEach(function (img, i) {
      var activeClass = i === currentIndex ? " active" : "";
      thumbHtml +=
        '<button class="pd-thumb' +
        activeClass +
        '" data-index="' +
        i +
        '"><img src="' +
        img +
        '" alt="Thumbnail ' +
        (i + 1) +
        '" loading="lazy" /></button>';
    });
    thumbsEl.innerHTML = thumbHtml;
  } else {
    thumbsEl.innerHTML = "";
  }

  // Dots
  if (hasMultiple) {
    var dotHtml = "";
    currentImages.forEach(function (img, i) {
      var activeClass = i === currentIndex ? " active" : "";
      dotHtml += '<span class="pd-dot' + activeClass + '" data-index="' + i + '"></span>';
    });
    dotsEl.innerHTML = dotHtml;
  } else {
    dotsEl.innerHTML = "";
  }

  // Counter text like "Image 2 of 5" — only worth showing if there's more than one
  counterEl.textContent = hasMultiple
    ? "Image " + (currentIndex + 1) + " of " + currentImages.length
    : "";
}

function goToImage(index) {
  var total = currentImages.length;
  // The % (modulo) wraps the index around so it loops infinitely:
  // going past the last image jumps back to the first, and vice versa.
  currentIndex = ((index % total) + total) % total;
  renderGallery();
}

function nextImage() {
  goToImage(currentIndex + 1);
}

function prevImage() {
  goToImage(currentIndex - 1);
}

// Manual navigation (thumbnail click, dot click, swipe) all funnel through
// here. Per the brief, once someone manually picks an image, autoplay
// should stop for good — not pause and resume later.
function manualGoToImage(index) {
  goToImage(index);
  clearInterval(autoplayInterval);
}

thumbsEl.addEventListener("click", function (event) {
  var thumb = event.target.closest(".pd-thumb");
  if (!thumb) return;
  manualGoToImage(parseInt(thumb.getAttribute("data-index"), 10));
});

dotsEl.addEventListener("click", function (event) {
  var dot = event.target.closest(".pd-dot");
  if (!dot) return;
  manualGoToImage(parseInt(dot.getAttribute("data-index"), 10));
});

// ── AUTOPLAY ──
// Runs a check every 5 seconds. Rather than stopping/starting the timer
// every time something wants to pause it, we just check "is anything
// currently asking for a pause?" on each tick. Simpler and avoids bugs
// where two different pause reasons fight over the same timer.
function startAutoplay() {
  clearInterval(autoplayInterval);
  if (currentImages.length <= 1) return; // nothing to cycle through

  autoplayInterval = setInterval(function () {
    if (!pausedByHover) {
      nextImage();
    }
  }, 5000);
}

function restartAutoplay() {
  startAutoplay();
}

// Pause while hovering (desktop)
galleryWrap.addEventListener("mouseenter", function () {
  pausedByHover = true;
});
galleryWrap.addEventListener("mouseleave", function () {
  pausedByHover = false;
});

// ── SWIPE SUPPORT (mobile) ──
var touchStartX = 0;

galleryWrap.addEventListener("touchstart", function (event) {
  pausedByHover = true; // reuse the same "pause" flag while a touch is active
  touchStartX = event.touches[0].clientX;
});

galleryWrap.addEventListener("touchend", function (event) {
  var touchEndX = event.changedTouches[0].clientX;
  var deltaX = touchEndX - touchStartX;
  var SWIPE_THRESHOLD = 50; // pixels — anything smaller is just a tap

  if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
    if (deltaX < 0) {
      manualGoToImage(currentIndex + 1); // swiped left → next image
    } else {
      manualGoToImage(currentIndex - 1); // swiped right → previous image
    }
  }

  pausedByHover = false;
});

// ── WHATSAPP LINKS ──
function setupWhatsAppLinks() {
  var link = whatsappOrderLink(product.name, product.price);
  document.getElementById("pd-whatsapp-btn").setAttribute("href", link);
  document.getElementById("pd-sticky-whatsapp").setAttribute("href", link);
}

// ── RELATED PRODUCTS ──
function renderRelatedProducts() {
  var related = getProductsByCategory(product.category).filter(function (p) {
    return p.id !== product.id; // don't show the product on its own page
  });

  var container = document.getElementById("pd-related");

  if (related.length === 0) {
    document.getElementById("pd-related-section").style.display = "none";
    return;
  }

  var html = "";
  related.forEach(function (p) {
    html += buildShopCardHTML(p);
  });
  container.innerHTML = html;
}

setupProduct();
