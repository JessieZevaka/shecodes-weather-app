//Html element selectors

let temperatureElement = document.getElementById("feature-temp");
let descriptionElement = document.getElementById("weather-description");
let cityElement = document.getElementById("city");
let dateTime = document.getElementById("day-time");
let cityInput = document.getElementById("search-form");
let searchButton = document.getElementById("get-forecast");
let locationButton = document.getElementById("current-location");
let celsiusButton = document.getElementById("celsius-button");
let farenheitButton = document.getElementById("farenheit-button");
let degreeElement = document.getElementById("degree-label");
let feelsLikeElement = document.getElementById("feels-like");
let humidityElement = document.getElementById("humidity");
let highLowElement = document.getElementById("high-low");
let windSpeedElement = document.getElementById("wind");
let iconElement = document.getElementById("feature-icon");

//Event listeners
function intializeListenters() {
  searchButton.addEventListener("click", citySearch);
  locationButton.addEventListener("click", getCurrentPosition);
  farenheitButton.addEventListener("click", toFarenheit);
  celsiusButton.addEventListener("click", toCelsius);
}

//Page Model

let pageModel = {
  lat: -33,
  lon: 150,
  units: "metric",
  isMetric: true,
  city: "",
  country: "",
  temp: `<i class="fas fa-spinner fa-spin"></i>`,
  description: "",
  feelsLike: "--",
  humidity: "--",
  day: "-------",
  time: "--:--",
  high: "--",
  low: "--",
  windSpeed: "--",
  icon: "01d",
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
  cityElement.innerHTML = `${pageModel.city}, ${pageModel.country}`;
  temperatureElement.innerHTML = pageModel.temp;
  descriptionElement.innerHTML = pageModel.description;
  humidityElement.innerHTML = `<i class="fa-solid fa-droplet"></i> Humidity: ${pageModel.humidity}%`;
  dateTime.innerHTML = `${pageModel.day}, ${pageModel.time}`;
  highLowElement.innerHTML = `<i class="fa-solid fa-temperature-empty"></i> L: ${pageModel.low}° <i class="fa-solid fa-temperature-full"></i> H: ${pageModel.high}°`;
  iconElement.className = iconMap[pageModel.icon];

  if (pageModel.isMetric) {
    celsiusButton.classList.add("selected");
    farenheitButton.classList.remove("selected");
    degreeElement.innerHTML = "°C";
    feelsLikeElement.innerHTML = `Feels Like: ${pageModel.feelsLike}°C`;
    windSpeedElement.innerHTML = `<i class="fa-solid fa-wind"></i> Wind: ${pageModel.windSpeed} km/h`;
  } else {
    celsiusButton.classList.remove("selected");
    farenheitButton.classList.add("selected");
    degreeElement.innerHTML = "°F";
    feelsLikeElement.innerHTML = `Feels Like: ${pageModel.feelsLike}°F`;
    windSpeedElement.innerHTML = `<i class="fa-solid fa-wind"></i> Wind: ${pageModel.windSpeed} mi/h`;
  }

  //Weekly
  let dayNum = 1;
  for (const day of pageModel.weeklyReport) {
    let nameSetting = document.getElementById("name-day" + dayNum);
    nameSetting.innerHTML = day.day;

    let descriptionSetting = document.getElementById(
      "description-day" + dayNum
    );
    descriptionSetting.innerHTML = day.description;

    let forecastSetting = document.getElementById("forecast-day" + dayNum);
    forecastSetting.innerHTML = `<i class="fa-solid fa-temperature-empty"></i> L: ${day.tempMin}° | <i class="fa-solid fa-temperature-full"></i> H: ${day.tempMax}°`;

    let dailyIcon = document.getElementById("icon-day" + dayNum);
    dailyIcon.className = iconMap[day.icon];

    dayNum++;
  }

  //Hourly

  let hourNum = 1;
  for (const hoursObject of pageModel.hourlyReport) {
    let timeSetting = document.getElementById("hourly-time" + hourNum);
    timeSetting.innerHTML = hoursObject.hour;
    let tempSetting = document.getElementById("hourly-hl" + hourNum);
    tempSetting.innerHTML = `${hoursObject.temp}°`;
    let iconSetting = document.getElementById("hourly-icon" + hourNum);
    iconSetting.className = iconMap[hoursObject.icon];

    hourNum++;
  }
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

    //newDay.time = localDate.time;
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
