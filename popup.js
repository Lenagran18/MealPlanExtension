document.addEventListener("DOMContentLoaded", () => {
    const mainView = document.getElementById("main-view");
    const savedView = document.getElementById("meal-categories-view");
    const backButton = document.getElementById("back-button");
    const categoryTitle = document.getElementById("category-title");
    const categoryIcon = document.getElementById("category-icon");
    const saveRecipeButton = document.getElementById("save-recipe-button");
    const categorySelect = document.getElementById("category-select");
    const categoryDropdown = document.getElementById("category-dropdown");
    const categoryOptions = document.querySelectorAll(".category-option");

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

    //Back button functionality
    backButton.addEventListener("click", function (event) {
        event.preventDefault();
        savedView.style.display = "none";
        mainView.style.display = "block";
    });

    //Toggle save dropdown
    saveRecipeButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent click events from bubbling up
        categoryDropdown.style.display = categoryDropdown.style.display === "block" ? "none" : "block";
    });

    //Hide save dropdown when clicking outside of it
    document.addEventListener("click", (event) => {
        if (event.target !== saveRecipeButton && !categoryDropdown.contains(event.target)) {
            categoryDropdown.style.display = "none";
        }
    });

    //Save recipe to selected category
    categoryOptions.forEach((option) => {
        option.addEventListener("click", function () {
            const selectedCategory = option.getAttribute("data-category");

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const currentUrl = tabs[0].url;
                saveRecipes(currentUrl, selectedCategory);
                categorySelect.style.display = "none";
            });
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

    //Saved Recipes
    function saveRecipes(url, category) {
        chrome.storage.local.get([category], (result) => {
            let recipes = result[category] || [];

            if (!recipes.includes(url)) {
                recipes.push(url);
                chrome.storage.local.set({ [category]: recipes }, () => {
                    alert(`Recipe saved in ${category}!`);
                    console.log("Recipe saved in", category);
                });
            } else {
                alert("Recipe already saved in this category!");
            }
        })
    }

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
});