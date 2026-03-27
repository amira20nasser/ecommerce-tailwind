import { fetchProducts } from "./api/fetch_products.js";
import { fetchCategories } from "./api/fetch_categories.js";
import { toggleCart, isInCart, getCart } from "./cart.js";


const container = document.getElementById("products-container");
const categoriesList = document.getElementById("categories-list");
const cartCount = document.getElementById("cart-count");
const cartBtn = document.getElementById("cart-btn");

let selectedCategories = new Set();

const categoryURL = new URLSearchParams(window.location.search).get("category");
if (categoryURL) {
    selectedCategories.add(categoryURL);
}
function updateCartCount() {
    const cartLength = getCart().length;
    const isEmpty = cartLength === 0;

    cartBtn.classList.toggle("bg-[#333]", isEmpty);
    cartBtn.classList.toggle("cursor-not-allowed", isEmpty);
    cartBtn.classList.toggle("cursor-pointer", !isEmpty);

    cartCount.textContent = cartLength;
}
document.addEventListener("DOMContentLoaded", updateCartCount);

function showLoading() {
    container.innerHTML = `<p class="text-gray-500">Loading Products...</p>`;
}

function showError() {
    container.innerHTML = `<p class="text-red-500">Something went wrong</p>`;
}

function showEmpty() {
    container.innerHTML = `<p>No products found</p>`;
}

function showProducts(products) {
    if (!products || products.length === 0) {
        showEmpty();
        return;
    }

    let html = "";
    products.forEach(product => {
        html += `
        <div class="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
        <img src="${product.thumbnail}" 
        class="rounded-lg mb-3 w-full h-48 object-contain"/>
        
                <h3 class="font-semibold text-gray-800">
                ${product.title}
                </h3>

                   <p class="text-gray-500 text-sm mb-2">
                         ${product.description.slice(0, 50)}...
                    </p>

                    <div class="flex justify-between items-center">
                    <span class="text-[#1c2a3f] font-bold">
                    $${product.price}
                    </span>
                    
                    <button 
                    data-id="${product.id}" 
                    class="cart-btn bg-[#1c2a3f] text-white px-3 py-1 rounded-lg hover:bg-blue-900">
                          ${isInCart(product.id) ? "Remove" : "Add"}
                        </button>
                    </div>
            </div>`;

    });
    container.innerHTML = html;

    document.querySelectorAll(".cart-btn").forEach(button => {
        button.addEventListener("click", () => {
            console.log(button.dataset);

            const productId = Number(button.dataset.id);
            const product = products.find(p => p.id === productId);
            toggleCart(product);
            button.textContent = isInCart(productId) ? "Remove" : "Add";
            updateCartCount();
        });
    });
    // console.log(container.innerHTML);

}

async function loadProducts() {
    try {
        showLoading();

        let products;
        if (selectedCategories.size === 0) {
            products = await fetchProducts();
        } else {
            const results = await Promise.all([...selectedCategories].map(category => fetchProducts(category)));
            // console.log("=========results Before flat===========");
            // console.log(results);
            products = results.flat();
            // console.log("=========results AFTER flat===========");
            // console.log(products);
        }
        showProducts(products);
    } catch (error) {
        console.error(error);
        showError();
    }
}

async function showCategoriesFilter() {
    try {
        const categories = await fetchCategories();
        categoriesList.innerHTML = "";
        categories.forEach(category => {
            let li = document.createElement("li");

            const label = document.createElement("label");
            label.className = "flex items-center gap-2 cursor-pointer";

            const checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.name = category;

            if (selectedCategories.has(category)) {
                checkBox.checked = true;
            }

            checkBox.addEventListener("change", function () {
                if (this.checked) {
                    selectedCategories.add(this.name);
                } else {
                    selectedCategories.delete(this.name);
                }
                loadProducts();
            });
            const text = document.createTextNode(category);

            label.appendChild(checkBox);
            label.appendChild(text);
            li.appendChild(label);

            categoriesList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        categoriesList.appendChild(`<p class="text - red - 500">Something went wrong</p>`);
    }
}

async function run() {
    await showCategoriesFilter();
    await loadProducts();
}

run();