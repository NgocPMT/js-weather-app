import getWeather from "./fetchController";
import "./css/style.css";
import humidityIcon from "./img/humidity.svg";
import windSpeedIcon from "./img/wind-speed.svg";
import loadingGif from "./img/loading.gif";

const renderUI = async (location) => {
  const weatherContent = document.querySelector("#weather-data");
  const loadingModal = document.querySelector("dialog#loading");
  loadingModal.innerHTML = `
    <div class="loading-content">
      <img src=${loadingGif} alt="loading"/>
    </div>
  `;
  loadingModal.showModal();
  const content = await getUI(location);
  weatherContent.innerHTML = content;
  loadingModal.close();
};

const handleSearch = () => {
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

const getUI = async (location) => {
  const data = await getWeather(location);
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
          <p id="weather-temperature">${cTemperature}<span>&deg;C</span></p>
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

export default handleSearch;
