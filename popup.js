document.getElementById("close-button").addEventListener("click", function (event) {
    event.preventDefault();
    window.close();
});

document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const ingredients = document.getElementById("search-bar").value;

    // Format the search query
    const query = `${ingredients.split(",").map((ing) => ing.trim()).join(" ")} recipes`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Open a new tab with the search results
    chrome.tabs.create({ url: url });
});

//Meal Categories
const breakfastButton = document.getElementById("breakfast-button");

breakfastButton.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "breakfast.html";
});
