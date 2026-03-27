function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    saveCart(cart);
}

function removeFromCart(product, collapse) {
    let cart = getCart();
    if (collapse) {
        cart = getCart().filter(item => item.id !== product.id);
        saveCart(cart);
        return;
    }
    const existing = cart.find(item => item.id === product.id);

    if (existing.quantity > 1) {
        existing.quantity = (existing.quantity || 1) - 1;
    } else {
        cart = getCart().filter(item => item.id !== product.id);
    }
    saveCart(cart);
}

function isInCart(productId) {
    return getCart().some(item => item.id === productId);
}

function toggleCart(product) {
    if (isInCart(product.id)) {
        removeFromCart(product, true);
    } else {
        addToCart(product);
    }
}

export { getCart, saveCart, addToCart, removeFromCart, toggleCart, isInCart };