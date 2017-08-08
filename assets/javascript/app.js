$(document).ready(function() {




// Initialize Firebase
var config = {
    apiKey: "AIzaSyBeOFAweBtSqKpoKdQZpEDtNVjXJeH5rOw",
    authDomain: "livelocal-1f386.firebaseapp.com",
    databaseURL: "https://livelocal-1f386.firebaseio.com",
    projectId: "livelocal-1f386",
    storageBucket: "",
    messagingSenderId: "185892349757"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

});

//Weather App
var zip = "92691";
var isoCode = "US";
var APIKey = "83a97e384d973f3a79b1c419080a0e41";
var queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=" + zip + "," + isoCode + "&units=imperial&cnt=5&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
      })
      // We store all of the retrieved data inside of an object called "response"
      .done(function(response) {

        // Log the queryURL
        console.log(queryURL);

        // Log the resulting object
        console.log(response.list[0].temp.min);
        console.log(response.list[0].temp.max);
        console.log(response.list[0].weather.description);

   });          