const productsUrl = "https://striveschool-api.herokuapp.com/api/product/";

// Ottiene il productId dall'URL se esiste
const addressBarContent = new URLSearchParams(location.search);
let productId = addressBarContent.get("productId");

// Recupera il token dall'archiviazione locale
const token =
  localStorage.getItem("authToken") ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY2ODJlOTc5YzQ1ZjAwMTU2OWI1OGMiLCJpYXQiOjE3Mjc0NDMwMjQsImV4cCI6MTcyODY1MjYyNH0.PjVSmWQWJA1-37QHuXcmMdx0c7-qdi8TPJhHmW3b4_s";

// Se esiste un productId, precompila il form con i dati del prodotto
if (productId) {
  fetch(productsUrl + productId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero del prodotto");
      }
    })
    .then((oneProduct) => {
      // Riempie il form con i dati del prodotto
      document.getElementById("name").value = oneProduct.name;
      document.getElementById("description").value = oneProduct.description;
      document.getElementById("brand").value = oneProduct.brand; // Aggiunto
      document.getElementById("price").value = oneProduct.price;
      document.getElementById("imgUrl").value = oneProduct.imageUrl;

      // Cambia il bottone per indicare la modifica del prodotto
      document.querySelector(".btn-primary").innerText = "Modifica Prodotto";
    })
    .catch((err) => {
      console.error("Errore nel recupero del prodotto:", err);
    });
}

// Funzione per cercare e mostrare i prodotti nel backoffice
const searchProducts = () => {
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
      // Mostra i prodotti nella pagina
      const productsContainer = document.getElementById("products-container");
      productsContainer.innerHTML = ""; // Pulisce il contenuto prima di aggiungere nuovi prodotti

      data.forEach((product) => {
        const productCard = `<div class="product-card">
                              <h3>${product.name}</h3>
                              <p>${product.description}</p>
                              <p>Marca: ${product.brand}</p> <!-- Aggiunto -->
                              <p>Prezzo: ${product.price}</p>
                              <img src="${product.imageUrl}" alt="${product.name}" />
                              <button onclick="editProduct('${product._id}')">Modifica</button>
                              <button onclick="deleteProduct('${product._id}')">Cancella</button>
                            </div>`;
        productsContainer.innerHTML += productCard;
      });
    })
    .catch((err) => {
      console.error("Errore:", err);
    });
};

// Classe per creare un nuovo prodotto
class Product {
  constructor(_name, _description, _brand, _price, _imgUrl) {
    this.name = _name;
    this.description = _description;
    this.brand = _brand;
    this.price = _price;
    this.imageUrl = _imgUrl;
  }
}

// Gestione del form per la creazione o modifica del prodotto
const productForm = document.getElementById("product-form");
productForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const brand = document.getElementById("brand").value;
  const price = parseFloat(document.getElementById("price").value);
  const imgUrl = document.getElementById("imgUrl").value;

  // Validazione del prezzo
  if (isNaN(price) || price < 0) {
    alert("Per favore, inserisci un prezzo valido.");
    return;
  }

  const p = new Product(name, description, brand, price, imgUrl);
  console.log("Product creato", p);

  // Determina il metodo da utilizzare (POST per creare, PUT per modificare)
  let methodToUse = productId ? "PUT" : "POST";
  let addressToUse = productId ? productsUrl + productId : productsUrl;

  fetch(addressToUse, {
    method: methodToUse,
    body: JSON.stringify(p),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        alert(productId ? "Prodotto modificato" : "Prodotto creato");

        searchProducts();

        // Reset del form solo se un nuovo prodotto è stato creato
        if (!productId) {
          productForm.reset();
        } else {
          // Dopo la modifica, resettare il form e tornare alla modalità "creazione"
          productForm.reset();
          document.querySelector(".btn-primary").innerText = "Crea Prodotto";
          productId = null; // Resetta l'ID per tornare alla creazione di nuovi prodotti
        }
      } else {
        throw new Error("Errore nel salvataggio del prodotto");
      }
    })
    .catch((err) => {
      console.error("Errore nel salvataggio del prodotto:", err);
    });
});

// Funzione per cancellare un prodotto esistente
function deleteProduct(productId) {
  fetch(`${productsUrl}${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("Prodotto cancellato con successo");
        searchProducts(); // Aggiorna la lista dei prodotti dopo la cancellazione
      } else {
        throw new Error("Errore nella cancellazione del prodotto");
      }
    })
    .catch((err) => console.error("Errore:", err));
}

// Funzione per modificare un prodotto (viene chiamata quando si clicca sul bottone "Modifica")
function editProduct(id) {
  // Cambia l'URL per includere l'ID del prodotto da modificare
  location.href = `?productId=${id}`;
}

// Esegui la ricerca dei prodotti all'avvio della pagina
searchProducts();
