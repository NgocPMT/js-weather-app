import getWeather from "./fetching";
import "./css/style.css";
import locationIcon from "./img/location.svg";
import searchIcon from "./img/search.svg";
import partlyCloudIcon from "./img/partly-cloud.svg";
import humidityIcon from "./img/humidity.svg";
import windSpeedIcon from "./img/wind-speed.svg";

export default function renderUI() {
  const mainContent = document.querySelector("#main-content");
  const content = getUI();
  mainContent.innerHTML = content;
  handleSearch();
}

const handleSearch = () => {
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
};

const getUI = () => {
  return `
  <div class="main-wrapper">
      <section id="search">
        <img src=${locationIcon} />
        <form id="weather-searching-form">
          <input
            type="search"
            id="weather-searchbar"
            name="weather-location"
            required
          />
          <button id="weather-search-button">
            <img src=${searchIcon} />
          </button>
        </form>
      </section>
      <section id="weather-data">
        <img id="weather-icon" src=${partlyCloudIcon} alt="" />
        <div id="weather-details">
          <p id="weather-temperature">0<span>&deg;C</span></p>
          <p id="weather-description">Broken clouds</p>
          <div>
            <div id="weather-humidity">
              <img src=${humidityIcon} alt="" />
              <div id="humidity-details">
                <p>88%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div id="weather-wind-speed">
              <img src=${windSpeedIcon} alt="" />
              <div id="wind-speed-details">
                <p>0Km/h</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
`;
};
