document.addEventListener('DOMContentLoaded', e => {
  requestPokeInfo();
  getFavLocal();
  paintFavoriteList();
     
});


const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

const searchButton = document.querySelector(".search"),
  container = document.getElementById("pokemon-container"),
  containerFavorites = document.querySelector(".favoritelist"),
  erroMessage = document.getElementById("error"),
  favoritesList = document.getElementById("favoritelist"),
  searchInput = document.getElementById("search-input"),
  menssageFavorite = document.getElementById("mensage-Favorites"),
  btnDeleteList = document.getElementById("deleteList");

let favoritesListPokemon = {};

var pokeName, 
pokemon, 
card;

const requestPokeInfo = (url, name) => {
  fetch(url + name)
    .then((response) => response.json())
    .then((data) => {
      pokemon = data;
    })
    .catch((err) => console.log(err));
};

const createCard = () => {
  card = `
      <div class="pokemon-picture">
      <img class="pokemon-picture-img" src="${pokemon.sprites.front_default}" id="${pokemon.id}" alt="Sprite of ${pokemon.name}">
      </div>
      <div class="pokemon-info">
          <h1 class="name" id="${pokemon.name}">Name: ${pokemon.name}</h1>
          <h2 class="numberId">Nº ${pokemon.id}</h2>
          <h3 class="type">Type: ${pokemon.types.map((item) => item.type.name).toString()}</h3>
          <h3 class="skill">Skills: ${pokemon.moves.map((item) => " " + item.move.name).toString()}</h3>
          <h3 class="weight">Weight: ⚖️${pokemon.weight / 10}kg</h3>
          <h3 class="height">Height: 📏${pokemon.height / 10}m</h3>
          <button type="button" class="button is-danger" id="${pokemon.id}"><i class="fas fa-thumbs-up"></i> Favorite</button>
      </div>`;

  return card;
};

const startApp = (pokeName) => {
  requestPokeInfo(baseUrl, pokeName);

  setTimeout(() => {
    if (pokemon.detail) {
      erroMessage.style.display = "block";
      container.style.display = "none";
    } else {
      erroMessage.style.display = "none";
      container.style.display = "flex";
      container.innerHTML = createCard();
    }
  }, 2000);
};

// search Pokemon
searchButton.addEventListener("submit", (event) => {
  event.preventDefault();
  pokeName = searchInput.value.toLowerCase();
  startApp(pokeName);
  container.classList.add("fade");

  setTimeout(() => {
    container.classList.remove("fade");
  }, 3000);
  searchButton.reset(); // clear input
});

//Add favorite List
const pokeElements = document.querySelectorAll(".is-danger");
container.addEventListener("click", (e) => {
  addFavorite(e);
});
const addFavorite = (e) => {
  if (e.target.classList.contains("is-danger")) {
    setFavoritos(e.target.parentElement);
  }
  e.stopPropagation();
};

const setFavoritos = (obj) => {
  const pokemonFav = {
    id: obj.querySelector(".is-danger").getAttribute("id"),
    name: obj.querySelector("h1").getAttribute("id"),
    image: obj.querySelector(".pokemon-picture-img"),
  };
  favoritesListPokemon[pokemonFav.id] = { ...pokemonFav };
  paintFavoriteList();

};

// delete favorite Pokemon

const btnAccion = () => {
  const btnDeleteFavoritePokemon = document.querySelectorAll(".btn-danger");

  btnDeleteFavoritePokemon.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log("eliminando...");

      if (e.target.classList.contains("btn-danger")) {
        delete favoritesListPokemon[e.target.id];
      }
      paintFavoriteList();
      e.stopPropagation();
    });
  });
};

// paint Favoritos
const paintFavoriteList = () => {
  cardFav = "";
  cardFav += '<div class="card-group">'
  cardFav += '<div class="card">';
  Object.values(favoritesListPokemon).forEach((pokemonFav) => {
    cardFav += `<img class="card-img-top" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonFav.id}.png" alt="Sprite of ${pokemonFav.name}">`;
    cardFav += `<div class="card-body">`;
    cardFav += `<h1 class="card-title" id="${pokemonFav.name}">Name: ${pokemonFav.name}</h1>`;
    cardFav += `<h2 class="card-title" id="id-favorite">Nº ${pokemonFav.id}</h2>`;
    cardFav += `<button type="button" class="btn btn-danger" id="${pokemonFav.id}"><i class=" fas fa-trash-alt"></i> Delete </button>`;
    cardFav += `</div>`;
  });
  cardFav += "</div>";
  cardFav += "</div>";

  containerFavorites.innerHTML = cardFav;
  btnAccion();
  savedFav();
};

// session Storage
const savedFav = () => {
  sessionStorage.setItem("favorites", JSON.stringify(favoritesListPokemon));
};
const getFavLocal = () => {
  let localFavoritesString = sessionStorage.getItem("favorites");
  if (localFavoritesString !== null) {
    favoritesListPokemon = JSON.parse(localFavoritesString);
    paintFavoriteList();
  } else {
    favoritesListPokemon = {};
  }
};
getFavLocal();

//Delete All List
const handleReset = () => {
  favoritesListPokemon = {};
  paintFavoriteList();
  createCard(pokemon);
  sessionStorage.removeItem("favorites");
};

btnDeleteList.addEventListener("click", handleReset);
