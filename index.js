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