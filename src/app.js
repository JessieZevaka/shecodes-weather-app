//Html element selectors

let cityInput = document.getElementById("search-form");
let searchButton = document.getElementById("get-forecast");
let locationButton = document.getElementById("current-location");

let forecastElement = document.getElementById("forecast-weekly");
let hourlyReportElement = document.getElementById("hourly-report");
let feature1Element = document.getElementById("feature-1");
let feature2Element = document.getElementById("feature-2");

//Event listeners
function intializeListenters() {
  searchButton.addEventListener("click", citySearch);
  locationButton.addEventListener("click", getCurrentPosition);
}

//Page Model

let pageModel = {
  units: "metric",
  isMetric: true,
};

//icon list
const iconMap = {
  "01d": "fa-solid fa-sun yellowglow",
  "01n": "fa-solid fa-moon purpleglow",
  "02d": "fa-solid fa-cloud-sun yellowglow",
  "02n": "fa-solid fa-cloud-moon purpleglow",
  "03d": "fa-solid fa-cloud aquaglow",
  "03n": "fa-solid fa-cloud darkglow",
  "04d": "fa-solid fa-cloud blueglow",
  "04n": "fa-solid fa-cloud purpleglow",
  "09d": "fa-solid fa-cloud-showers-heavy darkglow",
  "09n": "fa-solid fa-cloud-showers-heavy purpleglow",
  "10d": "fa-solid fa-cloud-sun-rain yellowglow",
  "10n": "fa-solid fa-cloud-moon-rain purpleglow",
  "11d": "fa-solid fa-cloud-bolt redglow",
  "11n": "fa-solid fa-cloud-bolt redglow",
  "13d": "fa-solid fa-snowflake icyglow",
  "13n": "fa-solid fa-snowflake darkglow",
  "50d": "fa-solid fa-water icyglow",
  "50n": "fa-solid fa-water darkglow",
};

function updatePage() {
  //Feature

  let degreeLabel = "°C";
  let windSpeedLabel = "km/h";
  let cClass = "";
  let fClass = "";

  if (pageModel.isMetric) {
    // celsiusButton.classList.add("selected");
    // farenheitButton.classList.remove("selected");
    cClass = "selected";
    fClass = "";
  } else {
    // celsiusButton.classList.remove("selected");
    // farenheitButton.classList.add("selected");

    degreeLabel = "°F";
    windSpeedLabel = "mi/h";
    cClass = "";
    fClass = "selected";
  }

  //Feature 1

  let feature1HTML = `<div class="temp-text">
            <span>${pageModel.city}, ${pageModel.country}</span>
            </div>
            <h3 class="featuredate">${pageModel.day}, ${pageModel.time}</h3>
            <p class="hilo"><i class="fa-solid fa-temperature-empty"></i> L: ${pageModel.low}° <i class="fa-solid fa-temperature-full"></i> H: ${pageModel.high}°</p>
            <p>Feels Like: ${pageModel.feelsLike}${degreeLabel}</p>
            <p><i class="fa-solid fa-droplet"></i> Humidity: ${pageModel.humidity}%</p>
            <p class="wind">Wind: ${pageModel.windSpeed} ${windSpeedLabel}</p>`;

  feature1Element.innerHTML = feature1HTML;

  //Feature 2

  let feature2HTML = `
    <div class="col-12 d-flex align-items-end flex-column fcbuttons">
              <button id="celsius-button" class="${cClass}" onclick="toCelsius()" >°C</button>
              <button id="farenheit-button" class="${fClass}" onclick="toFarenheit()">°F</button>
            </div>
    <div class="temp-text2">${pageModel.temp}${degreeLabel}</div>

    <h2 class="weatherdescription col-10 offset-1"
    >${pageModel.description}</h2>

    <div class="iconbig">
        <i class="${iconMap[pageModel.icon]}"></i>
    </div>`;

  feature2Element.innerHTML = feature2HTML;

  //Weekly
  let forecastHTML = "";

  for (const day of pageModel.weeklyReport) {
    forecastHTML =
      forecastHTML +
      `<div class="row rowOutline weekly">
        <div class="col-12 col-sm-4 mt-2">
          <h3>${day.day}</h3>
          <h3 class="fw-lighter wdtext">${day.description}</h3>
        </div>
        <div class="col-12 col-sm-4">
          <h3 class="forecastweekly">
            <i class="fa-solid fa-temperature-empty"></i> L: ${
              day.tempMin
            } | <i class="fa-solid fa-temperature-full"></i> H: ${day.tempMax}
          </h3>
        </div>
        <div class="col-12 col-sm-4 mt-sm-0 iconmed">
          <i class="${iconMap[day.icon]}"></i>
        </div>
      </div>`;
  }
  forecastElement.innerHTML = forecastHTML;

  //Hourly
  let hourlyForecastHTML = "";

  for (const hoursObject of pageModel.hourlyReport) {
    hourlyForecastHTML =
      hourlyForecastHTML +
      ` <div class="col-lg-2 col-sm-4 col-6">
            <div class="hours">
              <div class="iconsml">
                <i class="${iconMap[hoursObject.icon]}"></i>
              </div>
              <h5 class="hours-temp">${hoursObject.temp}°</h5>
              <h5 class="fw-lighter">${hoursObject.hour}</h5>
            </div>
          </div>`;
  }
  hourlyReportElement.innerHTML = hourlyForecastHTML;
}

//Defalt API call (First Call)

let apiKey = "6a708bcc0ed405fb557dac7cbbae970f";
let city = "Sydney";
let firstCallUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${pageModel.units}`;
axios.get(`${firstCallUrl}&appid=${apiKey}`).then(getLocation);

//Location data handler (Second Call)
function getLocation(response) {
  pageModel.city = response.data.name;
  pageModel.country = response.data.sys.country;
  pageModel.lat = response.data.coord.lat;
  pageModel.lon = response.data.coord.lon;

  requestWeather();
}

function requestWeather() {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${pageModel.lat}&lon=${pageModel.lon}&exclude=minutely,alerts&appid=${apiKey}&units=${pageModel.units}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(packageData);
}

//API Weather data handler

function packageData(response) {
  //Feature Weather
  const data = response.data;
  let temp = Math.round(data.current.temp);
  pageModel.temp = temp;
  pageModel.description = data.current.weather[0].description;
  pageModel.icon = data.current.weather[0].icon;

  let feelslike = Math.round(data.current.feels_like);
  pageModel.feelsLike = feelslike;
  pageModel.humidity = data.current.humidity;

  let localDate = toLocalTime(data.current.dt, data.timezone_offset);
  pageModel.day = localDate.day;
  pageModel.time = localDate.time;
  pageModel.high = Math.round(data.daily[0].temp.max);
  pageModel.low = Math.round(data.daily[0].temp.min);

  if (pageModel.isMetric) {
    pageModel.windSpeed = Math.round(data.current.wind_speed * 3.6);
  } else {
    pageModel.windSpeed = Math.round(data.current.wind_speed);
  }

  // Weekly Forecast
  pageModel.weeklyReport = [];
  for (let i = 1; i < 7; i++) {
    const apiDaily = data.daily[i];

    const newDay = {};

    let dailyDate = toLocalTime(apiDaily.dt, data.timezone_offset);
    newDay.day = dailyDate.day;

    newDay.time = localDate.time;
    newDay.tempMax = Math.round(apiDaily.temp.max);
    newDay.tempMin = Math.round(apiDaily.temp.min);
    newDay.description = apiDaily.weather[0].main;
    newDay.icon = apiDaily.weather[0].icon;

    pageModel.weeklyReport.push(newDay);
  }

  // Hourly Forecast
  pageModel.hourlyReport = [];

  for (let i = 1; i < 7; i++) {
    const apiHourly = data.hourly[i];

    const newHour = {};

    let hourlyTime = toLocalTime(apiHourly.dt, data.timezone_offset);
    newHour.hour = hourlyTime.time;
    newHour.temp = Math.round(apiHourly.temp);
    newHour.icon = apiHourly.weather[0].icon;

    pageModel.hourlyReport.push(newHour);
  }

  updatePage();
}

// Search Form
function citySearch(event) {
  event.preventDefault();
  let cityName = cityInput.value.trim();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${pageModel.units}`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(getLocation);
}

//Geo location

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${pageModel.units}`;

  axios.get(geoApiUrl).then(getLocation);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

// F button

function toFarenheit() {
  pageModel.units = "imperial";
  pageModel.isMetric = false;
  requestWeather();
}

//C button

function toCelsius() {
  pageModel.units = "metric";
  pageModel.isMetric = true;
  requestWeather();
}

//Local date conversion

function toLocalTime(dt, tzOffset) {
  let localDate = new Date(
    (dt + tzOffset + new Date().getTimezoneOffset() * 60) * 1000
  );

  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return {
    time: `${localDate.getHours().toString().padStart(2, 0)}:${localDate
      .getMinutes()
      .toString()
      .padStart(2, 0)}`,
    day: weekDays[localDate.getDay()],
  };
}

intializeListenters();
