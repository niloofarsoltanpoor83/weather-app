
console.log("Script Loaded");
    document.getElementById("searchBtn").addEventListener("click", getWeather);

async function getWeather(){

    const city = document.getElementById("cityInput").value;

    if(city === "") return;

    const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    console.log(data);

}
