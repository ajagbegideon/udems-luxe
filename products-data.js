/*
  PRODUCTS DATA — single source of truth
  ---------------------------------------
  Every product on the site is one object in this array.
  products.html and product.html both READ from this file —
  neither page hardcodes a single product name, price, or image.

  Why this matters (this is exactly what you're learning in
  Lesson 7 — arrays of objects):
  Instead of writing separate HTML for 9 products, we describe
  each product as DATA, then write ONE piece of code that turns
  data into HTML. Add a 10th product here and it just appears
  everywhere automatically — no HTML editing needed.

  HOW TO ADD/EDIT A PRODUCT:
  - id: unique, url-safe, no spaces (used in product.html?id=...)
  - category: must match a category "slug" below exactly
  - images: array of file paths. 1 image or 5 images both work —
    the gallery code adapts automatically (see gallery.js)
  - colors: OPTIONAL. Only add this if the product comes in more
    than one color. Each color has its OWN images array.
*/

const CATEGORIES = [
  {
    slug: "everyday-bags",
    name: "Everyday Bags",
    startingPrice: 6000,
    image: "images/categories/everyday-bags.webp",
    description: "Compact, versatile carry pieces for daily life in the city.",
  },
  {
    slug: "school-bags",
    name: "School Bags",
    startingPrice: 12000,
    image: "images/categories/school-bags.webp",
    description:
      "Durable backpacks and character sets built for everyday school runs.",
  },
  {
    slug: "fashion-bags",
    name: "Fashion Bags",
    startingPrice: 13500,
    image: "images/categories/fashion-bags.webp",
    description: "Statement handbags that elevate every outfit.",
  },
  {
    slug: "lunch-bags",
    name: "Lunch Bags",
    startingPrice: 9000,
    image: "images/categories/lunch-bags.webp",
    description:
      "Insulated, practical, and good-looking lunch carry for kids and adults.",
  },
];

const PRODUCTS = [
  {
    id: "crossbody-messenger-bag",
    name: "Crossbody Messenger Bag",
    category: "everyday-bags",
    price: 6000,
    priceMax: 8000, // shown as a range since price depends on size
    bestSeller: true,
    description:
      "A compact crossbody messenger built for daily movement around Lagos — light enough for a quick errand, structured enough for the office. Available in two colourways.",
    // Default/fallback images (used only if no color is selected yet)
    images: [
      "images/products/everyday-bags/crossbody-black-1.webp",
      "images/products/everyday-bags/crossbody-black-2.webp",
      "images/products/everyday-bags/crossbody-black-3.webp",
      "images/products/everyday-bags/crossbody-black-4.webp",
      "images/products/everyday-bags/crossbody-black-5.webp",
    ],
    colors: [
      {
        name: "Black",
        swatch: "#1a1a1a",
        images: [
          "images/products/everyday-bags/crossbody-black-1.webp",
          "images/products/everyday-bags/crossbody-black-2.webp",
          "images/products/everyday-bags/crossbody-black-3.webp",
          "images/products/everyday-bags/crossbody-black-4.webp",
          "images/products/everyday-bags/crossbody-black-5.webp",
        ],
      },
      {
        name: "Blue",
        swatch: "#3b5a8a",
        images: [
          "images/products/everyday-bags/crossbody-blue-1.webp",
          "images/products/everyday-bags/crossbody-blue-2.webp",
          "images/products/everyday-bags/crossbody-blue-3.webp",
          "images/products/everyday-bags/crossbody-blue-4.webp",
          "images/products/everyday-bags/crossbody-blue-5.webp",
        ],
      },
    ],
  },
  {
    id: "laptop-backpack",
    name: "Laptop Backpack",
    category: "school-bags",
    price: 12000,
    bestSeller: true,
    description:
      "A roomy, padded laptop backpack built for campus and daily commuting — dedicated laptop compartment, reinforced straps, and space for everything else you carry.",
    images: [
      "images/products/school-bags/laptop-backpack-1.webp",
      "images/products/school-bags/laptop-backpack-2.webp",
      "images/products/school-bags/laptop-backpack-3.webp",
      "images/products/school-bags/laptop-backpack-4.webp",
      "images/products/school-bags/laptop-backpack-5.webp",
    ],
  },
  {
    id: "captain-america-set",
    name: "Captain America Complete Set",
    category: "school-bags",
    price: 45000,
    description:
      "A complete themed school set for Captain America fans — backpack plus matching accessories, built for durability as much as style.",
    // Only 1 photo exists for this product right now.
    // The gallery code detects this and simply shows one image,
    // no thumbnails/dots/autoplay. Add more photos here later —
    // no code changes needed anywhere else.
    images: ["images/products/school-bags/captain-america-set-1.webp"],
  },
  {
    id: "cinderella-set",
    name: "Cinderella Complete Set",
    category: "school-bags",
    price: 45000,
    description:
      "A complete themed school set inspired by Cinderella — backpack plus matching accessories for girls who want their school bag to feel special.",
    images: ["images/products/school-bags/cinderella-set-1.webp"],
  },
  {
    id: "blue-fashion-bag-pink-charm",
    name: "Blue Fashion Bag with Pink Charm",
    category: "fashion-bags",
    price: 13500,
    description:
      "A playful, elegant blue fashion bag finished with a pink charm detail — an everyday statement piece that still feels premium.",
    images: [
      "images/products/fashion-bags/blue-pink-charm-bag-1.webp",
      "images/products/fashion-bags/blue-pink-charm-bag-2.webp",
      "images/products/fashion-bags/blue-pink-charm-bag-3.webp",
      "images/products/fashion-bags/blue-pink-charm-bag-4.webp",
      "images/products/fashion-bags/blue-pink-charm-bag-5.webp",
    ],
  },
  {
    id: "black-pleated-fashion-bag",
    name: "Black Pleated Fashion Bag",
    category: "fashion-bags",
    price: 18000,
    description:
      "A structured black pleated handbag with clean lines — versatile enough for both formal and casual occasions.",
    images: [
      "images/products/fashion-bags/black-pleated-bag-1.webp",
      "images/products/fashion-bags/black-pleated-bag-2.webp",
      "images/products/fashion-bags/black-pleated-bag-3.webp",
      "images/products/fashion-bags/black-pleated-bag-4.webp",
      "images/products/fashion-bags/black-pleated-bag-5.webp",
    ],
  },
  {
    id: "premium-handbag-purse-set",
    name: "Premium Black Handbag + Purse Set",
    category: "fashion-bags",
    price: 32000,
    description:
      "A matching handbag and purse set in premium black — a complete, polished look for anyone who wants their accessories to match.",
    images: [
      "images/products/fashion-bags/premium-handbag-purse-set-1.webp",
      "images/products/fashion-bags/premium-handbag-purse-set-2.webp",
      "images/products/fashion-bags/premium-handbag-purse-set-3.webp",
      "images/products/fashion-bags/premium-handbag-purse-set-4.webp",
      "images/products/fashion-bags/premium-handbag-purse-set-5.webp",
    ],
  },
  {
    id: "kids-lunch-bag",
    name: "Kids Lunch Bag",
    category: "lunch-bags",
    price: 9000,
    description:
      "An insulated, easy-to-clean lunch bag sized for kids — keeps food fresh for school and daily outings.",
    images: [
      "images/products/lunch-bags/kids-lunch-bag-1.webp",
      "images/products/lunch-bags/kids-lunch-bag-2.webp",
      "images/products/lunch-bags/kids-lunch-bag-3.webp",
      "images/products/lunch-bags/kids-lunch-bag-4.webp",
      "images/products/lunch-bags/kids-lunch-bag-5.webp",
    ],
  },
];

// Small helper functions used by both pages.
// Keeping these here (not duplicated in two files) is the same
// "single source of truth" idea applied to logic, not just data.

function formatNaira(amount) {
  return "₦" + amount.toLocaleString("en-NG");
}

function getProductById(id) {
  return PRODUCTS.find(function (p) {
    return p.id === id;
  });
}

function getProductsByCategory(categorySlug) {
  return PRODUCTS.filter(function (p) {
    return p.category === categorySlug;
  });
}

function getCategoryBySlug(slug) {
  return CATEGORIES.find(function (c) {
    return c.slug === slug;
  });
}

// Shared category-card markup — used by products.html's "Shop By Category"
// AND the homepage's "Featured Collections". One definition, two pages.
// The link always points straight at products.html#<slug>. On products.html
// itself, JS intercepts the click to filter in-place (see products-page.js).
// On the homepage, there's no interceptor, so it's a normal link — and
// because products-page.js checks the URL hash on load (see below), landing
// on products.html this way opens already filtered to the right category.
function buildCategoryCardHTML(cat) {
  return (
    '<a href="products.html#' +
    cat.slug +
    '" class="cat-hero-card" data-category="' +
    cat.slug +
    '" style="background-image: url(\'' +
    cat.image +
    "')\">" +
    '<div class="cat-hero-overlay">' +
    '<h3 class="cat-hero-title">' +
    cat.name +
    "</h3>" +
    '<p class="cat-hero-price">From ' +
    formatNaira(cat.startingPrice) +
    "</p>" +
    '<p class="cat-hero-desc">' +
    cat.description +
    "</p>" +
    '<span class="cat-hero-btn">View Collection →</span>' +
    "</div>" +
    "</a>"
  );
}
function whatsappOrderLink(productName, price) {
  const phone = "2349022844951";
  const message =
    "Hello, I want to order the " +
    productName +
    " (" +
    formatNaira(price) +
    ") from Udems Luxe Collections.";
  return "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
}

// Shared by products.html (product grid) AND product.html (related products)
// so the card markup only ever lives in ONE place.
//
// Each card renders the SAME image twice, stacked:
//  - a blurred copy filling the whole box edge-to-edge (the "backdrop")
//  - the real, sharp, uncropped photo centered on top (the "foreground")
// Plain white product photos look identical either way — a blurred white
// image is still just white. But styled/lifestyle photos (their own
// beige or dark background) get a matching blurred backdrop instead of
// sitting in a mismatched white box, so nothing needs to be manually
// flagged per-photo — it just works for both photo styles automatically.
function buildShopCardHTML(product) {
  var thumb = product.colors ? product.colors[0].images[0] : product.images[0];

  var priceLabel = product.priceMax
    ? formatNaira(product.price) + " – " + formatNaira(product.priceMax)
    : formatNaira(product.price);

  return (
    '<a href="product.html?id=' +
    product.id +
    '" class="shop-card">' +
    '<div class="shop-card-img-wrap">' +
    '<img src="' +
    thumb +
    '" class="shop-card-bg" alt="" aria-hidden="true" loading="lazy" />' +
    '<img src="' +
    thumb +
    '" class="shop-card-fg" alt="' +
    product.name +
    ' — Udems Luxe Collections" loading="lazy" />' +
    "</div>" +
    '<div class="shop-card-body">' +
    "<h3>" +
    product.name +
    "</h3>" +
    '<p class="shop-card-price">' +
    priceLabel +
    "</p>" +
    '<span class="shop-card-link">View Details →</span>' +
    "</div>" +
    "</a>"
  );
}
