const pokeName = document.querySelector("[data-poke-name]");
const pokeImg = document.querySelector("[data-poke-img]");
const pokeId = document.querySelector("[data-poke-id]");
const pokeTypes = document.querySelector("[data-poke-types]");
const pokeStats = document.querySelector("[data-poke-stats]");
const namePokemon = document.getElementById("name-pokemon");
const list = document.getElementById("autocomplete-list");

const typeColors = {
  electric: "#FFEA70",
  normal: "#B09398",
  fire: "#FF675C",
  water: "#0596C7",
  ice: "#AFEAFD",
  rock: "#999799",
  flying: "#7AE7C7",
  grass: "#4A9681",
  psychic: "#FFC6D9",
  ghost: "#561D25",
  bug: "#A2FAA3",
  poison: "#795663",
  ground: "#D2B074",
  dragon: "#DA627D",
  steel: "#1D8A99",
  fighting: "#2F2F2F",
  default: "#2A1A1F",
};

const search = (event) => {
  event.preventDefault();
  const { value } = event.target.pokemon;
  searchPokemon(value);
  list.innerHTML = "";
  event.target.pokemon.value = "";
};

const renderPokemonData = (data) => {
  const sprite = data.sprites.front_default;
  const { stats, types } = data;

  pokeName.textContent = data.name;
  pokeImg.setAttribute("src", sprite);
  pokeId.textContent = `Nº ${data.id}`;
  setCardColor(types);
  renderPokemonTypes(types);
  renderPokemonStats(stats);
};

const setCardColor = (types) => {
  const colorOne = typeColors[types[0].type.name];
  const colorTwo = types[1]
    ? typeColors[types[1].type.name]
    : typeColors.default;
  pokeImg.style.background = `radial-gradient(${colorTwo} 33%, ${colorOne} 33%)`;
  pokeImg.style.backgroundSize = " 5px 5px";
};

const renderPokemonTypes = (types) => {
  pokeTypes.innerHTML = "";
  types.forEach((type) => {
    const typeTextElement = document.createElement("div");
    typeTextElement.style.color = typeColors[type.type.name];
    typeTextElement.textContent = type.type.name;
    pokeTypes.appendChild(typeTextElement);
  });
};

const renderPokemonStats = (stats) => {
  pokeStats.innerHTML = "";
  stats.forEach((stat) => {
    const statElement = document.createElement("div");
    const statElementName = document.createElement("div");
    const statElementAmount = document.createElement("div");
    statElementName.textContent = stat.stat.name;
    statElementAmount.textContent = stat.base_stat;
    statElement.appendChild(statElementName);
    statElement.appendChild(statElementAmount);
    pokeStats.appendChild(statElement);
  });
};

const renderNotFound = () => {
  pokeName.textContent = "No encontrado";
  pokeImg.setAttribute("src", "img/poke-shadow.png");
  pokeImg.style.background = "#fff";
  pokeTypes.innerHTML = "";
  pokeStats.innerHTML = "";
  pokeId.textContent = "";
};

function searchPokemon(name) {
  fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
    .then((data) => data.json())
    .then((response) => renderPokemonData(response))
    .catch((err) => renderNotFound());
}

let pokemonNames = [];

function fetchPokemonNames() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
    .then((response) => response.json())
    .then((data) => {
      pokemonNames = data.results.map((pokemon) => pokemon.name);
    })
    .catch((error) =>
      console.error("Error al cargar los nombres de Pokémon:", error)
    );
}

document.addEventListener("DOMContentLoaded", fetchPokemonNames);

function showSuggestions(value) {
  list.innerHTML = "";

  if (!value) return;

  const filteredNames = pokemonNames.filter((name) =>
    name.toLowerCase().startsWith(value.toLowerCase())
  );

  filteredNames.slice(0, 10).forEach((name) => {
    const suggestionItem = document.createElement("div");
    suggestionItem.textContent = name;

    suggestionItem.addEventListener("click", () => {
      document.querySelector('input[name="pokemon"]').value = name;
      list.innerHTML = "";
      searchPokemon(name);
      document.querySelector('input[name="pokemon"]').value = "";
    });

    list.appendChild(suggestionItem);
  });
}
