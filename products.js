import { fetchProducts } from "./api/fetch_products.js";
import { fetchCategories } from "./api/fetch_categories.js"
const container = document.getElementById("products-container");


async function productsUI(category, clear = false) {
    const loadingDiv = document.createElement("div");
    loadingDiv.textContent = "Loading Products..."
    loadingDiv.classList.add("text-gray-500");
    container.appendChild(loadingDiv);
    const products = await fetchProducts(category);
    if (clear)
        container.innerHTML = "";

    if (products?.length === 0) {
        container.innerHTML = "<p>No products found</p>";
        return;
    }
    loadingDiv.style.display = "none";
    products.forEach(product => {
        container.innerHTML += `
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

                    <button class="bg-[#1c2a3f] text-white px-3 py-1 rounded-lg hover:bg-blue-900">
                        Add
                    </button>
                </div>
            </div>
        `;
    });
}
const categoryURL = new URLSearchParams(window.location.search).get("category");
productsUI(categoryURL);

let selectedCategories = new Set();
async function filterProducts() {
    const filtersDiv = document.getElementById("filters-section");
    const selectedCategory = new URLSearchParams(window.location.search).get("category");

    // if (selectedCategory) {
    //     filtersDiv.style.display = "none";
    //     return;
    // }

    const categories = await fetchCategories();
    let categoriesList = document.getElementById("categories-list");


    categoriesList.innerHTML = "";
    categories.forEach(category => {
        let li = document.createElement("li");
        const label = document.createElement("label");
        label.className = "flex items-center gap-2 cursor-pointer";

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.name = category;
        if (categoryURL == category) {
            checkBox.checked = true;
        }
        // checkBox.addEventListener("change", function () {
        //     if (this.checked) {
        //         productsUI(this.name, isFirstChecked);
        //         isFirstChecked = false;
        //         // window.location.href = `/products.html?category=${this.name}`;
        //     } else {
        //         console.log(categoryURL);
        //         if (categoryURL) {
        //             productsUI(categoryURL, isFirstChecked);
        //             this.checked = true;
        //         } else {
        //             console.log("SHOW ALL ");

        //             productsUI(null, true);
        //         }
        //     }
        // });
        checkBox.addEventListener("change", function () {
            if (this.checked) {
                selectedCategories.add(this.name);
            } else {
                selectedCategories.delete(this.name);
            }
            if (selectedCategories.size === 0) {
                productsUI(null, true);
            } else {
                container.innerHTML = "";
                for (let category of selectedCategories) {
                    productsUI(category, false);
                }
            }
        });
        const text = document.createTextNode(category);

        label.appendChild(checkBox);
        label.appendChild(text);
        li.appendChild(label);

        categoriesList.appendChild(li);
    });
}

filterProducts();