const weather = {};
const stad = "Amsterdam"
const fetch = require("node-fetch");
var n;
var tijd;
var done = false;
const TeleBot = require('telebot');

const bot = new TeleBot({
    token: 'API KEY' 
});

function update(){
  fetch('http://api.openweathermap.org/data/2.5/find?q=' + stad + '&units=metric&appid=API_KEY')
  .then(response => response.json())
  .then(data => {
      weather.temp = Math.round(data.list[0].main.temp)
      weather.name = data.list[0].name
      weather.winddeg = data.list[1].wind.deg
      weather.windspeed = data.list[0].wind.speed
      weather.regen = data.rain
      weather.sneeuw = data.snow
      weather.beschrijving = data.list[0].weather[0].icon
      
  });
}
update()

setInterval(() => {
  update()
}, 100000);

function time(){
  var d = new Date();
  var n = d.getHours();
  return n
}

function groet(){
  n = time()
  if (n >= 0 && n < 6){
    return("Goede nacht ");
  }if (n >= 6 && n < 12){
    return("Goede ochtend ");
  }if (n >= 12 && n < 18){
    return("Goede middag ");
  }if (n >= 18 && n < 24){
    return("Goede avond ");
  }
}

function icon(){
  if (weather.beschrijving == "01d"){
    return(" ☀")
  }if (weather.beschrijving == "02d"){
    return(" ⛅")
  }if (weather.beschrijving == "03d"){
    return(" ☁")
  }if (weather.beschrijving == "04d"){
    return(" ☁")
  }if (weather.beschrijving == "09d"){
    return(" 🌧‍️")
  }if (weather.beschrijving == "10d"){
    return(" 🌦‍️")
  }if (weather.beschrijving == "11d"){
    return(" 🌩")
  }if (weather.beschrijving == "13d"){
    return(" 🌨‍️")
  }if (weather.beschrijving == "50d"){
    return(" 🌫‍️")
  }
}

function windrichting(){
  if (weather.winddeg > 270 && weather.winddeg < 0){
    return(" tegen wind naar school. ")
  }if (weather.deg > 90 && weather.winddeg < 180){
    return(" wind mee naar school! ")
  }else{
    return(" de wind van zij. ")
  }
 
}

//m/s naar km/h
function wind(){
  windkracht = 0
  km_windsnelheid = weather.windspeed * 3.6
  console.log(km_windsnelheid)
  wortel_windsnelheid = Math.sqrt(km_windsnelheid)
  if (wortel_windsnelheid <= 7){
    windkracht = Math.round(wortel_windsnelheid - 1)
    return(windkracht)
   }if (wortel_windsnelheid >= 10){
    windkracht = Math.round(wortel_windsnelheid + 1)
    return(windkracht)
  }
}

function regen() {
  if (weather.regen == null){
    return("niet.");
  }else{
    return(".")
  }
}

function sneeuw() {
  if (weather.sneeuw == null){
    return("niet.");
  }else{
    return(".")
  }
}



function send_message(msg){
  bot.sendMessage(msg.from.id, groet() + msg.from.first_name + "!" + " Het is vandaag " + String(weather.temp) + " graden celsius in " + String(weather.name) + ". Je hebt" + windrichting() + "De wind kracht is " + wind() + ". ");
  setTimeout(function() {
    bot.sendMessage(msg.from.id, icon());
  }, 100)
  
}

bot.on('/update', function (msg) {
  console.log(msg.from.id)
  send_message(msg)
});

bot.on('/verander', function (msg) {
  console.log(msg.from.id)
  verander(msg.from.id)
});

bot.on('/foto', (msg) => {
  return bot.sendPhoto(msg.from.id, "http://openweathermap.org/img/wn/" + weather.beschrijving + "@2x.png");
});

bot.on('/regen', function (msg) {
  console.log(msg.from.id)
  return bot.sendMessage(msg.from.id, groet() + msg.from.first_name + "!" + " Het regent mometeel " + regen());
});

bot.on('/wind', function (msg) {
  console.log(msg.from.id)
  return bot.sendMessage(msg.from.id, groet() + msg.from.first_name + "!" + " Je hebt" + windrichting() + "De wind kracht is " + wind() + ". ");
});

bot.on('/temp', function (msg) {
  console.log(msg.from.id)
  return bot.sendMessage(msg.from.id, groet() + msg.from.first_name + "!" + " Het is vandaag " + String(weather.temp) + " graden celsius in " + String(weather.name) + ". ");
});

bot.on('/pos', function (msg) {
  console.log(msg.from.id)
  return bot.sendMessage(msg.from.id, groet() + msg.from.first_name + "!" + " Je bekijkt het weer in " + String(weather.name) );
});

bot.on('/sneeuw', function (msg) {
  console.log(msg.from.id)
  return bot.sendMessage(msg.from.id, groet() + msg.from.first_name + "!" + " Het sneeuwt mometeel " + sneeuw());
});

bot.on('/icon', function (msg) {
  console.log(msg.from.id)
  return bot.sendMessage(msg.from.id, icon());
});



bot.on(['/start', '/help'], function (msg) {
  // console.log(msg.from.id + "help")
  return bot.sendMessage(msg.from.id, groet() + msg.from.first_name + "! Hier volgen de verschillende comando's:" + "\n" + "\n" + "Gebruik /help voor hulp." + "\n" + "Gebruik /update voor een algemene weer update." + "\n" + "Gebruik /regen  voor info over regen. " + "\n" + "Gebruik /wind voor info over wind." + 
"\n" + "Gebruik /temp voor info over temratuur." + "\n" + "Gebruik /pos voor info over positie." + "\n" + "Gebruik /sneeuw voor info over sneeuw." + "\n" + "Gebruik /icon voor het weer.");
});


bot.start();

