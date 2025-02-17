class SpecialHeadMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <nav class="header-nav">
                    <div class="top-left">
                        <button class="side-menu-icon" id="side-menu-icon">&#9776;</button>
                        <h1 id="header-user">Recipe App</h1>
                    </div>
                </nav>
                <nav class="side-menu" id="side-menu">
                    <div class="menu-elements">
                        <ul>
                            <li><a href="../pages/index.html">My Recipes</a></li>
                            <li><a href="../pages/create-recipe.html">Create A Recipe</a></li>
                            <li><a href="../pages/login.html">Log In</a></li>
                            <li><a href="../pages/about.html">About</a></li>                
                        </ul>
                    </div>
                </nav>
            </header>
        `;

        this.querySelector("#side-menu-icon").addEventListener("click", () => {
            this.querySelector("#side-menu").classList.toggle("open");
        });
    }
} //END OF CLASS
// Define custom element
customElements.define('header-and-menu', SpecialHeadMenu);

document.addEventListener("DOMContentLoaded", () => {
    //INGREDIENTS
    document.getElementById("add-ingredient").addEventListener("click", (event) => {
        let ingredAmount = document.getElementById("ingredient-amount").value.trim();
        let ingredName = document.getElementById("ingredient-name").value.trim();
        let ingredTags = document.getElementById("ingredient-tags");

        if(ingredAmount && ingredName){
            event.preventDefault();

            let ingredientList = JSON.parse(localStorage.getItem("ingredientList")) || []; //gets or creates new list
            let ingredientEntry = `${ingredAmount} ${ingredName}`; //stores a string from the input

            ingredientList.push(ingredientEntry); //Add input to array

            localStorage.setItem("ingredientList", JSON.stringify(ingredientList)); //make array public in localStorage

            //Hnadle and update UI
            let listItem = document.createElement("li");
            listItem.classList.add("input-tag");
            listItem.textContent = ingredientEntry;

            let deleteTag = document.createElement("button");
            deleteTag.textContent = "x";
            deleteTag.addEventListener("click", () => {
                ingredTags.removeChild(listItem);

                //Remove from localStorage
                ingredientList = ingredientList.filter(item => item !== ingredientEntry);
                localStorage.setItem("ingredientList", JSON.stringify(ingredientList));
            });
            listItem.appendChild(deleteTag);
            ingredTags.appendChild(listItem);


            document.getElementById("ingredient-amount").value = "";
            document.getElementById("ingredient-name").value = ""; 

        } else {
            window.alert("Both fields should be filled!");
            event.preventDefault();
        }
    });
    // DIRECTIONS INPUT
    document.getElementById("add-direction").addEventListener("click", (event) => {
        let direction = document.getElementById("directions").value.trim(); // input
        let directionTags = document.getElementById("directions-tags"); // tags div

        if (direction) {
            event.preventDefault();

            let directionsList = JSON.parse(localStorage.getItem("directionsList")) || []; //get directionsList or create if not-existent
            let directionsEntry = `${direction}`; //get input

            directionsList.push(directionsEntry); //add input to array

            localStorage.setItem("directionsList", JSON.stringify(directionsList)); //make directions list public

            //Handle UI for directions
            let direcTag = document.createElement("li");
            direcTag.classList.add("input-tag");
            direcTag.textContent = directionsEntry;

            let deleteTag = document.createElement("button");
            deleteTag.textContent = "x";
            deleteTag.addEventListener("click", () => {
                directionTags.removeChild(direcTag);

                //Remove from localStorage
                directionsList = directionsList.filter(item => item !== directionsEntry);
                localStorage.setItem("directionsList", JSON.stringify(directionsList));
            });
            direcTag.appendChild(deleteTag);
            directionTags.appendChild(direcTag);


            document.getElementById("directions").value = "";
        } else {
            window.alert("Directions Required!");
            event.preventDefault();
        }
    });
});

