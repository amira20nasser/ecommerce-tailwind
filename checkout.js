import { getCart, saveCart, removeFromCart, addToCart } from './cart.js'
const cartContainer = document.getElementById("cart-container");
const totalPriceEl = document.getElementById("total-price");

function showCart() {
    const cart = getCart();

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-[96vh] text-gray-700 text-xl  rounded-xl">
            <i class="fas fa-shopping-cart text-4xl mb-4"></i>
            <p>Your cart is empty</p>
            <a href="./products.html" class="text-[#2e528c]  hover:underline ">Go to product </a>
        </div>
    `;
        document.getElementById("price-div").style.display = "none";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;

        cartContainer.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <img src="${item.thumbnail}" class="w-20 h-20 object-cover rounded-lg"/>
                    <div>
                        <h2 class="font-bold text-lg">${item.title}</h2>
                        <p class="text-gray-500">$${item.price}</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <button data-index="${index}" class="decrease px-3 py-1 bg-gray-200 rounded ">-</button>
                    <span>${item.quantity || 1}</span>
                    <button data-index="${index}" class="increase px-3 py-1 bg-gray-200 rounded ">+</button>
                </div>

                <div class="text-right">
                    <p class="font-bold">$${itemTotal.toFixed(2)}</p>
                    <button data-index="${index}" class="remove text-red-500 text-sm ">Remove</button>
                </div>
            </div>
        `;
    });
    cartContainer.querySelectorAll(".increase").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            increaseQty(cart[index]);
        });
    });

    cartContainer.querySelectorAll(".decrease").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            decreaseQty(cart[index]);
        });
    });

    cartContainer.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            removeFromCart(cart[index], true);
            showCart();
        });
    });
    totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

function increaseQty(product) {
    addToCart(product);
    showCart();
}

function decreaseQty(product) {
    removeFromCart(product)
    showCart();
}

showCart();