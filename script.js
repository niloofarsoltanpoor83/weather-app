console.log("Script version2");

const API_KEY = "c7246f4ed11c174296162dff32c97872";
// Favorite Cities
let favoriteCities =
JSON.parse(localStorage.getItem("favoriteCities")) || [];
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
        showCityPhoto(data.name,data.sys.country);
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
        displayHourlyForecast(data);
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
                <p class="forecast-date">${monthDay}</p>
                <img src="${iconUrl}" alt="Weather Icon">
                 <p class="main-temperature">${Math.round(day.main.temp)} °C</p>

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

    weatherResult.innerHTML = `
        <h2>Loading weather data... ⏳</h2>
    `;

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        displayWeather(data);
        fetchForecast(data.name);
       showCityPhoto(data.name,data.sys.country);
    } catch (error) {
        console.error("Weather API Error:", error);

        weatherResult.innerHTML = `
            <h2>Unable to get weather data.</h2>
            <p>Please check your internet connection or try again.</p>
        `;
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

      <div class="hero-weather">

    <div class="city-name">
        ${data.name}, ${data.sys.country}
    </div>

    <img class="weather-icon-big"
         src="${iconUrl}"
         alt="Weather Icon">

    <div class="main-temperature">
        ${Math.round(data.main.temp)}°C
    </div>

    <div class="weather-description">
        ${data.weather[0].description}
    </div>

</div>
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
async function showCityPhoto(city, country) {

    const cityPhoto = document.getElementById("cityPhoto");
    const cityPhotoImg = document.getElementById("cityPhotoImg");

    if (!cityPhoto || !cityPhotoImg) return;

    cityPhoto.classList.remove("show");

    const cityName = encodeURIComponent(city);

    const photoUrl =
        `https://source.unsplash.com/1200x500/?${cityName},${encodeURIComponent(country)}`;

    cityPhotoImg.onload = () => {
        cityPhoto.classList.add("show");
    };

    cityPhotoImg.onerror = () => {
        cityPhoto.classList.remove("show");
    };

    cityPhotoImg.src = photoUrl;
}
let clockInterval;

function updateLocalTime(timezone) {

    clearInterval(clockInterval);

    let timeElement = document.getElementById("localTime");

    // اگر localTime وجود نداشت، خودش آن را می‌سازد
    if (!timeElement) {

        timeElement = document.createElement("p");

        timeElement.id = "localTime";
        timeElement.className = "local-time";

        const title = document.querySelector("#weatherResult h2");

        if (title) {
            title.insertAdjacentElement("afterend", timeElement);
        } else {
            console.log("localTime element could not be created.");
            return;
        }
    }

    function refresh() {

        const now = new Date();

        const utc =
            now.getTime() +
            now.getTimezoneOffset() * 60000;

        const cityTime =
            new Date(utc + timezone * 1000);

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

    body.classList.remove(
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
        "default"
    );

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
   
function displayAirQuality(data){

    const oldAirQuality = document.getElementById("airQuality");

    if(oldAirQuality){
        oldAirQuality.remove();
    }

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

    <div id="airQuality">

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

    </div>

    `;

}
function displayHourlyForecast(data){

    const hourlyContainer = document.getElementById("hourlyForecast");

    hourlyContainer.innerHTML = "";

    const hourlyData = data.list.slice(0, 8);

    hourlyData.forEach(hour => {

        const time = new Date(hour.dt_txt);

        const hourText = time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const icon = hour.weather[0].icon;

        hourlyContainer.innerHTML += `

        <div class="hour-card">

            <h4>${hourText}</h4>

            <img src="https://openweathermap.org/img/wn/${icon}@2x.png">

            <p>${Math.round(hour.main.temp)} °C</p>

            <p>${hour.weather[0].description}</p>

        </div>

        `;

    });
}
const themeBtn = document.getElementById("themeBtn");

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️ Light Mode";
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");
    alert(document.body.className);
    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        themeBtn.textContent = "☀️ Light Mode";
    }else{
        localStorage.setItem("theme","light");
        themeBtn.textContent = "🌙 Dark Mode";
    }

});
function saveFavorites() {
    localStorage.setItem(
        "favoriteCities",
        JSON.stringify(favoriteCities)
    );
}

function addFavorite(city) {

    city = city.trim();

    if (!city) return;

    if (!favoriteCities.includes(city)) {

        favoriteCities.push(city);

        saveFavorites();

        renderFavorites();

    }

}

function removeFavorite(city){

    favoriteCities =
    favoriteCities.filter(item => item !== city);

    saveFavorites();

    renderFavorites();

}
function renderFavorites(){

    const container =
    document.getElementById("favoriteCities");

    if(!container) return;

    container.innerHTML = "";

    favoriteCities.forEach(city => {

        const item =
        document.createElement("div");

        item.className = "favorite-city";

        item.innerHTML = `
            <span>${city}</span>
            <button onclick="removeFavorite('${city}')">
                ❌
            </button>
        `;

        item.querySelector("span")
        .addEventListener("click", () => {

            cityInput.value = city;

            getWeather();

        });

        container.appendChild(item);

    });

}
renderFavorites();

const favoriteBtn =
document.getElementById("favoriteBtn");

favoriteBtn.addEventListener("click",()=>{

    const city =
    document.getElementById("cityInput").value;

    addFavorite(city);

});
                
async function getCityPhoto(city) {

    const cityPhoto = document.getElementById("cityPhoto");
    const cityPhotoImg = document.getElementById("cityPhotoImg");

    if (!cityPhoto || !cityPhotoImg) return;

    cityPhoto.classList.remove("show");

    try {

        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(city)}&per_page=1&orientation=landscape`,
            {
                headers: {
                    Authorization: "Nk57rkbz2ht5YrWMxgEz0i3VnlZ9XnYngaibViIFva25qjIaRy1SldXc"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Pexels error: ${response.status}`);
        }

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {

            cityPhotoImg.src = data.photos[0].src.large2x;
            cityPhotoImg.alt = `${city} city photo`;

            cityPhoto.classList.add("show");

        } else {

            console.log("No photo found for:", city);

        }

    } catch (error) {

        console.error("City photo error:", error);
        cityPhoto.classList.remove("show");

    }
}
