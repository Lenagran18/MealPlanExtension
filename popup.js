document.addEventListener("DOMContentLoaded", () => {
    const mainView = document.getElementById("main-view");
    const savedView = document.getElementById("meal-categories-view");
    const backButton = document.getElementById("back-button");
    const categoryTitle = document.getElementById("category-title");
    const categoryIcon = document.getElementById("category-icon");

    const categoryIcons = {
        breakfast: "assets/breakfast.png",
    };

    //Close button functionality
    document.getElementById("close-button").addEventListener("click", function (event) {
        event.preventDefault();
        window.close();
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
    const breakfastButton = document.querySelector(".category-button");

    breakfastButton.addEventListener("click", function (event) {
        event.preventDefault();
        categoryTitle.textContent = "Breakfast";
        categoryIcon.src = categoryIcons.breakfast;

        // Hide the main view and show the saved view
        mainView.style.display = "none";
        savedView.style.display = "block";
    });

    //Back buton functionality
    backButton.addEventListener("click", function (event) {
        event.preventDefault();
        savedView.style.display = "none";
        mainView.style.display = "block";
    });

});
