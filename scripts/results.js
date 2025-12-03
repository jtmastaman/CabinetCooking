const apiKey = '53a8985fecab4bdfb3d463a191677194'
const cardsContainer = document.querySelector(".recipe-cards");
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('query');

document.getElementById("search-query").textContent = query;

function search(searchQuery) {
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${searchQuery}`;

    fetch(url)
        .then (response => response.json())
        .then(data =>{
            console.log(data);
            cards(data.results);
        })
}

function cards(results) {
    cardsContainer.innerHTML="";

    if (!results || results === 0) {
        cardsContainer.innerHTML="<p>Only ghosts lie here...<p>"
    }

    results.forEach(ingredient => {
        const card = document.createElement("div");
        
        card.innerHTML = `
            <img src="${ingredient.image}" alt="${ingredient.title}">
            <h2>${ingredient.title}</h2>
            <button class="view-btn">View Recipe</button>
        `;

        cardsContainer.appendChild(card);
        
    });
}

if (query) {
    search(query);
}