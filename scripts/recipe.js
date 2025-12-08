const apiKey = '53a8985fecab4bdfb3d463a191677194'
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get('id');
const recipeContainer = document.getElementById('recipeContainer');

function recipeFetch(id){
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`;

    fetch(url)
        .then (response => response.json())
        .then(data =>{
            console.log(data);
            displayInfo(data);
        }) 
}

function displayInfo(recipe) {
    recipeContainer.innerHTML=`
    <h1>${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.title}">
    <p>${recipe.summary}</p>
    <p>Time to cook:${recipe.readyInMinutes}</p>
    <p>Servings: ${recipe.servings}</p>

    <h2>Ingredients</h2>
    <ul>
        ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}
    </ul>

    <h2>Instructions</h2>
    <p>${recipe.instructions}</p>

    <h2>Nutritional Info</h2>
    <ul>
        ${recipe.nutrition.nutrients.map(n => `<li>${n.name}: ${n.amount} ${n.unit}</li>`).join("")}
    </ul>
    `;
}

if (recipeId) {
    recipeFetch(recipeId);
}