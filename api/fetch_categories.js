export async function fetchCategories(limit = null) {
    try {
        const res = await fetch("https://dummyjson.com/products/category-list");
        const categories = await res.json();

        return limit ? categories.slice(0, limit) : categories;

    } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
    }
}