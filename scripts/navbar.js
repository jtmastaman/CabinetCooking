const navSearch = document.getElementById("nav-search");
const navBtn = document.getElementById("nav-btn");

function navbarSearch() {
    const query = navSearch.value;

    if(query){
        window.location.href = `results.html?query=${query}`;
    }
}

navBtn.addEventListener('click', ()=>{
    navbarSearch();
})

