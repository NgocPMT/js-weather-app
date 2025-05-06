const getWeather = async (location) => {
  try {
    const apiLocation = location.replace(" ", "%20");
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${apiLocation}?unitGroup=us&key=NCCRSSJLNQAU98TK8MM6D8ZLL&contentType=json`,
      { mode: "cors" }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default getWeather;
