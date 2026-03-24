export async function fetchQuote() {
    try {

        const res = await fetch(`https://dummyjson.com/quotes/random`);

        const data = await res.json();
        return data;

    } catch (err) {
        console.error("Error fetching qoute:", err);
        throw err;
    }
}