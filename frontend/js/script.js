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
/*document.addEventListener("DOMContentLoaded", () => {
            const ingredTags = document.getElementById("ingredient-tags");
            const directionTags = document.getElementById("directions-tags");

            // ADD INGREDIENTS TAG
            document.getElementById("add-ingredient").addEventListener("click", (event) => {
                event.preventDefault();
                const ingredAmount = document.getElementById("ingredient-amount")?.value.trim();
                const ingredName = document.getElementById("ingredient-name")?.value.trim();

                if (ingredAmount && ingredName) {
                    // Handle and update UI
                    const listItem = document.createElement("li");
                    listItem.classList.add("input-tag");
                    listItem.textContent = `${ingredAmount} ${ingredName}`;

                    const deleteTag = document.createElement("button");
                    deleteTag.textContent = "x";
                    deleteTag.addEventListener("click", () => ingredTags.removeChild(listItem));
                    listItem.appendChild(deleteTag);
                    ingredTags.appendChild(listItem);

                    document.getElementById("ingredient-amount").value = "";
                    document.getElementById("ingredient-name").value = "";
                } else {
                    window.alert("Both fields should be filled!");
                }
            });

            // ADD DIRECTIONS INPUT TAG
            document.getElementById("add-direction").addEventListener("click", (event) => {
                event.preventDefault();
                const direction = document.getElementById("directions").value.trim();

                if (direction) {
                    // Handle UI for directions
                    const direcTag = document.createElement("li");
                    direcTag.classList.add("input-tag");
                    direcTag.textContent = direction;

                    const deleteTag = document.createElement("button");
                    deleteTag.textContent = "x";
                    deleteTag.addEventListener("click", () => directionTags.removeChild(direcTag));
                    direcTag.appendChild(deleteTag);
                    directionTags.appendChild(direcTag);

                    document.getElementById("directions").value = "";
                } else {
                    window.alert("Directions Required!");
                }
            });

            // FORM SUBMISSION
            document.getElementById("create-recipe-form").addEventListener("submit", async (event) => {
                event.preventDefault();

                const title = document.getElementById("title").value.trim();
                const imageFile = document.getElementById('img-upload').files[0];
                const token = localStorage.getItem('token');

                if (!token) {
                    window.alert("You need to be logged in to create a recipe");
                    window.location.href = '/frontend/pages/login.html';
                    return;
                }

                // Collect ingredients from UI
                const ingredients = [];
                const ingredientItems = ingredTags.querySelectorAll('.input-tag');
                ingredientItems.forEach(item => {
                    const text = item.textContent.replace('x', '').trim();
                    const [amount, ...nameParts] = text.split(' ');
                    const name = nameParts.join(' ');
                    if (amount && name) {
                        ingredients.push({ amount, name });
                    }
                });

                // Collect directions from UI
                const directions = [];
                const directionItems = directionTags.querySelectorAll('.input-tag');
                directionItems.forEach(item => {
                    const direction = item.textContent.replace('x', '').trim();
                    if (direction) {
                        directions.push(direction);
                    }
                });

                if (!title || ingredients.length === 0 || directions.length === 0) {
                    window.alert("Please input all required data!");
                    return;
                }

                try {
                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('ingredients', JSON.stringify(ingredients)); // Stringify for FormData
                    formData.append('instructions', JSON.stringify(directions)); // Stringify for FormData
                    if (imageFile) formData.append('image', imageFile);

                    const response = await fetch('http://localhost:5050/api/recipes/', {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        body: formData
                    });

                    const data = await response.json();

                    if (response.ok) {
                        window.alert("Recipe Created! 😋");
                        ingredTags.innerHTML = ""; // Clear UI
                        directionTags.innerHTML = ""; // Clear UI
                        window.location.href = '/frontend/pages/index.html';
                    } else {
                        window.alert(data.message || "Something Went Wrong!");
                        if (response.status === 401) {
                            window.location.href = "/frontend/pages/login.html";
                        }
                    }
                } catch (error) {
                    console.error('Error during recipe creation:', error);
                    window.alert(`Error creating recipe: ${error.message}`);
                }
            });
        }); */