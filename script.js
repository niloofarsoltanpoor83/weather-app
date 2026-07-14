async function getWeather() {

    const city = document.getElementById("cityInput").value;

    const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    if (data.cod == "404") {

        document.getElementById("weatherResult").innerHTML =
        "<h2>City not found!</h2>";

        return;
    }

     document.getElementById("weatherResult").innerHTML = `

    <h2>${data.name}</h2>

    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>

    <p><strong>Weather:</strong> ${data.weather[0].description}</p>

    <p><strong>Feels Like:</strong> ${data.main.feels_like} °C</p>

    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>

    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>

    <p><strong>Min Temp:</strong> ${data.main.temp_min} °C</p>

    <p><strong>Max Temp:</strong> ${data.main.temp_max} °C</p>

`;

}
