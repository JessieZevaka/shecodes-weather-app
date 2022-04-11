//Week 5 Homework Connecting to Weather API

let apiKey = "6a708bcc0ed405fb557dac7cbbae970f";
let city = "Bangkok";
let units = "metric";
let tempValue = 0;
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}`;

axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);

// week 5 geo position

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = `6a708bcc0ed405fb557dac7cbbae970f`;
  let units = "metric";
  let geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(geoApiUrl).then(showTemperature);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener("click", getCurrentPosition);

//Week5 getting temp from weather api org for city and display it inside html

function showTemperature(response) {
  console.log(response.data);
  let temp = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#feature-temp");
  let description = document.querySelector("#weather-description");
  let cityElement = document.querySelector("#city");
  let countryDescription = document.querySelector("#country");

  tempValue = temp;
  temperatureElement.innerHTML = `${temp}°C`;
  description.innerHTML = response.data.weather[0].description;
  cityElement.innerHTML = city;
  countryDescription.innerHTML = response.data.sys.country;
}

// experiemnt country

// week 5 getting weather description from weather api org and display it in html

//******(moved into function above)******
//let description = document.querySelector("#weather-description");
//description.innerHTML = response.data.weather[0].description;

//week 5 getting the city name to change with selected city at top of page

//******(moved into function above)******
//let cityElement = document.querySelector("#city");

//Week 4 Homework Feature 1 (AKA - Get time & day for feature section)

let currentDate = new Date();

let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekDay = weekDays[currentDate.getDay()];

let minutes = currentDate.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let hours = currentDate.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}

let dateTime = document.querySelector("#day-time");
dateTime.innerHTML = `${weekDay}, ${hours}:${minutes}`;

//Week 4 Homework Feature 2 (AKA basic search engine for locations)

function citySearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-form");
  let city = document.querySelector("#city");
  let cityName = cityInput.value.trim();
  if (cityName.length > 0) {
    city.innerHTML = cityName;
  }
}

let element = document.querySelector("#get-forecast");
element.addEventListener("click", citySearch);

//Week 4 Homework Feature Bonus 🙀Bonus Feature
//Display a fake temperature (i.e 17) in Celsius and add a link to convert it to Fahrenheit.
//When clicking on it, it should convert the temperature to Fahrenheit.
//When clicking on Celsius, it should convert it back to Celsius.

function toFarenheit() {
  var farenheit = (tempValue * 9) / 5 + 32;
  farenheit = Math.round(farenheit);
  document.getElementById("feature-temp").innerHTML = farenheit + "°F";
  let celsiusButton = document.getElementById("celsius-button");
  let farenheitButton = document.getElementById("farenheit-button");

  celsiusButton.classList.remove("selected");
  farenheitButton.classList.add("selected");
}

let farenheitClick = document.querySelector("#farenheit-button");
farenheitClick.addEventListener("click", toFarenheit);

function toCelsius() {
  var celsius = tempValue;
  celsius = Math.round(celsius);
  document.getElementById("feature-temp").innerHTML = celsius + "°C";

  let celsiusButton = document.getElementById("celsius-button");
  let farenheitButton = document.getElementById("farenheit-button");

  celsiusButton.classList.add("selected");
  farenheitButton.classList.remove("selected");
}

let celsiusClick = document.querySelector("#celsius-button");
celsiusClick.addEventListener("click", toCelsius);

weeklyReport: [
    {
      day: "Monday",
      description: "Rain",
      tempMin: 0,
      tempMax: 0,
      icon: "01d",
    },

    {
      day: "Tuesday",
      description: "Rain",
      tempMin: 0,
      tempMax: 0,
      icon: "01d",
    },

    {
      day: "Wednesday",
      description: "Sunny",
      tempMin: 0,
      tempMax: 0,
      icon: "01d",
    },

    {
      day: "Thursday",
      description: "Mist",
      tempMin: 0,
      tempMax: 0,
      icon: "01d",
    },

    {
      day: "Friday",
      description: "Cloudy",
      tempMin: 0,
      tempMax: 0,
      icon: "01d",
    },

    {
      day: "Friday",
      description: "Cloudy",
      tempMin: 0,
      tempMax: 0,
      icon: "01d",
    },
  ],


  hourlyReport: [
    {
      icon: "01d",
      temp: 0,
      hour: "10:00",
    },

    {
      icon: "01d",
      temp: 0,
      hour: "10:00",
    },

    {
      icon: "01d",
      temp: 0,
      hour: "10:00",
    },

    {
      icon: "01d",
      temp: 0,
      hour: "10:00",
    },

    {
      icon: "01d",
      temp: 0,
      hour: "10:00",
    },

    {
      icon: "01d",
      temp: 0,
      hour: "10:00",
    },
  ],