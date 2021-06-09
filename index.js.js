const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
var temp="";
var humid="";
var wind="";
var cloud="";
var pressure="";
var feels="";
var riseHour="";
var setHour="";
var riseMin="";
var setMin="";
var riseUnix="";
var setUnix="";
var riseTime="";
var setTime="";
var max= "";
var min= "";
var lon="";
var lat="";

app.set("view engine", "ejs")
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));
var text="";
app.get("/", function(req, res) {
  // res.sendFile(__dirname + "/index.html");
  res.render("search")
});




app.post("/", function(req, res) {
  const city = req.body.city;


  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6cc098a44449cf3468d194cae0f91b47&units=metric"


  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data)

      lon=weatherData.coord.lon;
      lat=weatherData.coord.lat;

   const url2="http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=" + lat + "&lon=" + lon + "&appid=6faf39b1ff0dc598b9787d9c402de452"



     temp = Math.round(weatherData.main.temp);
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
     humid= weatherData.main.humidity;
     wind= weatherData.wind.speed;
     cloud= weatherData.clouds.all;
     pressure=weatherData.main.pressure;
     feels=Math.round(weatherData.main.feels_like);

     riseUnix = weatherData.sys.sunrise;
     setUnix= weatherData.sys.sunset;

     var riseDate = new Date(riseUnix * 1000);
     var setDate = new Date(setUnix * 1000);

     max= Math.floor(weatherData.main.temp_max);
     min= Math.floor(weatherData.main.temp_min);

     riseHour = riseDate.getHours();
     setHour= setDate.getHours();

     riseMin = "0" + riseDate.getMinutes();
    setMin = "0" + setDate.getMinutes();

     riseTime = riseHour + ':' + riseMin.substr(-2);
     setTime = setHour + ':' + setMin.substr(-2);







      const iconUrl = "https:openweathermap.org/img/wn/" + icon + "@2x.png"


      const desc2 = desc.charAt(0).toUpperCase() + desc.slice(1)

      text = city;
      text = text.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

var newico= "icons/" + icon +".svg";

res.render("result",{dispCity:text,dispTemp:temp,dispDesc:desc2,dispIcon:newico,dispHumid:humid,dispWind:wind,dispCloud:cloud,dispPressure:pressure,dispFeels:feels,dispRise:riseTime,dispSet:setTime,dispMin:min,dispMax:max});

      // res.write("<h1>Temperature in " + text + " is " + temp + "&#8451;</h1>");
      // res.write("<h1>" + desc2 + "</h1>");
      // res.write("<img src=" + iconUrl + ">")

// res.send();


});

  });
// res.render("result",{fff:text});


});


app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})
