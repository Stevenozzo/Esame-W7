const productsUrl = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  localStorage.getItem("authToken") ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2ODJlOTc5YzQ1ZjAwMTU2OWI1OGMiLCJpYXQiOjE3Mjc0NDMwMjQsImV4cCI6MTcyODY1MjYyNH0.PjVSmWQWJA1-37QHuXcmMdx0c7-qdi8TPJhHmW3b4_s";

// Funzione per caricare i prodotti nella homepage
const loadProducts = () => {
  fetch(productsUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero dei prodotti");
      }
    })
    .then((data) => {
      console.log("Prodotti ricevuti:", data); // Log per controllare i dati
      const productsContainer = document.getElementById("products-container");
      productsContainer.innerHTML = ""; // Pulisce il contenuto prima di aggiungere nuovi prodotti

      data.forEach((product) => {
        const productCard = `
                <div class="col">
                    <div class="card" style="width: 18rem;">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">Prezzo: €${product.price}</p>
                            <button class="btn btn-success" onclick="purchaseProduct('${product._id}')">Acquista</button>
                        </div>
                    </div>
                </div>`;
        productsContainer.innerHTML += productCard;
      });
    })
    .catch((err) => {
      console.error("Errore:", err);
    });
};

// Funzione da definire per gestire l'acquisto
function purchaseProduct(productId) {
  // Logica per gestire l'acquisto
  alert(`Hai acquistato il prodotto con ID: ${productId}`);
}

loadProducts();
