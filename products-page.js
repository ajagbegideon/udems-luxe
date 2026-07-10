/*
  PRODUCTS PAGE LOGIC
  -------------------
  This file turns the CATEGORIES and PRODUCTS arrays (from
  products-data.js) into actual HTML on the page.

  Three jobs:
  1. renderCategoryCards()  → the 4 big category tiles
  2. renderFilterTabs()     → "All / Everyday Bags / School Bags..." tabs
  3. renderProductGrid(cat) → the actual product cards, filtered by category
*/

var catHeroGrid = document.getElementById("cat-hero-grid");
var filterTabs = document.getElementById("filter-tabs");
var shopGrid = document.getElementById("shop-grid");

// Keeps track of which category is currently selected ("all" = no filter)
var activeCategory = "all";

function renderCategoryCards() {
  var html = "";
  CATEGORIES.forEach(function (cat) {
    html += buildCategoryCardHTML(cat); // shared with the homepage now
  });
  catHeroGrid.innerHTML = html;
}

function renderFilterTabs() {
  var html = '<button class="filter-tab active" data-category="all">All</button>';

  CATEGORIES.forEach(function (cat) {
    html +=
      '<button class="filter-tab" data-category="' +
      cat.slug +
      '">' +
      cat.name +
      "</button>";
  });

  filterTabs.innerHTML = html;
}

function renderProductGrid(categorySlug) {
  var list =
    categorySlug === "all" ? PRODUCTS : getProductsByCategory(categorySlug);

  if (list.length === 0) {
    shopGrid.innerHTML =
      '<p class="shop-empty">No products in this category yet.</p>';
    return;
  }

  var html = "";

  list.forEach(function (product) {
    html += buildShopCardHTML(product); // defined once in products-data.js
  });

  shopGrid.innerHTML = html;
}

// EVENT DELEGATION:
// The category cards and filter tabs are created AFTER the page loads
// (by the render functions above), so we can't attach a listener to
// each one directly — they don't exist yet when this script first runs.
// Instead we listen on the PARENT container, which already exists,
// and check what was actually clicked. One listener covers every
// card/tab, even ones added later.

catHeroGrid.addEventListener("click", function (event) {
  var card = event.target.closest(".cat-hero-card");
  if (!card) return;

  event.preventDefault(); // don't jump instantly, let filter apply first
  var slug = card.getAttribute("data-category");
  setActiveCategory(slug);
  document
    .getElementById("shop-grid-section")
    .scrollIntoView({ behavior: "smooth" });
});

filterTabs.addEventListener("click", function (event) {
  var tab = event.target.closest(".filter-tab");
  if (!tab) return;

  var slug = tab.getAttribute("data-category");
  setActiveCategory(slug);
});

function setActiveCategory(slug) {
  activeCategory = slug;

  // Update which tab looks "active"
  var allTabs = filterTabs.querySelectorAll(".filter-tab");
  allTabs.forEach(function (tab) {
    if (tab.getAttribute("data-category") === slug) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  renderProductGrid(slug);
}

// Initial render on page load
renderCategoryCards();
renderFilterTabs();

// If someone arrived via a link like products.html#fashion-bags (from the
// homepage's Featured Collections, for example), open already filtered
// to that category instead of always starting on "All".
var hashCategory = window.location.hash.replace("#", "");
var matchedCategory = getCategoryBySlug(hashCategory);

if (matchedCategory) {
  setActiveCategory(hashCategory);
  // Jump straight to the grid — no smooth-scroll animation on initial
  // load, that would look like an unwanted jump-scroll to the visitor.
  document.getElementById("shop-grid-section").scrollIntoView();
} else {
  renderProductGrid("all");
}
