export async function fetchProducts(category = null, limit = null) {
    try {
        let endPoint = category
            ? `/products/category/${category}`
            : `/products`;
        console.log(endPoint);

        const res = await fetch(`https://dummyjson.com${endPoint}`);

        const data = await res.json();
        const products = data.products || []
        console.log(products);

        return limit ? products.slice(0, limit) : products;

    } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
    }
}