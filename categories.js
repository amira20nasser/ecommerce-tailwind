import { fetchCategories } from "./api/fetch_categories.js";

const container = document.getElementById("categories");
const loading = document.getElementById("loading");

async function BuildUI() {
    try {
        const categories = await fetchCategories();
        const categoriesWithImages = await Promise.all(
            categories.map(async (category) => {
                try {
                    const res = await fetch(`https://dummyjson.com/products/category/${category}`);
                    const data = await res.json();

                    return {
                        name: category,
                        image: data.products?.[0]?.thumbnail || ""
                    };
                } catch {
                    return {
                        name: category,
                        image: ""
                    };
                }
            })
        );

        loading.style.display = "none";
        container.classList.remove("hidden");

        categoriesWithImages.forEach((cat) => {
            const card = document.createElement("div");

            card.className = `
            bg-white rounded-2xl overflow-hidden shadow-sm
            hover:shadow-lg transition cursor-pointer
            flex flex-col
          `;

            card.innerHTML = `
            <div class="h-28 bg-gray-100 flex items-center justify-center">
              <img 
                src="${cat.image}" 
                alt="${cat.name}"
                class="h-full w-full object-contain"
              />
            </div>

            <div class="p-3 text-center">
              <h2 class="text-sm font-semibold text-gray-800 capitalize">
                ${cat.name}
              </h2>
            </div>
          `;

            card.onclick = () => {
                window.location.href = `./products.html?category=${cat.name}`;
            };

            container.appendChild(card);
        });

    } catch (err) {
        loading.innerText = "Failed to load categories";
        console.error(err);
    }
}

BuildUI();
