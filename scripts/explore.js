const apiKey = '53a8985fecab4bdfb3d463a191677194'
const ingredientSearch = document.getElementById("ingred-search");
const selectedIngredients = document.getElementById("selected-ingredients");
const searchResults = document.getElementById("search-results");
const recipeResults = document.getElementById("recipe-results");
const ingredBtn = document.querySelector(".ingred-btn");
const findRecipesBtn = document.querySelector(".find-recipe-btn");

const allergyBtn = document.querySelector(".allergies");
const allergyContent = document.getElementById("allergy-content");
const allergyAddBtn = document.querySelector(".allergyAdd-Btn");
const allergyExitBtn = document.querySelector(".allergyExit-Btn");

const dietBtn = document.querySelector(".diets");
const dietContent = document.getElementById(".diet-content");
const dietAddBtn = document.querySelector(".dietAdd-Btn");
const dietExitBtn = document.querySelector(".dietExit-Btn");


let currentFood = [];
let currentAllergies = [];
let currentDiet = [];

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
         
        const ingredientName = ingredient.name.toLowerCase();

        const hasAllergy = currentAllergies.some(allergy => 
            ingredientName.includes(allergy.toLowerCase())
        );

        const hasDiet = currentDiet.some(diet => 
            ingredientName.includes(diet.toLowerCase().replace('-free', '').replace('free', '').trim())
        );

        if (hasAllergy || hasDiet) {
            return;
        }

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
        <h2>${ingredient}</h2>
        <button class="remove">Remove</button>
        `;
            
        const removeButton = item.querySelector('.remove');

        removeButton.addEventListener("click", () => {
            currentFood = currentFood.filter(item => item !== ingredient);
                updateIngredients();
        })

        if (currentFood.length > 0) {
            findRecipesBtn.style.display = 'block'; 
        } else {
            findRecipesBtn.style.display = 'none';
        }
        selectedIngredients.append(item);
    });
}

function searchRecipe() {
    const list = currentFood.join(',');
    let url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}&ingredients=${list}&number=10`;

    fetch(url)
    .then (response => response.json())
    .then(data =>{
        console.log(data);

        if (currentAllergies.length > 0 || currentDiet.length > 0) {
            filterByAllergies(data);
        } else {
            displayRecipe(data);
        }
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
            window.location.href = `recipe.html?id=${ingredient.id}`;
        })

        recipeResults.append(item);
    });
}

function allergyModal() {
    const modal = document.getElementById('allergy-modal');
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');

    modal.style.display = 'block';

    checkboxes.forEach(checkbox =>{
        checkbox.addEventListener('change', () => {
            if(checkbox.checked) {
                addAllergy(checkbox.value);
            } else {
                currentAllergies = currentAllergies.filter(item => item !== checkbox.value);
            }
        })
    })
}

function addAllergy(name) {
    console.log("Adding:", name);
    console.log("Current array:", currentAllergies);
    if(currentAllergies.includes(name)) {
        return;
    }
    currentAllergies.push(name);
}

function filterByAllergies(recipes) {
    if (currentAllergies.length === 0) {
        if (currentDiet.length > 0) {
            filterByDiet(recipes);
        } else {
            displayRecipe(recipes);
        }
        return;
    }

    const promises = recipes.map(recipe => 
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`)
        .then(res => res.json())
    );
    
    Promise.all(promises).then(fullRecipes => {
        const safe = fullRecipes.filter(recipe => {
            const ingredientNames = recipe.extendedIngredients
                .map(ing => ing.name.toLowerCase())
                .join(' ');
            return !currentAllergies.some(allergy => 
                ingredientNames.includes(allergy.toLowerCase())
            );
        });
        
        if(currentDiet.length > 0) {
            filterByDiet(safe);
        } else {
            displayRecipe(safe);
        }
    });
}

function dietModal() {
    const modal = document.getElementById('diet-modal');
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');

    modal.style.display = 'block';

    checkboxes.forEach(checkbox =>{
        checkbox.addEventListener('change', () => {
            if(checkbox.checked) {
                addDiet(checkbox.value);
            } else {
                currentDiet = currentDiet.filter(item => item !== checkbox.value);
            }
        })
    })
}

function addDiet(name) {
    console.log("Adding:", name);
    console.log("Current array:", currentDiet);
    if(currentDiet.includes(name)) {
        return;
    }
    currentDiet.push(name);
}

function filterByDiet(recipes) {
    if (currentDiet.length === 0) {
        displayRecipe(recipes);
        return;
    }

    const promises = recipes.map(recipe => 
        fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`)
        .then(res => res.json())
    );
    
    Promise.all(promises).then(fullRecipes => {
        const safe = fullRecipes.filter(recipe => {
            return currentDiet.every(diet => {
                const dietLower = diet.toLowerCase();
                
                if (dietLower === 'dairy-free') return recipe.dairyFree;
                if (dietLower === 'gluten-free') return recipe.glutenFree;
                if (dietLower === 'keto' || dietLower === 'ketogenic') return recipe.ketogenic;
                if (dietLower === 'paleo') return recipe.paleolithic;
                if (dietLower === 'pescatarian') return recipe.pescatarian;
                if (dietLower === 'vegan') return recipe.vegan;
                if (dietLower === 'vegetarian') return recipe.vegetarian;
                if (dietLower === 'whole30') return recipe.whole30;

                return true;
            });
        });
        
        displayRecipe(safe);
    });
}

allergyBtn.addEventListener("click", () => {
    allergyModal();
});

allergyAddBtn.addEventListener("click", () => {
    const modal = document.getElementById('allergy-modal');
    modal.style.display = 'none';
});

allergyExitBtn.addEventListener("click", () => {
    const modal = document.getElementById('allergy-modal');
    modal.style.display = 'none';
});

dietBtn.addEventListener("click", () => {
    dietModal();
});

dietAddBtn.addEventListener("click", () => {
    const modal = document.getElementById('diet-modal');
    modal.style.display = 'none';
});

dietExitBtn.addEventListener("click", () => {
    const modal = document.getElementById('diet-modal');
    modal.style.display = 'none';
});

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