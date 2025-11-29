const searchInput = document.getElementById('recipe-search');
const suggestions = document.getElementById('suggestions');
const searchBtn = document.getElementById('recipe-btn');

function search() {
    const query = searchInput.value;

    if(query){
        window.location.href = `results.html?query=${query}`;
    }
}

searchBtn.addEventListener('click', ()=>{
    search();
})