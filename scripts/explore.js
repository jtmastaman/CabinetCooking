    const apiKey = '53a8985fecab4bdfb3d463a191677194'
    const ingredientSearch = document.getElementById("ingred-search");
    const selectedIngredients = document.getElementById("selected-ingredients");
    const searchResults = document.getElementById("search-results");
    const recipeResults = document.getElementById("recipe-results");
    const ingredBtn = document.querySelector(".ingred-btn");
    const findRecipesBtn = document.querySelector(".find-recipe-btn");


    let currentFood = []

    function search(query) {
        const url = `https://api.spoonacular.com/food/ingredients/search?apiKey=${apiKey}&query=${query}&number=5`;

        fetch(url)
        .then (response => response.json())
        .then(data =>{
            console.log(data);
            displayFood(data.results);
        })
    }


    function displayFood(results) {
        searchResults.innerHTML = "";

        results.forEach(ingredient => {
            const item = document.createElement("div");

            item.innerHTML = `
            <img src="https://spoonacular.com/cdn/ingredients_250x250/${ingredient.image}"
            alt="${ingredient.image}">
            <h2>${ingredient.name}</h2>
            <button class="add">Add</button>
            `;
            
            const addButton = item.querySelector('.add');

            addButton.addEventListener("click", () => {
                addIngredient(ingredient.name);
            })

            searchResults.append(item);
        });
    }

    function addIngredient(name) {
        console.log("Adding:", name);
        console.log("Current array:", currentFood);
        if(currentFood.includes(name)) {
            return;
        }
        currentFood.push(name);

        updateIngredients();
    }
    
    function updateIngredients() {
        selectedIngredients.innerHTML = "";

        currentFood.forEach(ingredient => {
            const item = document.createElement("div");

            item.innerHTML = `
            <img src="https://spoonacular.com/cdn/ingredients_250x250/${ingredient.image}"
            alt="${ingredient.image}">
            <h2>${ingredient}</h2>
            <button class="remove">Remove</button>
            `;
            
            const removeButton = item.querySelector('.remove');

            removeButton.addEventListener("click", () => {
                currentFood = currentFood.filter(item => item !== ingredient);
                updateIngredients();
            })

            if (currentFood.length > 0) {
                findRecipesBtn.style.display = 'block'; // or 'inline-block'
            } else {
                findRecipesBtn.style.display = 'none';
            }
            selectedIngredients.append(item);
        });
    }

    function searchRecipe() {
        const list = currentFood.join(',');
        const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${list}&number=10`;

        fetch(url)
        .then (response => response.json())
        .then(data =>{
            console.log(data);
            displayRecipe(data);
        })
    }

    function displayRecipe(results) {
        recipeResults.innerHTML = "";

        results.forEach(ingredient => {
            const item = document.createElement("div");

            item.innerHTML = `
            <img src="${ingredient.image}" alt="${ingredient.title}">
            <h2>${ingredient.title}</h2>
            <button class="view">View</button>
        `;
            
            const viewButton = item.querySelector('.view');

            viewButton.addEventListener("click", () => {
                addIngredient(ingredient.name);
            })

            recipeResults.append(item);
        });
    }

    ingredBtn.addEventListener("click", () => {
        const query = ingredientSearch.value.trim();
        if (query) search(query);
    });

    findRecipesBtn.addEventListener("click", () => {
    if (currentFood.length > 0) {
        searchRecipe();
    } else {
        alert("Please add some ingredients first!");
    }
});

    function allergyModal() {

    }

    function dietModal() {

    }
