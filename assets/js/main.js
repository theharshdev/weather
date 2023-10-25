$(".lightToggle").click(function () {
   document.cookie = "lightMode = lightMode-On; max-age=" + 60 * 60 * 24 * 120;
   document.cookie = "darkMode = ";
   $("html").removeClass("dark");
   $(".lightToggle").hide();
   $(".darkToggle").show();
});

$(".darkToggle").click(function () {
   document.cookie = "darkMode = darkMode-On; max-age=" + 60 * 60 * 24 * 120;
   document.cookie = "lightMode = ";
   $("html").addClass("dark");
   $(".lightToggle").show();
   $(".darkToggle").hide();
});

window.addEventListener("load", () => {
   if (document.cookie.includes("lightMode-On")) {
      $("html").removeClass("dark");
      $(".lightToggle").hide();
      $(".darkToggle").show();
   }
   if (document.cookie.includes("darkMode-On")) {
      $("html").addClass("dark");
      $(".lightToggle").show();
      $(".darkToggle").hide();
   }

   // API for accessing the current city of the user ---------------------
   navigator.geolocation.getCurrentPosition((position) => {
      getLocation(position.coords.latitude, position.coords.longitude);
      async function getLocation(lat, long) {
         const locationApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}`;
         const locationResponse = await fetch(locationApiUrl);
         try {
            if (locationResponse.ok) {
               const locationData = await locationResponse.json();
               getWeather(locationData.city);
            } else {
            }
         } catch (error) {
            console.log("Geo location API not working", error);
         }
      }
   });
});

$(".openMenu").click(() => {
   $(".menuBar").slideToggle(300);
   $(".rotateArrow").toggleClass("rotate-180");
});

// API for weather starts here -----------
async function getWeather(city) {
   const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" + `${city}`;
   const apiKey = "614f2a0ff4f356ae28e7460630bf637d";
   const response = await fetch(apiUrl + `&appid=${apiKey}`);
   try {
      if (response.ok) {
         const data = await response.json();
         $("#cityName").html(data.name);
         $("#temperature").html(data.main.temp);
         $("#humidity").html(data.main.humidity);
         $("#maxTemp").html(data.main.temp_max);
         $("#minTemp").html(data.main.temp_min);
         $("#feelsLike").html(data.main.feels_like);
         $("#weatherCondition, #weatherConditionForIcon").html(data.weather[0].main);
         $("#windSpeed").html(data.wind.speed);
         $("#windDegree").html(data.wind.deg);
         let windDirection = data.wind.deg;
         if (windDirection === 0 || windDirection === 360) {
            $("#windDirec").html("North");
         }
         if (windDirection === 90) {
            $("#windDirec").html("East");
         }
         if (windDirection === 180) {
            $("#windDirec").html("South");
         }
         if (windDirection === 270) {
            $("#windDirec").html("North");
         }
         if (windDirection > 0 && windDirection < 90) {
            $("#windDirec").html("North-East");
         }
         if (windDirection > 90 && windDirection < 180) {
            $("#windDirec").html("South-East");
         }
         if (windDirection > 180 && windDirection < 270) {
            $("#windDirec").html("South-West");
         }
         if (windDirection > 270 && windDirection < 360) {
            $("#windDirec").html("North-West");
         }
         const dataWeatherIcon = data.weather[0].icon.slice(0, -1);
         $("#weatherIcons").html(
            `<img src="https://openweathermap.org/img/wn/${dataWeatherIcon}d@2x.png" alt="weather icon" />`
         );
         $("#errorAlert").html("");
         const sunriseUnix = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
         const sunsetUnix = new Date(data.sys.sunset * 1000).toLocaleTimeString();
         $("#sunriseTime").html(sunriseUnix);
         $("#sunsetTime").html(sunsetUnix);
      } else {
         if ($("#searchInputFeild").val() == "") {
            $("#errorAlert").html("Please enter any city or state name!");
            $("#cityName").html("Nothing");
            $(
               "#temperature, #humidity, #maxTemp, #minTemp, #feelsLike, #weatherCondition, #windSpeed, #windDegree, #windDirec"
            ).html("0");
         } else {
            $("#errorAlert").html("No record found, Please enter a valid value!");
            $("#cityName").html($("#searchInputFeild").val());
            $(
               "#temperature, #humidity, #maxTemp, #minTemp, #feelsLike, #weatherCondition, #windSpeed, #windDegree, #windDirec"
            ).html("0");
         }
      }
   } catch (error) {
      console.log("Code not working", error);
   }
}

$("#searchBtn").click(() => {
   if ($("#searchInputFeild").val() == "") {
      $("#errorAlert").html("Please enter any city or state name!");
      $("#cityName").html("Nothing");
      $(
         "#temperature, #humidity, #maxTemp, #minTemp, #feelsLike, #weatherCondition, #windSpeed, #windDegree, #windDirec"
      ).html("0");
   } else {
      getWeather($("#searchInputFeild").val());
   }
});

$("#searchInputFeild").keypress(function (event) {
   if (event.keyCode === 13) {
      getWeather($("#searchInputFeild").val());
   }
});

// API call for Common Cities -------------------
window.addEventListener("load", () => {
   const commonWeatherIcon = document.getElementsByClassName("commonWeatherIcon");
   const commonCitiesName = document.getElementsByClassName("commonCitiesName");
   const commonTemperature = document.getElementsByClassName("commonTemperature");
   const commonMinTemp = document.getElementsByClassName("commonMinTemp");
   const commonMaxTemp = document.getElementsByClassName("commonMaxTemp");
   const commonHumidity = document.getElementsByClassName("commonHumidity");
   const commonWindSpeed = document.getElementsByClassName("commonWindSpeed");
   const commonWindDirection = document.getElementsByClassName("commonWindDirection");
   const commonSunrise = document.getElementsByClassName("commonSunrise");
   const commonSunset = document.getElementsByClassName("commonSunset");

   for (i = 0; i < commonCitiesName.length; i++) {
      const commonCityName = commonCitiesName[i].innerText;
      const cWeatherIcon = commonWeatherIcon[i];
      const commonTemp = commonTemperature[i];
      const cMinTemp = commonMinTemp[i];
      const cMaxTemp = commonMaxTemp[i];
      const cHumidity = commonHumidity[i];
      const cWindSpeed = commonWindSpeed[i];
      const cWindDirec = commonWindDirection[i];
      const cSunrise = commonSunrise[i];
      const cSunset = commonSunset[i];
      getWeather2(commonCityName);
      async function getWeather2(city) {
         const apiUrl2 = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=" + `${city}`;
         const apiKey2 = "614f2a0ff4f356ae28e7460630bf637d";
         const response2 = await fetch(apiUrl2 + `&appid=${apiKey2}`);
         try {
            if (response2.ok) {
               const data2 = await response2.json();
               commonTemp.innerHTML = data2.main.temp + " °C";
               cMinTemp.innerHTML = data2.main.temp_min + " °C";
               cMaxTemp.innerHTML = data2.main.temp_max + " °C";
               cHumidity.innerHTML = data2.main.humidity + "%";
               cWindSpeed.innerHTML = data2.wind.speed + " Km/h";
               const dataWeatherIcon2 = data2.weather[0].icon.slice(0, -1);
               cWeatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${dataWeatherIcon2}d.png" alt="weather icon" /><p class="text-xs">${data2.weather[0].main}</p>`;
               let windDirection2 = data2.wind.deg;
               if (windDirection2 === 0 || windDirection2 === 360) {
                  cWindDirec.innerHTML = "North";
               }
               if (windDirection2 === 90) {
                  cWindDirec.innerHTML = "East";
               }
               if (windDirection2 === 180) {
                  cWindDirec.innerHTML = "South";
               }
               if (windDirection2 === 270) {
                  cWindDirec.innerHTML = "West";
               }
               if (windDirection2 > 0 && windDirection2 < 90) {
                  cWindDirec.innerHTML = "North-East";
               }
               if (windDirection2 > 90 && windDirection2 < 180) {
                  cWindDirec.innerHTML = "South-East";
               }
               if (windDirection2 > 180 && windDirection2 < 270) {
                  cWindDirec.innerHTML = "South-West";
               }
               if (windDirection2 > 270 && windDirection2 < 360) {
                  cWindDirec.innerHTML = "North-West";
               }
               const sunriseUnix2 = new Date(data2.sys.sunrise * 1000).toLocaleTimeString();
               const sunsetUnix2 = new Date(data2.sys.sunset * 1000).toLocaleTimeString();
               cSunrise.innerHTML = sunriseUnix2;
               cSunset.innerHTML = sunsetUnix2;
            }
         } catch (error) {
            console.log("Code not working", error);
         }
      }
   }
});
