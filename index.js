import { fetchCategories } from "./api/fetch_categories.js";
import { fetchQuote } from "./api/fetch_quote.js";


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
             onclick="window.location.href='/products.html?category=${category}'">

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

    const container = document.getElementById("all-categories");
    const categories = await fetchCategories(4);
    // console.log(container);

    ShowCategories(container, categories);
}




const quoteDiv = document.getElementById("quote");
function showLoading() { return `<p>Loading Quote...</p>` };
function showError() { return `<p>Sorry....</p>` };
function showQuote(Quote) {

    quoteDiv.innerHTML =
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
        quoteDiv.innerHTML = showLoading()
        const quote = await fetchQuote();
        console.log(quote);
        showQuote(quote);
    } catch (error) {
        console.error(error);
        quoteDiv.innerHTML = showError();
    }
}

function run() {
    loadQuote();
    ShopByCategoryUI();
}

run();


const modal = document.getElementById("modal");
const signButton = document.getElementById("sign-in");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const form = document.getElementById("login-form");

function openModal() {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

signButton.addEventListener("click", openModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

window.closeModal = closeModal;



let usernameError = document.getElementById('username-error');
let passError = document.getElementById('password-error');
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUsername(username) {
    return username.length >= 2;
}


function isValidPassword(password) {
    return password.length >= 6;
}

function validateForm() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    usernameError.textContent = '';
    passError.textContent = '';
    const isCorrectUsername = isValidUsername(username);
    const isCorrectPassword = isValidPassword(password);
    const isValidForm = isCorrectUsername && isValidPassword;
    if (!isCorrectUsername) {
        usernameError.innerHTML = "Please enter a valid e-mail.";
    }
    if (!isCorrectPassword) {
        passError.innerHTML = "Password must be at least 6 characters long."
    }
    loginBtn.disabled = !isValid;

    if (isValidForm) {
        loginBtn.classList.remove("bg-gray-500", "cursor-not-allowed");
        loginBtn.classList.add("bg-[#152640]", "hover:bg-[#28487a]");
    } else {
        loginBtn.classList.add("bg-gray-500", "cursor-not-allowed");
        loginBtn.classList.remove("bg-[#152640]", "hover:bg-[#28487a]");
    }
}

usernameInput.addEventListener("input", validateForm);
passwordInput.addEventListener("input", validateForm);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Username:", usernameInput.value);
    console.log("Password:", passwordInput.value);

    //API CALL
});