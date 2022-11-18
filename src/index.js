// display the current date and time
let now = new Date();

let date = now.getDate();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[now.getDay()];
let hour = now.getHours();
let minutes = now.getMinutes();
let period = "AM";
if (hour > 12) {
  period = "PM";
  hour = hour - 12;
} else {
  period = "AM";
}
if (hour < 10) {
  hour = `0${hour}`;
}

if (minutes < 10) {
  minutes = `0${minutes}`;
}
let dayShow = document.querySelector("#date");
dayShow.innerHTML = `${day}, ${hour}:${minutes} ${period}`;

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[now.getMonth()];
let year = now.getFullYear();
let dateShow = document.querySelector("#day");
dateShow.innerHTML = `${month} ${date}, ${year}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-3">
        <div class="WeatherForecastPreview">
          <div class="forecast-time">${formatDay(forecastDay.dt)}</div>
          <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
          <div class="forecast-temperature">
            <span class="forecast-temperature-max">${Math.round(
              forecastDay.temp.max
            )}°</span
            ><span class="forecast-temperature-min">${Math.round(
              forecastDay.temp.min
            )}°</span>
          </div>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "6a48a550fc04f170639e60d52b8a6bc5";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}
function showTemperature(response) {
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;

  let temperature = document.querySelector("#actual-temperature");
  temperature.innerHTML = Math.round(response.data.main.temp);

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  let detail = document.querySelector("#description");
  detail.innerHTML = response.data.weather[0].main;
  console.log(response);

  getForecast(response.data.coord);
}

function searchWeather(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let cityMain = document.querySelector("#city");
  cityMain.innerHTML = cityInput.value;

  let apiKey = "b400ae3b711a616262d18b0ca2cbe78f";
  let url = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${url}?q=${cityInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function currentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = "b400ae3b711a616262d18b0ca2cbe78f";
  let url = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${url}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(currentLocation);
}

let searchButton = document.querySelector("#submit");
searchButton.addEventListener("click", searchWeather);
let formButton = document.querySelector("#submit");
formButton.addEventListener("submit", searchWeather);

let current = document.querySelector("#current");
current.addEventListener("click", getPosition);
