
const CART_KEY = "foodiehub_cart";

function getCart() {
    try {
        const value = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function money(value) {
    return "₹" + Number(value).toFixed(2);
}

function updateCartCount() {
    const count = getCart().reduce(
        (sum, item) => sum + Number(item.quantity || 0), 0
    );

    document.querySelectorAll("#cartCount").forEach(element => {
        element.textContent = count;
    });
}

function addToCart(button) {
    const item = {
        id: Number(button.dataset.id),
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image,
        quantity: 1
    };

    if (!Number.isFinite(item.id) ||
        !Number.isFinite(item.price) ||
        item.price < 0) {
        return;
    }

    const cart = getCart();
    const existing = cart.find(product => product.id === item.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(item);
    }

    saveCart(cart);

    const original = button.textContent;
    button.textContent = "Added ✓";
    button.disabled = true;

    setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
    }, 700);
}

function changeQuantity(id, change) {
    const cart = getCart();
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += change;

    const updated = cart.filter(product => product.quantity > 0);
    saveCart(updated);
    renderCart();
}

function removeFromCart(id) {
    saveCart(getCart().filter(item => item.id !== id));
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p class="text-muted">Discover something delicious today.</p>
                <a href="/Menu" class="btn btn-brand">Explore Menu</a>
            </div>`;
        updateSummary(0);
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item d-flex align-items-center gap-3">
            <img class="cart-thumb"
                 src="${escapeAttribute(item.image)}"
                 alt="${escapeAttribute(item.name)}">

            <div class="flex-grow-1">
                <h6 class="mb-1">${escapeHTML(item.name)}</h6>
                <div class="food-price">${money(item.price)}</div>

                <div class="d-flex align-items-center gap-2 mt-2">
                    <button class="btn btn-sm btn-outline-secondary"
                            onclick="changeQuantity(${item.id}, -1)"
                            aria-label="Decrease quantity">−</button>
                    <span>${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary"
                            onclick="changeQuantity(${item.id}, 1)"
                            aria-label="Increase quantity">+</button>
                    <button class="btn btn-sm btn-link text-danger"
                            onclick="removeFromCart(${item.id})">
                        Remove
                    </button>
                </div>
            </div>

            <strong>${money(item.price * item.quantity)}</strong>
        </div>
    `).join("");

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    const sub = document.getElementById("cartSubtotal");
    const total = document.getElementById("cartTotal");

    if (sub) sub.textContent = money(subtotal);
    if (total) total.textContent = money(subtotal);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function escapeAttribute(value) {
    return escapeHTML(value || "");
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    renderCart();

    document.querySelectorAll("[data-add-cart]").forEach(button => {
        button.addEventListener("click", () => addToCart(button));
    });
});
