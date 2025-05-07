import getWeather from "./fetchController";
import "./css/style.css";
import humidityIcon from "./img/humidity.svg";
import windSpeedIcon from "./img/wind-speed.svg";
import loadingGif from "./img/loading.gif";

let isFirstRendered = true;
let isCalcius = true;
let weatherData = null;

const renderUI = async (location) => {
  const weatherCard = document.querySelector(".main-wrapper");
  const weatherContent = document.querySelector("#weather-data");
  const loadingModal = document.querySelector("dialog#loading");
  weatherContent.className = "hidden";
  weatherCard.style.height = "min(85vh, 48.5rem)";
  weatherContent.style.height = "min(75vh, 42rem)";
  loadingModal.innerHTML = `
    <div class="loading-content">
      <img src=${loadingGif} alt="loading"/>
    </div>
  `;
  loadingModal.showModal();
  try {
    if (isFirstRendered) {
      await getData(location);
      const content = getUI(weatherData);
      weatherContent.innerHTML = content;
      const weatherTemp = document.querySelector("#weather-temperature");
      weatherTemp.addEventListener("click", async () => {
        isCalcius = !isCalcius;
        updateUI(weatherData);
      });
      isFirstRendered = false;
    } else {
      updateUI(weatherData);
    }
  } catch (err) {
    console.log(err);
    weatherContent.innerHTML = `<p class="error-message">We didn't find any data of the location you entered. Please try another location</p>`;
  }
  loadingModal.close();
  weatherContent.className = "";
};

const handleEvents = () => {
  const weatherForm = document.querySelector("#weather-searching-form");
  weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const location = document.querySelector("#weather-searchbar").value;

    try {
      renderUI(location);
    } catch (err) {
      console.log(err);
    }
  });
};

const getData = async (location) => {
  console.log("getting data...");
  weatherData = await getWeather(location);
  console.log("done");
  console.log(weatherData);
};

const updateUI = (data) => {
  console.log("updating UI...");
  const fTemperature = data.currentConditions.temp;
  const cTemperature = Math.round(((fTemperature - 32) * 5) / 9);
  const description = data.currentConditions.conditions;
  const humidity = data.currentConditions.humidity;
  const windSpeed = data.currentConditions.windspeed;
  const icons = require.context("./img", false, /\.svg$/);
  const weatherIcon = icons(`./${data.currentConditions.icon}.svg`);

  const weatherIconEl = document.querySelector("#weather-icon");
  const weatherTempEl = document.querySelector("#weather-temperature");
  const weatherDescriptionEl = document.querySelector("#weather-description");
  const weatherHumidityEl = document.querySelector("#humidity-details>p");
  const weatherWindSpeedEl = document.querySelector("#wind-speed-details>p");
  weatherIconEl.src = weatherIcon;
  weatherTempEl.innerHTML = isCalcius
    ? `${cTemperature}<span>&deg;C<span>`
    : `${fTemperature}<span>&deg;F<span>`;
  weatherDescriptionEl.textContent = description;
  weatherHumidityEl.textContent = humidity + "%";
  weatherWindSpeedEl.textContent = windSpeed + "Km/h";
};

const getUI = (data) => {
  console.log("getting UI...");
  const fTemperature = data.currentConditions.temp;
  const cTemperature = Math.round(((fTemperature - 32) * 5) / 9);
  const description = data.currentConditions.conditions;
  const humidity = data.currentConditions.humidity;
  const windSpeed = data.currentConditions.windspeed;
  const icons = require.context("./img", false, /\.svg$/);
  const weatherIcon = icons(`./${data.currentConditions.icon}.svg`);
  return `

        <img id="weather-icon" src=${weatherIcon} alt="" />
        <div id="weather-details">
          <p id="weather-temperature">${cTemperature}<span id="temp-degree">&deg;C</span></p>
          <p id="weather-description">${description}</p>
          <div>
            <div id="weather-humidity">
              <img src=${humidityIcon} alt="" />
              <div id="humidity-details">
                <p>${humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div id="weather-wind-speed">
              <img src=${windSpeedIcon} alt="" />
              <div id="wind-speed-details">
                <p>${windSpeed}Km/h</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
`;
};

export default handleEvents;
