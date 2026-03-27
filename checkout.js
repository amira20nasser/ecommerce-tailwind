import { getCart, saveCart, removeFromCart, addToCart } from './cart.js'
import { login, refreshUserToken, getCurrentUser } from './api/auth.js'
import { deleteCookie, getCookie, setCookie } from './cookies/cookie.js';

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










// NAVVVVV
document.addEventListener("DOMContentLoaded", () => {
    checkIfUserLoggedIn();
    loadQuote();
    ShopByCategoryUI();
});

let isUserLogged = false;
const dom = {
    modal: document.getElementById("modal"),
    signButton: document.getElementById("sign-in"),
    usernameInput: document.getElementById("username"),
    passwordInput: document.getElementById("password"),
    loginBtn: document.getElementById("login-btn"),
    loginForm: document.getElementById("login-form"),
    usernameError: document.getElementById("username-error"),
    passwordError: document.getElementById("password-error"),
    profileImage: document.getElementById("profile-image")
};


function openModal() {
    dom.modal.classList.remove("hidden");
    dom.modal.classList.add("flex");
}

function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

dom.signButton.addEventListener("click", () => {
    if (isUserLogged) {
        logoutUser();
    }
    else {
        openModal();
    }
    console.log("After press signButton User ? ", isUserLogged);
});

dom.modal.addEventListener("click", (e) => {
    if (e.target === dom.modal) closeModal();
});

window.closeModal = closeModal;

function logoutUser() {
    dom.signButton.textContent = "Log In";
    dom.signButton.classList.remove("text-red-300");
    dom.profileImage.classList.add("hidden");
    deleteCookie("access-token");
    deleteCookie("refresh-token");
    isUserLogged = false;
}

function isValidUsername(username) { return username.length >= 2; }
function isValidPassword(password) { return password.length >= 6; }

function validateForm() {
    const username = dom.usernameInput.value.trim();
    const password = dom.passwordInput.value.trim();

    dom.usernameError.textContent = isValidUsername(username) ? '' : "Please enter a valid e-mail.";
    dom.passwordError.textContent = isValidPassword(password) ? '' : "Password must be at least 6 characters long.";

    const formValid = isValidUsername(username) && isValidPassword(password);
    dom.loginBtn.disabled = !formValid;

    dom.loginBtn.classList.toggle("bg-gray-500", !formValid);
    dom.loginBtn.classList.toggle("cursor-not-allowed", !formValid);
    dom.loginBtn.classList.toggle("bg-[#152640]", formValid);
    dom.loginBtn.classList.toggle("hover:bg-[#28487a]", formValid);
}

dom.usernameInput.addEventListener("input", validateForm);
dom.passwordInput.addEventListener("input", validateForm);

function showLoadingButton() {
    dom.loginBtn.textContent = "Loading...";
    dom.loginBtn.classList.add("bg-gray-500", "cursor-not-allowed");
    dom.loginBtn.classList.remove("bg-[#152640]", "hover:bg-[#28487a]");
}

async function submitLoginData(username, password) {
    try {
        showLoadingButton();
        const user = await login(username, password);
        isUserLogged = true;
        dom.signButton.textContent = "Log Out";
        dom.signButton.classList.add("text-red-300");
        dom.profileImage.classList.remove("hidden");
        dom.profileImage.src = user.image;

        setCookie("access-token", user.accessToken, 1 * 24 * 60 * 60 * 1000);
        setCookie("refresh-token", user.refreshToken, 7 * 24 * 60 * 60 * 1000);
    } catch (error) {

        console.error("Login failed:", error);
        alert("Failed to log in")
        isUserLogged = false;
    } finally {
        closeModal();
        dom.loginBtn.textContent = "Sign In";
        dom.loginBtn.classList.remove("bg-gray-500", "cursor-not-allowed");
        dom.loginBtn.classList.add("bg-[#152640]", "hover:bg-[#28487a]");
    }
}

dom.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = dom.usernameInput.value.trim();
    const password = dom.passwordInput.value.trim();
    submitLoginData(username, password)
});


async function checkIfUserLoggedIn() {
    let accessToken = getCookie("access-token");
    if (accessToken) {
        let user = await getCurrentUser(accessToken);
        if (user) {
            document.getElementById("sign-in").textContent = "Log Out";
            document.getElementById("sign-in").classList.add("text-red-300");
            document.getElementById("profile-image").classList.remove("hidden")
            document.getElementById("profile-image").src = user.image;
            isUserLogged = true;
            console.log("User? " + isUserLogged);
            return true;
        } else {
            let refreshToken = getCookie("refresh-token");
            if (refreshToken) {
                let newTokens = refreshUserToken(refreshToken);
                setCookie("access-token", newTokens.accessToken, 24 * 60 * 60 * 1000);
                setCookie("refresh-token", newTokens.refreshToken, 7 * 24 * 60 * 60 * 1000);
            }
        }
    }
    isUserLogged = false;
    console.log("User? " + isUserLogged);
    return false;
}
