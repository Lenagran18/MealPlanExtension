document.addEventListener("DOMContentLoaded", () => {
    const mainView = document.getElementById("main-view");
    const savedView = document.getElementById("meal-categories-view");
    const backButton = document.getElementById("back-button");
    const categoryTitle = document.getElementById("category-title");
    const categoryIcon = document.getElementById("category-icon");

    const categoryIcons = {
        breakfast: "assets/breakfast.png",
        lunch: "assets/lunch.png",
        dinner: "assets/dinner.png",
        dessert: "assets/dessert.png",
        drinks: "assets/drinks.png",
    };

    //Close button functionality
    const closeButton = document.querySelectorAll(".close-button");
    closeButton.forEach((button) => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            window.close();
        });
    });
   
    //Search form functionality
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
    const categoryButtons = document.querySelectorAll(".category-button");

    categoryButtons.forEach((button) => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const category = button.getAttribute("data-category");
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryIcon.src = categoryIcons[category];

            // Hide the main view and show the saved view
            mainView.style.display = "none";
            savedView.style.display = "block";
        });
    });

    //Back button functionality
    backButton.addEventListener("click", function (event) {
        event.preventDefault();
        savedView.style.display = "none";
        mainView.style.display = "block";
    });
});