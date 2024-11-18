document.addEventListener("DOMContentLoaded", () => {
    const mainView = document.getElementById("main-view");
    const savedView = document.getElementById("meal-categories-view");
    const backButton = document.getElementById("back-button");
    const categoryTitle = document.getElementById("category-title");
    const categoryIcon = document.getElementById("category-icon");
    const saveRecipeButton = document.getElementById("save-recipe-button");
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
                categoryDropdown.style.display = "none";
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

            if (!recipes.includes(url)) { //Does url exist in recipes
                recipes.push(url); //Add recipe url
                chrome.storage.local.set({ [category]: recipes }, () => {
                    console.log("Recipe saved in", category);
                });
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

            displaySavedRecipes(category);
        });
    });

    //Delete individual recipe
    function deleteRecipe(url, category) {
        chrome.storage.local.get([category], (result) => {
            let recipes = result[category] || [];
            const index = recipes.indexOf(url);

            if (index > -1) {
                recipes.splice(index, 1);
                chrome.storage.local.set({ [category]: recipes }, () => {
                    console.log("Recipe deleted from", category);
                    displaySavedRecipes(category); //Refresh
                });
            }
        });
    }

    //Display saved recipes with delete button
    function displaySavedRecipes(category) {
        const savedRecipes = document.getElementById("saved-recipes");
        const singleSavedRecipe = document.getElementById("single-saved-recipe");

        chrome.storage.local.get([category], (result) => {
            console.log(result); 
            const recipes = result[category] || [];
            savedRecipes.innerHTML = "";

            recipes.forEach((recipeUrl) => {
                const listItem = document.createElement("li");
                listItem.className = "recipe-item";

                const recipeLink = document.createElement("a");
                recipeLink.href = recipeUrl;
                recipeLink.textContent = recipeUrl;
                recipeLink.target = "_blank";

                //Clone the single-saved-recipe template
                const recipeControls = singleSavedRecipe.cloneNode(true);
                recipeControls.style.display = "block"; // Make it visible

                //Delete functionality
                const deleteButton = recipeControls.querySelector("#delete-button");
                deleteButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    deleteRecipe(recipeUrl, category);
                });

                listItem.appendChild(recipeLink);
                listItem.appendChild(recipeControls);
                savedRecipes.appendChild(listItem);
            });
        });
    }
});