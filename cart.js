

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function isInCart(productId) {
    return getCart().some(item => item.id === productId);
}

function addToCart(product) {
    const cart = getCart();

    if (!isInCart(product.id)) {
        cart.push(product);
        saveCart(cart);
    }
}

function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
}

function toggleCart(product) {
    if (isInCart(product.id)) {
        removeFromCart(product.id);
    } else {
        addToCart(product);
    }
}


export { addToCart, getCart, removeFromCart, toggleCart, isInCart }