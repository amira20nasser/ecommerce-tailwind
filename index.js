import { fetchCategories } from "./api/fetch_categories.js";
import { fetchQuote } from "./api/fetch_quote.js";
import { login, refreshUserToken, getCurrentUser } from './api/auth.js'
import { deleteCookie, getCookie, setCookie } from './cookies/cookie.js';
import { getCart } from './cart.js'
document.addEventListener("DOMContentLoaded", () => {
    checkIfUserLoggedIn();
    loadQuote();
    ShopByCategoryUI();
})

const dom = {
    categoriesContainer: document.getElementById("all-categories"),
    quoteDiv: document.getElementById("quote"),
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

let isUserLogged = false;

async function ShopByCategoryUI() {

    const categoryImages = {
        beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
        fragrances: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
        furniture: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
        groceries: "https://images.unsplash.com/photo-1542838132-92c53300491e",
        other: "https://images.unsplash.com/photo-1763872038252-e6c4e0a11067"
    };
    function formatSubtitle(category) {
        const map = {
            beauty: "Glow Essentials",
            fragrances: "Luxury Scents",
            furniture: "Modern Living",
            groceries: "Daily Needs"
        };

        return map[category] || "Explore Now";
    }

    function ShowCategories(container, categories) {
        container.innerHTML = categories.map(category => `
        <div class="relative rounded-xl overflow-hidden group cursor-pointer"
             onclick="window.location.href='./products.html?category=${category}'">

            <img src="${categoryImages[category] || categoryImages['other']}"
                 class="w-full h-80 object-cover group-hover:scale-110 transition duration-500" />

            <div class="absolute inset-0 bg-black/30 flex flex-col justify-end p-4 text-white">
                <span class="text-sm opacity-80">${formatSubtitle(category)}</span>
                <h3 class="text-lg font-bold capitalize">${category}</h3>
                <span class="text-sm mt-1">
                    See Products <i class="fa-solid fa-arrow-right"></i>
                </span>
            </div>
        </div>
    `).join("");
    }

    const categories = await fetchCategories(4);
    ShowCategories(dom.categoriesContainer, categories);
}

function showLoading() { return `<p>Loading... </p>` };
function showError() { return `<p>Sorry....</p>` };

function showQuote(Quote) {

    dom.quoteDiv.innerHTML =
        `<div class="text-6xl text-gray-700">“</div>
        <p class="text-xl md:text-2xl text-gray-800 font-light mt-4">
            “${Quote.quote}”
        </p>
        <div class="mt-6 text-gray-600">
            — ${Quote.author}
    </div>`
}

async function loadQuote() {
    try {
        dom.quoteDiv.innerHTML = showLoading()
        const quote = await fetchQuote();
        showQuote(quote);
    } catch (error) {
        console.error(error);
        dom.quoteDiv.innerHTML = showError();
    }
}

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


function updateCartBadge() {
    const cartCount = getCart().length;
    const badge = document.getElementById('cart-count');
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? 'flex' : 'none';
}

updateCartBadge();