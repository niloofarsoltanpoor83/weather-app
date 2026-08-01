console.log("Script version2");

const API_KEY = "c7246f4ed11c174296162dff32c97872";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherResult = document.getElementById("weatherResult");
const updateTime = document.getElementById("updateTime");
const body = document.body;

searchBtn.addEventListener("click", getWeather);

locationBtn.addEventListener("click", getLocationWeather);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {
        weatherResult.innerHTML = "<h2>Please enter a city.</h2>";
        return;
    }

    weatherResult.innerHTML = "<h2>Loading...</h2>";

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        displayWeather(data);
        fetchForecast(city);
    } catch (error) {

        console.log(error);

        weatherResult.innerHTML =
            "<h2>City not found.</h2>";

    }

}
async function fetchForecast(city){

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        if(!response.ok){

            throw new Error("Forecast not found");

        }

        const data = await response.json();

        displayForecast(data);

    }catch(error){

        console.log(error);

    }

}
async function fetchAirQuality(lat, lon) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        if(!response.ok){

            throw new Error("Air quality not found");

        }

        const data = await response.json();

        displayAirQuality(data);

    } catch(error){

        console.log(error);

    }

}
function displayForecast(data) {

    const forecastContainer = document.getElementById("forecast");

    forecastContainer.innerHTML = "";

    const dailyForecast = [];

    data.list.forEach(item => {

        if (item.dt_txt.includes("12:00:00")) {

            dailyForecast.push(item);

        }

    });

    dailyForecast.forEach(day => {

        const date = new Date(day.dt_txt);

      const weekDay = date.toLocaleDateString("en-US", {
    weekday: "long"
});

const monthDay = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short"
});
        const icon = day.weather[0].icon;

        const iconUrl =
            `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const rainChance=
            Math.round((day.pop || 0)*100);
        forecastContainer.innerHTML += `

            <div class="forecast-card">

                <h4>${weekDay}</h4>
                <p class="forecast-date">$
                {monthDay}</p>
                <img src="${iconUrl}" alt="Weather Icon">

                <p>${Math.round(day.main.temp)} °C</p>

                <p>${day.weather[0].description}</p>
                 <p>${rainChance}%</p>
            </div>

        `;

    });

}
function getLocationWeather() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(
        showPosition,
        showError
    );

}

async function showPosition(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        displayWeather(data);
       fetchForecast(data.name);
    } catch (error) {

        console.log(error);

        weatherResult.innerHTML =
            "<h2>Something went wrong!</h2>";

    }

}

function showError(error) {

    alert("Unable to get your location.");

}
function getLocationWeather(){

    if(navigator.geolocation){

        console.log("Location button clicked");

        navigator.geolocation.getCurrentPosition(showPosition, showError);

    }else{

        alert("Geolocation is not supported by this browser.");

    }

}


async function getWeatherByLocation(lat, lon){

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        document.getElementById("weatherResult").innerHTML = `
            <h2>${data.name}</h2>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

                <div class="card">
                    <h4>🌡️ Temperature</h4>
                    <p>${data.main.temp} °C</p>
                </div>

                <div class="card">
                    <h4>💧 Humidity</h4>
                    <p>${data.main.humidity}%</p>
                </div>

                <div class="card">
                    <h4>💨 Wind</h4>
                    <p>${data.wind.speed} m/s</p>
                </div>

            </div>
        `;

        showWeatherAnimation(data.weather[0].main);

    }catch(error){

        console.log("THIS CATCH RUN:",error);

        document.getElementById("weatherResult").innerHTML =
        "<h2>Something went wrong!</h2>";

    }

}


function showError(error){

    alert("Unable to get your location.");

}
function formatTime(timestamp){

    return new Date(timestamp * 1000).toLocaleTimeString("en-US",{
        hour:"2-digit",
        minute:"2-digit"
    });

}
function getWindDirection(deg){

    const directions = [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW"
    ];

    const index = Math.round(deg / 45) % 8;

    return directions[index];

}
function displayWeather(data) {

    const weather = data.weather[0].main;
    const icon = data.weather[0].icon;

    const iconUrl =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    changeBackground(weather);

    showWeatherAnimation(weather);

    const now = new Date();

    updateTime.innerHTML =
        "Updated: " +
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
const sunrise = formatTime(data.sys.sunrise);

const sunset = formatTime(data.sys.sunset);
const windDirection = getWindDirection(data.wind.deg);
    weatherResult.innerHTML = `

       <h2>${data.name}, ${data.sys.country}</h2>
       <p id="localTime"
       class="local-time"></p>
        <img src="${iconUrl}" alt="Weather Icon">

        <div class="weather-info">

            <div class="card">
                <h4>🌡️ Temperature</h4>
                <p>${Math.round(data.main.temp)} °C</p>
            </div>

            <div class="card">
                <h4>🤗 Feels Like</h4>
                <p>${Math.round(data.main.feels_like)} °C</p>
            </div>

            <div class="card">
                <h4>💧 Humidity</h4>
                <p>${data.main.humidity}%</p>
            </div>

            <div class="card">
                <h4>💨 Wind</h4>
                <p>${data.wind.speed} m/s</p>
            </div>

            <div class="card">
                <h4>🌡️ Min Temp</h4>
                <p>${Math.round(data.main.temp_min)} °C</p>
            </div>
<div class="card">
    <h4>📈 Max Temp</h4>
    <p>${Math.round(data.main.temp_max)} °C</p>
</div>

<div class="card">
    <h4>🌅 Sunrise</h4>
    <p>${sunrise}</p>
</div>

<div class="card">
    <h4>🌇 Sunset</h4>
    <p>${sunset}</p>
</div>
<div class="card">
    <h4>🌡️ Pressure</h4>
    <p>${data.main.pressure} hPa</p>
</div>

<div class="card">
    <h4>👁️ Visibility</h4>
    <p>${data.visibility / 1000} km</p>
</div>
<div class="card">
    <h4>🧭 Wind Direction</h4>
    <p>${windDirection}</p>
</div>
`;
            
updateLocalTime(data.timezone);
    fetchAirQuality(
    data.coord.lat,
    data.coord.lon
);
}

let clockInterval;

function updateLocalTime(timezone) {

    clearInterval(clockInterval);

    const timeElement = document.getElementById("localTime");

    function refresh() {

        const now = new Date();

        const utc = now.getTime() + now.getTimezoneOffset() * 60000;

        const cityTime = new Date(utc + timezone * 1000);

        timeElement.textContent =
            "🕒 " +
            cityTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

    }

    refresh();

    clockInterval = setInterval(refresh, 1000);

}
function changeBackground(weather) {

    body.className = "";

    if (weather === "Clear") {

        body.classList.add("sunny");

    }

    else if (weather === "Clouds") {

        body.classList.add("cloudy");

    }

    else if (

        weather === "Rain" ||
        weather === "Drizzle" ||
        weather === "Thunderstorm"

    ) {

        body.classList.add("rainy");

    }

    else if (weather === "Snow") {

        body.classList.add("snowy");

    }

    else {

        body.classList.add("default");

    }

}
function showWeatherAnimation(weather) {

    const animation = document.getElementById("weatherAnimation");

    animation.innerHTML = "";

    if (weather === "Clear") {

        animation.innerHTML = `
            <div class="sun"></div>
        `;

    }

    else if (weather === "Clouds") {

        animation.innerHTML = `
            <div class="cloud"></div>
        `;

    }

    else if (
        weather === "Rain" ||
        weather === "Drizzle" ||
        weather === "Thunderstorm"
    ) {

        for (let i = 0; i < 120; i++) {

            const drop = document.createElement("div");

            drop.className = "drop";

            drop.style.left = Math.random() * window.innerWidth + "px";

            drop.style.animationDelay = Math.random() * 2 + "s";

            drop.style.animationDuration =
                (0.6 + Math.random() * 0.5) + "s";

            animation.appendChild(drop);

        }

    }

    else if (weather === "Snow") {

        for (let i = 0; i < 80; i++) {

            const snow = document.createElement("div");

            snow.innerHTML = "❄";

            snow.style.position = "absolute";

            snow.style.left = Math.random() * window.innerWidth + "px";

            snow.style.top = "-20px";

            snow.style.fontSize =
                (10 + Math.random() * 15) + "px";

            snow.style.opacity = Math.random();

            snow.style.animation = `snowFall ${4 + Math.random() * 4}s linear infinite`;

            snow.style.animationDelay =
                Math.random() * 4 + "s";

            animation.appendChild(snow);

        }

    }

}
 async function showPosition(position){

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    const weather = data.weather[0].main;

    showWeatherAnimation(weather);

    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById("weatherResult").innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="Weather Icon">

        <div class="weather-info">

<div class="card">
<h4>🌡️ Temperature</h4>
<p>${data.main.temp} °C</p>
  </div>
 <div class="card">
 <h4>💧 Humidity</h4>
 <p>${data.main.humidity}%</p>
 </div>
  <div class="card">
<h4>💨 Wind</h4>
 <p>${data.wind.speed} m/s</p>
 <div class="weather-info">
<div class="card">
    <h4>🌅 Sunrise</h4>
    <p>${sunrise}</p>
</div>

<div class="card">
    <h4>🌇 Sunset</h4>
    <p>${sunset}</p>
</div>
            </div>

        </div>
    `;

}
function displayAirQuality(data){

    const air = data.list[0];

    const aqi = air.main.aqi;

    let quality;

    if(aqi === 1){
        quality = "Good 😊";
    }
    else if(aqi === 2){
        quality = "Fair 🙂";
    }
    else if(aqi === 3){
        quality = "Moderate 😐";
    }
    else if(aqi === 4){
        quality = "Poor 😷";
    }
    else {
        quality = "Very Poor ☠️";
    }


    weatherResult.innerHTML += `

        <div class="card">
            <h4>🌱 Air Quality</h4>
            <p>${quality}</p>
        </div>

        <div class="card">
            <h4>PM2.5</h4>
            <p>${air.components.pm2_5} μg/m³</p>
        </div>

        <div class="card">
            <h4>PM10</h4>
            <p>${air.components.pm10} μg/m³</p>
        </div>

    `;

}
