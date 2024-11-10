document.getElementById("recipe-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const ingredients = document.getElementById("ingredients").value;

    // Format the search query
    const query = `${ingredients.split(",").map((ing) => ing.trim()).join(" ")} recipes`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Open a new tab with the search results
    chrome.tabs.create({ url: url });
});