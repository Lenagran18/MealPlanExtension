document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        mainView: document.getElementById("main-view"),
        savedView: document.getElementById("meal-categories-view"),
        backButton: document.getElementById("back-button"),
        categoryTitle: document.getElementById("category-title"),
        categoryIcon: document.getElementById("category-icon"),
        saveRecipeButton: document.getElementById("save-recipe-button"),
        categoryDropdown: document.getElementById("category-dropdown"),
        categoryOptions: document.querySelectorAll(".category-option"),
        closeButton: document.querySelectorAll(".close-button"),
        categoryButtons: document.querySelectorAll(".category-button"),
        searchForm: document.getElementById("search-form"),
        searchBar: document.getElementById("search-bar"),
        savedRecipes: document.getElementById("saved-recipes"),
        singleSavedRecipe: document.getElementById("single-saved-recipe"),
    };

    const categoryIcons = {
        breakfast: "assets/breakfast.png",
        lunch: "assets/lunch.png",
        dinner: "assets/dinner.png",
        dessert: "assets/dessert.png",
        drinks: "assets/drinks.png",
    };

    const view = {
        showMainView() {
            elements.mainView.style.display = "block";
            elements.savedView.style.display = "none";
        },
        showSavedView() {
            elements.mainView.style.display = "none";
            elements.savedView.style.display = "block";
        },
        toggleDropdown() {
            elements.categoryDropdown.style.display = elements.categoryDropdown.style.display === "block" ? "none" : "block";
        },
        hideDropdown() {
            elements.categoryDropdown.style.display = "none";
        },
    };

    const recipeManager = {

        async getFirstImage() {
            try {
                // Get the active tab
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                const [{ result }] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    //getter function for the src attribute of the first image on the page
                    function: () => {
                        const img = document.querySelector('img');
                        return img ? img.src : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                    }
                });
                return result;
            } catch (error) {
                console.error("Error getting image:", error);
                return null;
            }
        },

        // Save recipe to local storage
        async saveRecipe(url, category, title) {
            try {
                const imageUrl = await this.getFirstImage();
                const result = await chrome.storage.local.get([category]);
                let recipes = result[category] || [];

                if (!recipes.some(recipe => recipe.url === url)) {
                    recipes.push({ url, title, imageUrl });
                    await chrome.storage.local.set({ [category]: recipes });
                    console.log("Recipe saved:", { url, title, imageUrl });
                }
            } catch (error) {
                console.error("Error saving recipe:", error);
            }
        },

        // Delete individual recipe
        async deleteRecipe(url, category) {
            try {
                const result = await chrome.storage.local.get([category]);
                let recipes = result[category] || [];
                recipes = recipes.filter(recipe => recipe.url !== url);

                await chrome.storage.local.set({ [category]: recipes });
                console.log("Recipe deleted from", category);
                this.displaySavedRecipes(category);
            } catch (error) {
                console.error("Error deleting recipe:", error);
            }
        },

        // Display all saved recipes
        async displaySavedRecipes(category) {
            try {
                const result = await chrome.storage.local.get([category]);
                const recipes = result[category] || [];
                elements.savedRecipes.innerHTML = "";

                recipes.forEach(recipe => {
                    const listItem = this.createRecipeListItem(recipe, category);
                    elements.savedRecipes.appendChild(listItem);
                });
            } catch (error) {
                console.error("Error displaying recipes:", error);
            }
        },

        // Create saved recipe list item - title, url, and delete button
        createRecipeListItem(recipe, category) {
            const listItem = document.createElement("li");
            listItem.className = "recipe-item";

            // Create recipe image container
            if (recipe.imageUrl) {
                const imageContainer = document.createElement("div");
                imageContainer.className = "recipe-image-container";
                const image = document.createElement("img");
                image.src = recipe.imageUrl;
                image.alt = recipe.title;
                image.className = "recipe-image";
                imageContainer.appendChild(image);
                listItem.appendChild(imageContainer);
            }

            const infoContainer = document.createElement("div");
            infoContainer.className = "recipe-info";

            const recipeLink = document.createElement("a");
            recipeLink.href = recipe.url;
            recipeLink.textContent = recipe.title;
            recipeLink.target = "_blank";
            listItem.appendChild(recipeLink);

            const recipeControls = elements.singleSavedRecipe.cloneNode(true);
            recipeControls.style.display = "block";

            const deleteButton = recipeControls.querySelector("#delete-button");
            deleteButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.deleteRecipe(recipe.url, category);
            });

            listItem.appendChild(recipeControls);
            listItem.appendChild(infoContainer);
            return listItem;
        }
    };

    //buttons and search functionality
    function initializeEventListeners() {
        //Close button functionality
        elements.closeButton.forEach((button) => {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                window.close();
            });
        });

        //Back button functionality
        elements.backButton.addEventListener("click", function (event) { 
            event.preventDefault();
            view.showMainView();
        });

        //Toggle save dropdown
        elements.saveRecipeButton.addEventListener("click", function (event) { 
            event.stopPropagation(); 
            view.toggleDropdown();
        });

        //Hide save dropdown when clicking outside of it
        document.addEventListener("click", (event) => {
            if (event.target !== elements.saveRecipeButton && !elements.categoryDropdown.contains(event.target)) {
                view.hideDropdown();
            }
        });

        //Categories in category dropdown
        elements. categoryOptions.forEach((option) => {
            option.addEventListener("click", function () {
                const selectedCategory = option.getAttribute("data-category");

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { 
                    const { url, title } = tabs[0];
                    recipeManager.saveRecipe(url, selectedCategory, title);
                    view.hideDropdown();
                });
            });
        });

        //Search form functionality
        elements.searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const ingredients = elements.searchBar.value;
            const query = `${ingredients.split(",").map((ing) => ing.trim()).join(" ")} recipes`;
            const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            chrome.tabs.create({ url: url });
        });
        
        //Meal Category buttons
        elements.categoryButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
                event.preventDefault();

                const category = button.getAttribute("data-category");
                elements.categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                elements.categoryIcon.src = categoryIcons[category];

                // Hide the main view and show the saved view
                view.showSavedView();
                recipeManager.displaySavedRecipes(category);
            });
        });
    }
    
    initializeEventListeners();
});