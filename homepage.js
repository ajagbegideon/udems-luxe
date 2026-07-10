/*
  HOMEPAGE LOGIC
  --------------
  Two independent jobs on this page:

  1. FEATURED COLLECTIONS — reuses buildCategoryCardHTML() from
     products-data.js, the exact same card used on products.html.
     One card design, two pages — change it once, it updates everywhere.

  2. HERO IMAGE COMPOSITION — a small "back" accent card that stays
     still, and a larger "front" card that slowly cross-fades through
     a few featured products. This is ambient brand storytelling, not
     a product gallery — so it's slow (6s) and has no manual controls.
*/

// ── FEATURED COLLECTIONS ──
var homeCatGrid = document.getElementById("cat-hero-grid");
if (homeCatGrid) {
  var catHtml = "";
  CATEGORIES.forEach(function (cat) {
    catHtml += buildCategoryCardHTML(cat);
  });
  homeCatGrid.innerHTML = catHtml;
}

// ── HERO — STATIC BACK ACCENT IMAGE ──
var heroBackImg = document.getElementById("hero-back-img");
if (heroBackImg) {
  var backProduct = getProductById("crossbody-messenger-bag");
  if (backProduct) {
    var backImages = backProduct.colors
      ? backProduct.colors[0].images
      : backProduct.images;
    heroBackImg.src = backImages[0];
    heroBackImg.alt = backProduct.name + " — Udems Luxe Collections";
  }
}

// ── HERO — ROTATING FRONT IMAGE ──
var heroFrontImg = document.getElementById("hero-front-img");
if (heroFrontImg) {
  // A short, hand-picked list of the most visually striking products —
  // this is a curated brand moment, not "show everything", so it's
  // fine that this list is deliberately short and specific.
  var heroFeaturedIds = [
    "black-pleated-fashion-bag",
    "premium-handbag-purse-set",
    "blue-fashion-bag-pink-charm",
  ];
  var heroIndex = 0;

  function showHeroImage(i) {
    var p = getProductById(heroFeaturedIds[i]);
    if (!p) return;

    heroFrontImg.classList.add("hero-fade-out");
    setTimeout(function () {
      heroFrontImg.src = p.images[0];
      heroFrontImg.alt = p.name + " — Udems Luxe Collections";
      heroFrontImg.classList.remove("hero-fade-out");
    }, 300);
  }

  showHeroImage(heroIndex);

  setInterval(function () {
    heroIndex = (heroIndex + 1) % heroFeaturedIds.length;
    showHeroImage(heroIndex);
  }, 6000);
}
