$(document).ready(function() {

//NavBar
$("nav").find("li").on("click", "a", function () {
    $('.navbar-collapse.in').collapse('hide');
});


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

//submit button
$("#submitButton").on("click", function(){
  event.preventDefault();
  var foodBox = document.getElementById("beerBox").checked;
  var eventsBox = document.getElementById("eventsBox").checked;
  var weatherBox = document.getElementById("weatherBox").checked;
  var beerBox = document.getElementById("beerBox").checked;
  console.log("Beer Box: " + beerBox);
  
  var locationData = {
    zip: $("#zip-input").val().trim(), //"92691",
    isoCode: $(".country").attr("value"), //"US"
};  

  console.log(locationData);

  beerAPI(locationData.zip, beerBox);
  //weatherAPI(locationData.zip, locationData.isoCode);

  
});

//Weather App (Jeanine)
function weatherAPI(zip, isoCode) {
  
  // zip = "92691",
  // isoCode = "US",
  APIKey = "83a97e384d973f3a79b1c419080a0e41",
  queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?zip=" + zip + "," + isoCode + "&units=imperial&cnt=5&appid=" + APIKey;
  + isoCode + "&appid=" + APIKey,
    
    
    

  //call OpenWeatherMap API
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  //store retrieved data in response object
  .done(function(response) {
    
  
        // Log the resulting object
        console.log(response.list[0].temp.min);
        console.log(response.list[0].temp.max);
        console.log(response.list[0].weather.description);

  // Log queryURL
  console.log(queryURL);
  // Log resulting object
  console.log(response);
  });   



};

       


//beer stuff
function beerAPI(zipCode, checked) {

if (checked === true) {
  console.log("inside beerAPI");


 var beer = $('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Breweries</h3>'
              + '</div><div class="panel-body"><div id="breweryTable"></div></div></div>');

 $("#beer").append(beer);


  var beerTable = $("<table>");
  beerTable.addClass("table table-hover");

  var beerTableHeader = $("<thead><tr><th>Logo</th><th>Brewery Name</th><th>Phone Number</th><th>Address</th></tr></thead>");
  beerTable.append(beerTableHeader);

  //Beer API (Nick)


  $.getJSON('https://cors-anywhere.herokuapp.com/' + ('https://api.brewerydb.com/v2/locations?key=cead0935bcae01ba063baf6bfb4b5988&postalCode=' + zipCode)
    , function(response){
    console.log(response.contents);

 // var beerTableContent;

  var beerTableContent = '<tbody><td><img width="auto" height="auto" src="' 
                          + response.data[0].brewery.images.icon + '"' 
                          + ' /></td><td>' + response.data[0].brewery.name
                          + '</td><td>' + response.data[0].phone + '</td><td>'
                          + response.data[0].streetAddress + ", " 
                          + response.data[0].name + ", " 
                          + response.data[0].region + " " 
                          + response.data[0].postalCode + '</td></tbody>';

  //beerTableContent.attr("id", "breweryTableContent");

  beerTable.append(beerTableContent)

  });
};
console.log(beerTable)
$("#breweryTable").html(beerTable);
};

});



      