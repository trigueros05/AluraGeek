import { servicesProducts } from "../services/product-services.js";

const productContainer = document.querySelector("[data-product]");

const form = document.querySelector("[data-form]");


function createCard(name, price, image, id) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="img-container">
    <img class="img-cont" src="${image}" alt="${name}">
</div>
<div class="card-container--info">
    <p>${name}</p>
    <div class="card-container--value">
        <p>${price}</p>
        <button class="delete-button" data-id="${id}">
            <img src="./assets/img/delete.svg" alt="eliminar producto">
        </button>
    </div>
</div>`
;
productContainer.addEventListener("click", async (event) => {
    event.preventDefault();
    const deleteButton = event.target.closest('.delete-button'); // Ajusta '.delete-button' según tu caso
    if (deleteButton) {
        const productId = deleteButton.dataset.id;
        console.log(productId);
        try {
            await servicesProducts.deleteProduct(productId);
            deleteButton.closest(".card").remove();
        } catch (err) {
            console.error("Error al eliminar el producto:", err);
        }
    }
});
    productContainer.appendChild(card);
    return card;
   
}

const render = async () => {
    try {
        const listProducts = await servicesProducts.productList();
        listProducts.forEach(product => {
            productContainer.appendChild(createCard(
                product.name,
                product.price,
                product.image,
                product.id
            )
        )
        });
    } catch (error) {
        console.log(error);
    }
};


form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.querySelector("[data-name]").value;
    const price = document.querySelector("[data-price]").value;
    const image = document.querySelector("[data-img]").value;
    
    try {
        await servicesProducts.createProducts(name, price, image);
        form.reset(); // Limpiar campos del formulario
        render(); // Renderizar después de agregar un producto
    } catch (err) {
        console.log(err);
    }
});


const limpiarButton = form.querySelector('.button-clear');
const text=form.querySelectorAll('input')
limpiarButton.addEventListener('click',()=>{
    text.forEach(field=>{
        field.value='';
    });
});
render();