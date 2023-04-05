const API = "https://www.thecocktaildb.com/api/json/v1/1/";
const GET_ALL_COCKTAILS = API + "filter.php?c=Cocktail";
const GET_BY_NAME = API + "search.php?s=";
const GET_BY_FILTER = API + "filter.php?a=";
const COCKTAIL_DETAIL = API + "lookup.php?i=";
const INGR_DETAIL = API + "search.php?i=";
const RANDOM_BTN = API + "random.php";
let id = null;

const form = document.querySelector("#search");
const input = document.querySelector("#inp");
const select = document.querySelector("#select");
const output = document.querySelector("#output");
const btn = document.querySelector("#random");

const getRandomCoctail = async () => {
  const req = await fetch(RANDOM_BTN);
  const res = await req.json();
  renderRandom(res.drinks);
};
const getAllCocktails = async () => {
  const req = await fetch(GET_ALL_COCKTAILS);
  const res = await req.json();
  renderCocktails(res.drinks);
};

const getCocktailsByName = async () => {
  let req = null;
  if (input.value.length >= 2) {
    req = await fetch(GET_BY_NAME + input.value);
  } else {
    req = await fetch(GET_ALL_COCKTAILS);
  }
  const res = await req.json();
  renderCocktails(res.drinks);
};

const filterByAlco = async () => {
  let req = null;
  select.value === "All"
    ? (req = await fetch(GET_ALL_COCKTAILS))
    : (req = await fetch(GET_BY_FILTER + select.value));
  const res = await req.json();
  renderCocktails(res.drinks);
};

const getById = async (id) => {
  const req = await fetch(COCKTAIL_DETAIL + id);
  const res = await req.json();
  renderDetail(res.drinks[0]);
};

const getIngrByName = async (name) => {
  const req = await fetch(INGR_DETAIL + name);
  const res = await req.json();
  renderIngredient(res.ingredients[0]);
  // console.log(res.ingredients);
};

const renderIngredient = (ingredient) => {
  // console.log(ingredient);
  output.innerHTML = "";
  const card = document.createElement("div");
  card.classList.add("card", "animate__animated", "animate__fadeInLeft");
  const img = document.createElement("img");
  img.src = `https://www.thecocktaildb.com/images/ingredients/${ingredient.strIngredient}-Small.png`;
  img.style.cssText = `
    width: 100px;
    `;
  const ingrName = document.createElement("h4");
  ingrName.textContent = ingredient.strIngredient;
  const ingrDescription = document.createElement("p");
  ingrDescription.textContent = ingredient.strDescription;

  const backBtn = document.createElement("button");
  backBtn.textContent = "Back";
  backBtn.classList = ''
  backBtn.addEventListener("click", () => getById(id));

  card.append(img, ingrName, ingrDescription, backBtn);
  output.append(card);
};

const renderCocktails = (drinks) => {
  console.log(drinks);
  output.innerHTML = "";
  drinks.map((drink) => {
    const cardi = document.createElement("div");
    const name = document.createElement("h2");
    const imgCocktail = document.createElement("img");
    cardi.classList.add("cardi", "animate__animated", "animate__fadeInLeft");
    name.textContent =
      drink.strDrink.length > 20
        ? drink.strDrink.slice(0, 20) + "..."
        : drink.strDrink;
    name.title = drink.strDrink;
    imgCocktail.src = drink.strDrinkThumb;
    cardi.addEventListener("click", () => {
      getById(drink.idDrink);
      id = drink.idDrink;
    });
    cardi.append(imgCocktail, name);
    output.append(cardi);
  });
};

const renderRandom = (drinks) => {
  console.log(drinks);
  output.innerHTML = "";
  drinks.map((drink) => {
    const card = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("h3");
    const alco = document.createElement("h4");
    const instruction = document.createElement("p");
    card.classList.add("card", "animate__animated", "animate__fadeInLeft");

    img.src = drink.strDrinkThumb;
    const textCocktail = document.createElement("div");
    textCocktail.classList.add(
      "textCocktail",
      "animate__animated",
      "animate__fadeInRight"
    );
    name.textContent = drink.strDrink;
    alco.textContent = `Alco: ${drink.strAlcoholic}`;
    instruction.textContent = drink.strInstructions;
    const ul = document.createElement("ul");
    const title = document.createElement("h4");
    title.textContent = "Ингредиенты: ";
    for (let key in drink) {
      if (key.includes("strIngredient") && drink[key] !== null) {
        const ingr = document.createElement("li");
        ingr.textContent = drink[key];
        ul.append(ingr);
        ingr.addEventListener("click", () => getIngrByName(drink[key]));
      }
    }
    const backBtn = document.createElement("button");
    backBtn.textContent = "Back";
    backBtn.addEventListener("click", getAllCocktails);
    textCocktail.append(name, alco, instruction, ul);
    card.append(img, backBtn);
    output.append(card, textCocktail);
  });
};

const renderDetail = (drink) => {
  console.log(drink);
  output.innerHTML = "";
  const card = document.createElement("div");
  const img = document.createElement("img");
  const name = document.createElement("h3");
  const alco = document.createElement("h4");
  const instruction = document.createElement("p");
  card.classList.add("card", "animate__animated", "animate__fadeInLeft");

  img.src = drink.strDrinkThumb;
  const textCocktail = document.createElement("div");
  textCocktail.classList.add(
    "textCocktail",
    "animate__animated",
    "animate__fadeInRight"
  );

  name.textContent = drink.strDrink;
  alco.textContent = `Alco: ${drink.strAlcoholic}`;
  instruction.textContent = drink.strInstructions;
  const ul = document.createElement("ul");
  const title = document.createElement("h4");
  title.textContent = "Ингредиенты: ";
  for (let key in drink) {
    if (key.includes("strIngredient") && drink[key] !== null) {
      const ingr = document.createElement("li");
      ingr.textContent = drink[key];
      ul.append(ingr);
      ingr.addEventListener("click", () =>
        getIngrByName(drink[key], drink.idDrink)
      );
    }
  }
  const backBtn = document.createElement("button");
  backBtn.textContent = "Back";
  backBtn.addEventListener("click", getAllCocktails);
  textCocktail.append(name, alco, instruction, ul);
  card.append(img, backBtn);
  output.append(card, textCocktail);
};

form.addEventListener("submit", (e) => e.preventDefault());
input.addEventListener("keyup", getCocktailsByName);
select.addEventListener("change", filterByAlco);
btn.addEventListener("click", getRandomCoctail);

getAllCocktails();
