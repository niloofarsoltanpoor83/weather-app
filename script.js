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
        <p>${data.main.temp} °C</p>
        <p>${data.weather[0].description}</p>
    `;

}
