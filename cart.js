// CART STORAGE
function getCart() {
  const saved = localStorage.getItem("udems_cart");
  return saved ? JSON.parse(saved) : [];
}

function saveCart(cartArray) {
  localStorage.setItem("udems_cart", JSON.stringify(cartArray));
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = getCartCount();
  }
}

updateCartBadge();

// A cart line is now identified by id + color together, not id alone.
// Two colors of the same bag are different lines; two "no color"
// products with the same id are still the same line (color is
// undefined for both, and undefined === undefined is true).
function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(
    (cartItem) => cartItem.id === item.id && cartItem.color === item.color,
  );
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
}

function renderCartDrawer() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal-amount");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="cart-empty">Your cart is empty.<br><a href="products.html" class="cart-empty-link">Browse Products →</a></p>';
  } else {
    container.innerHTML = cart
      .map(function (item) {
        const colorLabel = item.color ? " — " + item.color : "";
        // Empty string (not the literal word "undefined") when there's
        // no color, so reading it back later gives us a clean value.
        const colorAttr = item.color || "";
        return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-info">
            <h4>${item.name}${colorLabel}</h4>
            <p class="cart-item-price">₦${item.price.toLocaleString("en-NG")}</p>
            <div class="cart-item-qty">
              <button class="cart-qty-btn" data-action="decrease" data-id="${item.id}" data-color="${colorAttr}">-</button>
              <input
                type="number"
                class="cart-qty-input"
                data-id="${item.id}"
                data-color="${colorAttr}"
                value="${item.qty}"
                min="1"
              />
              <button class="cart-qty-btn" data-action="increase" data-id="${item.id}" data-color="${colorAttr}">+</button>
              <button class="cart-item-remove" data-action="remove" data-id="${item.id}" data-color="${colorAttr}">Remove</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  subtotalEl.textContent = "₦" + subtotal.toLocaleString("en-NG");
  updateCheckoutLink(cart);
}

function changeQty(id, color, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id && i.color === color);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id, color);
    return;
  }
  saveCart(cart);
  updateCartBadge();
  renderCartDrawer();
}

function setQty(id, color, newQty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id && i.color === color);
  if (!item) return;
  if (newQty <= 0) {
    removeFromCart(id, color);
    return;
  }
  item.qty = newQty;
  saveCart(cart);
  updateCartBadge();
  renderCartDrawer();
}

function removeFromCart(id, color) {
  let cart = getCart();
  cart = cart.filter((i) => !(i.id === id && i.color === color));
  saveCart(cart);
  updateCartBadge();
  renderCartDrawer();
}

function updateCheckoutLink(cart) {
  const btn = document.getElementById("cart-checkout-btn");
  if (!btn) return;
  if (cart.length === 0) {
    btn.href = "#";
    return;
  }
  let message = "Hello, I want to order:\n\n";
  cart.forEach(function (item) {
    const colorLabel = item.color ? " (" + item.color + ")" : "";
    message += `- ${item.name}${colorLabel} x${item.qty} (₦${(item.price * item.qty).toLocaleString("en-NG")})\n`;
  });
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  message += `\nTotal: ₦${subtotal.toLocaleString("en-NG")}`;
  btn.href = "https://wa.me/2349022844951?text=" + encodeURIComponent(message);
}

function openCart() {
  renderCartDrawer();
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

// Grid-card "Add to Cart" has no color picker, so it defaults to
// whichever color is actually shown in that card's thumbnail —
// the product's first listed color.
function addProductToCartById(id) {
  const product = getProductById(id);
  if (!product) return;
  const thumb = product.colors
    ? product.colors[0].images[0]
    : product.images[0];
  const defaultColor = product.colors ? product.colors[0].name : undefined;
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: thumb,
    color: defaultColor,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const cartLink = document.querySelector(".cart-icon-link");
  const closeBtn = document.getElementById("cart-close-btn");
  const overlay = document.getElementById("cart-overlay");
  const itemsContainer = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("cart-checkout-btn");

  if (cartLink)
    cartLink.addEventListener("click", function (e) {
      e.preventDefault();
      openCart();
    });
  if (closeBtn) closeBtn.addEventListener("click", closeCart);
  if (overlay) overlay.addEventListener("click", closeCart);

  if (itemsContainer) {
    itemsContainer.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      const color = btn.getAttribute("data-color") || undefined;
      const action = btn.getAttribute("data-action");

      if (action === "increase") changeQty(id, color, 1);
      if (action === "decrease") changeQty(id, color, -1);
      if (action === "remove") removeFromCart(id, color);
    });

    itemsContainer.addEventListener("change", function (e) {
      if (!e.target.classList.contains("cart-qty-input")) return;
      const id = e.target.getAttribute("data-id");
      const color = e.target.getAttribute("data-color") || undefined;
      let newQty = parseInt(e.target.value, 10);
      if (isNaN(newQty) || newQty < 1) newQty = 1;
      setQty(id, color, newQty);
    });
  }

  document.body.addEventListener("click", function (e) {
    const addBtn = e.target.closest(".shop-card-add-btn");
    if (!addBtn) return;
    e.preventDefault();
    addProductToCartById(addBtn.getAttribute("data-id"));
    openCart();
  });
});

