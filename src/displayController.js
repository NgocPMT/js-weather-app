import getWeather from "./fetchController";
import "./css/style.css";
import humidityIcon from "./img/humidity.svg";
import windSpeedIcon from "./img/wind-speed.svg";
import notFoundIcon from "./img/not-found.png";
import loadingGif from "./img/loading.gif";
import { format } from "date-fns";

let isFirstRendered = true;
let isAttachedListeners = false;
let isCalcius = true;
let weatherData = null;
let dateIndex = 0;
const forecastDates = 5;

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
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    if (dateIndex === 0) {
      prevButton.className = "prev hidden";
      nextButton.className = "next";
    } else if (dateIndex === forecastDates) {
      nextButton.className = "next hidden";
      prevButton.className = "prev";
    } else {
      prevButton.className = "prev";
      nextButton.className = "next";
    }

    if (isFirstRendered) {
      await getData(location);
      const content = getUI(weatherData);
      weatherContent.innerHTML = content;
      const weatherTemp = document.querySelector("#weather-temperature");
      const prevButton = document.querySelector(".prev");
      const nextButton = document.querySelector(".next");
      prevButton.className = "prev hidden";
      nextButton.className = "next";

      if (!isAttachedListeners) {
        prevButton.addEventListener("click", async () => {
          await prevDay();
        });
        nextButton.addEventListener("click", async () => {
          await nextDay();
        });
        weatherTemp.addEventListener("click", async () => {
          isCalcius = !isCalcius;
          if (dateIndex === 0) {
            updateUI(weatherData.currentConditions);
            return;
          }
          updateUI(weatherData.days[dateIndex]);
        });
        isAttachedListeners = true;
      }
      isFirstRendered = false;
    } else {
      await getData(location);
      dateIndex = 0;
      updateUI(weatherData.currentConditions);
    }
  } catch (err) {
    console.log(err);
    weatherContent.innerHTML = `
    <img src=${notFoundIcon} alt="not found" id="not-found-icon"/>
    <p class="error-message">We didn't find any data of the location you entered. Please try another location</p>`;
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    prevButton.className = "prev hidden";
    nextButton.className = "next hidden";
    isFirstRendered = true;
  }
  loadingModal.close();
  weatherContent.className = "";
};

const nextDay = async () => {
  if (dateIndex > forecastDates) {
    return;
  }
  dateIndex++;
  if (dateIndex === 0) {
    updateUI(weatherData.currentConditions);
  } else {
    updateUI(weatherData.days[dateIndex]);
  }
};

const prevDay = async () => {
  if (dateIndex < 0) {
    return;
  }
  dateIndex--;
  if (dateIndex === 0) {
    updateUI(weatherData.currentConditions);
  } else {
    updateUI(weatherData.days[dateIndex]);
  }
};

const handleEvents = () => {
  const weatherForm = document.querySelector("#weather-searching-form");
  const searchBar = document.querySelector("#weather-searchbar");
  weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const location = searchBar.value;
    try {
      renderUI(location);
      searchBar.placeholder = location;
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
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  if (dateIndex === 0) {
    prevButton.className = "prev hidden";
    nextButton.className = "next";
  } else if (dateIndex === forecastDates) {
    nextButton.className = "next hidden";
    prevButton.className = "prev";
  } else {
    prevButton.className = "prev";
    nextButton.className = "next";
  }

  console.log("updating UI...");

  const date =
    dateIndex === 0 ? "Right Now" : format(data.datetime, "MMMMMMMM do");
  const fTemperature = data.temp;
  const cTemperature = Math.round(((fTemperature - 32) * 5) / 9);
  const description = data.conditions;
  const humidity = data.humidity;
  const windSpeed = data.windspeed;
  const icons = require.context("./img", false, /\.svg$/);
  const weatherIcon = icons(`./${data.icon}.svg`);

  const weatherDate = document.querySelector("#weather-date");
  const weatherIconEl = document.querySelector("#weather-icon");
  const weatherTempEl = document.querySelector("#weather-temperature");
  const weatherDescriptionEl = document.querySelector("#weather-description");
  const weatherHumidityEl = document.querySelector("#humidity-details>p");
  const weatherWindSpeedEl = document.querySelector("#wind-speed-details>p");

  weatherDate.textContent = date;
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
          <p id="weather-date">Right Now</p>
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
