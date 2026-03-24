import { fetchProducts } from "./api/fetch_products.js";

const container = document.getElementById("products-container");

const category = new URLSearchParams(window.location.search).get("category");

async function ProductsUI() {
    const loadingDiv = document.createElement("div");
    loadingDiv.textContent = "Loading Products..."
    loadingDiv.classList.add("text-gray-500");
    container.appendChild(loadingDiv);
    const products = await fetchProducts(category);
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

ProductsUI();