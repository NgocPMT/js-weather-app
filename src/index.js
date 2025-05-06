import getWeather from "./fetching.js";
const weatherForm = document.querySelector("#weather-searching-form");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const location = document.querySelector("#weather-searchbar").value;

  try {
    const data = await getWeather(location);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
});
