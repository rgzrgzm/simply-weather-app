const container = document.querySelector(".container");
const inputPart = document.querySelector(".input-part");
const infoTxt = document.querySelector(".info-txt");
const inputField = document.querySelector("input");
const locationBtn = document.querySelector("button");
const imgContainer = document.querySelector(".weather-part img");
const arrowBack = document.querySelector('header i')
const appId = "edc4b1e308af4d547924835fd1fc19fd";
let url;

inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputField != "") {
    callAPI(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSucces, onError);
  } else {
    alert("This browser not support geolocation");
  }
});

arrowBack.addEventListener('click', () => {
    container.classList.remove('active')
})

function onSucces(position) {
  //   console.log(position);
  const { latitude, longitude } = position.coords;
  url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${appId}`;
  fetchingData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function callAPI(city) {
  url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${appId}`;
  fetchingData();
}

function showResults(info) {
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    infoTxt.classList.replace("pending", "error");
    return;
  }
  
  infoTxt.classList.remove("pending", "error");
  container.classList.add("active");

  const city = info.name;
  const country = info.sys.country;
  const { description, id } = info.weather[0];
  const { feels_like, humidity, temp } = info.main;

  checkImage(id);

  container.querySelector(".temp .numb").innerText = Math.floor(temp);
  container.querySelector(".weather").innerText = description;
  container.querySelector(".location span").innerText = `${city}, ${country}`;
  container.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
  container.querySelector(".humidity span").innerText = `${humidity}%`;
}

function fetchingData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  fetch(url)
    .then((response) => response.json())
    .then((result) => showResults(result));
}

function checkImage(id) {
  if (id === 800) {
    imgContainer.src = "svg/clear.svg";
  } else if (id >= 200 && id <= 232) {
    imgContainer.src = "svg/storm.svg";
  } else if (id >= 600 && id <= 622) {
    imgContainer.src = "svg/snow.svg";
  } else if (id >= 701 && id <= 781) {
    imgContainer.src = "svg/haze.svg";
  } else if (id >= 800 && id <= 804) {
    imgContainer.src = "svg/cloud.svg";
  } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
    imgContainer.src = "svg/rain.svg";
  }
}
