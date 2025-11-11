const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.getElementById('sidebar-btn');
const sidebarContents = document.getElementById('sidebar-contents');
const cardButtons = document.querySelectorAll('.cards button')
const apiKey = '53a8985fecab4bdfb3d463a191677194'
const searchBtn = document.getElementById('Search-btn');

const categoryMap = {
    "Spices": ["Black pepper", "Cumin", "Coriander", "Turmeric", "Paprika", 
        "Cinnamon", "Ginger", "Garlic powder", "Oregano", "Curry powder"],
    "Vegetables": ["Carrots", "Broccoli", "Bell peppers", "Spinach", "Tomatoes",
        "Onions", "Potatoes", "Zucchini", "Cauliflower", "Lettuce"],
    "Meats": ["Chicken breast", "Ground beef", "Pork chops", "Bacon", "Sausage",
        "Turkey", "Ham", "Lamb", "Steak", "Salmon"],
    "Oils and Vinegar": ["Olive oil", "Vegetable oil", "Canola oil", "Sesame oil", "Coconut oil",
        "Avocado oil", "Sunflower oil", "Peanut oil", "Grapeseed oil", "Corn oil"],
    "Condiments and Sauces": ["Soy sauce", "Tomato ketchup", "Mayonnaise", "Barbecue sauce", "Hot sauce",
        "Mustard", "Teriyaki sauce", "Worcestershire sauce", "Ranch dressing", "Pesto"],
    "Canned Foods": ["Canned tomatoes", "Canned beans", "Canned corn", "Canned tuna", "Canned soup",
        "Canned pineapple", "Canned peas", "Canned coconut milk", "Canned mushrooms", "Canned peaches"],
    "Freezer Goods": ["Frozen peas", "Frozen corn", "Frozen pizza", "Frozen berries", "Frozen fries",
        "Frozen spinach", "Frozen chicken nuggets", "Frozen shrimp", "Frozen mixed vegetables", "Ice cream"],
    "Rice": ["White rice", "Brown rice", "Basmati rice", "Jasmine rice", "Wild rice",
        "Arborio rice", "Long-grain rice", "Short-grain rice", "Sticky rice", "Parboiled rice"],
    "Baking Goods": ["All-purpose flour", "Baking soda", "Baking powder", "Sugar", "Brown sugar",
        "Yeast", "Cornstarch", "Vanilla extract", "Cocoa powder", "Powdered sugar"]
}

cardButtons.forEach(button => {
  button.addEventListener('click', function() {
    const card = this.closest('.cards');
    const categoryName = card.querySelector('h3').textContent; 
    const ingredients = categoryMap[categoryName];
    
    sidebarStuff(ingredients, categoryName);
  });
});

function sidebarStuff(ingredients, categoryName) {
    sidebarContents.innerHTML = '';

    document.querySelector('.sidebar-title').textContent = categoryName;

      ingredients.forEach(ingredient => {
            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            const label = document.createElement('label');

            checkbox.type = 'checkbox';
            checkbox.value = ingredient;
            checkbox.id = ingredient;

            label.textContent = ingredient;
            label.htmlFor = ingredient;
    
            div.appendChild(checkbox);
            div.appendChild(label);
            sidebarContents.appendChild(div);

            checkbox.addEventListener('change', function() {
                if(this.checked) {
                    selectedIngredients.push(ingredient);
                } else {
                    const index = selectedIngredients.indexOf(ingredient);
                    selectedIngredients.splice(index, 1);
                }
            });
        });
  sidebar.style.left = '0px';
    }   

let selectedIngredients = [];
let selectedAllergies = '';
let selectedDiet = '';

document.getElementById('Allergies').addEventListener('change', function(){
    selectedAllergies = this.value;
});

document.getElementById('Diet-filters').addEventListener('change', function(){
    selectedDiet = this.value;
});

searchBtn.addEventListener('click', function() {
    if (selectedIngredients.length === 0) {
        alert('Please select at least one ingredient!');
        return;
    }
    search(selectedIngredients, selectedAllergies, selectedDiet);
});

function search(ingredients, Allergies, Diet) {
    const sb = ingredients.join(',');

    let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${sb}&number=10&apiKey=${apiKey}`;

    if (Allergies) {
        url += `&intolerances=${Allergies}`;
    }

    if (Diet) {
        url += `&diet=${Diet}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Recipes:', data)
        })
  
} 