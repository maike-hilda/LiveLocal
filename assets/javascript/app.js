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

  var locationData; //for global access

  //submit button
  $("#submitButton").on("click", function(){
    event.preventDefault();
    var foodBox = document.getElementById("beerBox").checked;
    var eventsBox = document.getElementById("eventsBox").checked;
    var weatherBox = document.getElementById("weatherBox").checked;
    var beerBox = document.getElementById("beerBox").checked;
    
    locationData = {

    zip: $("#zip-input").val().trim(), //"92691",
    //city: ,
    isoCode: $("#countries").val(), 
    //len: ,
    //lat: ,
    };  

    console.log(locationData);

    // locationData = Object.assign({},locationData,zipCodeAPI(locationData.zip, locationData.isoCode));

    // console.log(locationData); 

    // weatherData = zipCodeAPI(locationData.zip, locationData.isoCode);

    // console.log(weatherData);

    zipCodeAPI(locationData.zip, locationData.isoCode);
  
    beerAPI(locationData.zip, beerBox);

    foodAPI(locationData.zip, foodBox);
  
    weatherAPI(locationData.zip, locationData.isoCode, weatherBox);

  });


  function zipCodeAPI(zipCode, isoCode) {
    //zipcode API Call, getting long and lat from zipcode
    $.getJSON('https://cors-anywhere.herokuapp.com/' 
    + ('https://www.zipcodeapi.com/rest/7c8osAOLPeY94rdTAYZIARGO66qjzzBHLK6ekV0aaZjeqx80v8J6ZqU5wlo6U0OG/info.json/' 
    + zipCode + '/degrees'), function(response){
      console.log(response);
      locationData = Object.assign({},locationData, {lat: response.lat, lng: response.lng, city: response.city} );
      latFromZip = response.lat;
      lonFromZip = response.lng;
      //return { lat: response.lat, lng: response.lng };    
      console.log(locationData);
      console.log("lat: " + latFromZip);
      console.log("long: " + lonFromZip);
    });

  };



  function weatherAPI(zipCode, isoCode, checked) {

    if (checked === true) {  

      var weather = $('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Weather</h3>'
              + '</div><div class="panel-body"><div id="weatherTable"></div></div></div>');

      $("#weather").html(weather);

      var weatherTable = $("<table>");
      weatherTable.addClass("table table-hover");

      var weatherTableHeader = $("<thead><tr><th>City</th><th>Temperature</th><th>Humidity</th><th>Wind</th></tr></thead>");
      weatherTable.append(weatherTableHeader);
      //openweathermap API Call
      $.getJSON('https://cors-anywhere.herokuapp.com/' 
        + ('http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + zipCode + ',' 
        + isoCode + '&units=imperial&appid=83a97e384d973f3a79b1c419080a0e41&cnt=5' ), function(responseWeather){
        console.log(responseWeather);
        var oneDayTempCity = responseWeather.city.name;
        var oneDayTempDay = responseWeather.list[0].temp.day;
        var oneDayTempMax = responseWeather.list[0].temp.max;
        var oneDayTempMin = responseWeather.list[0].temp.min;
        var oneDayTempNight = responseWeather.list[0].temp.night;
        var oneDayHumidity = responseWeather.list[0].humidity;
        var oneDayWind = responseWeather.list[0].speed;
        var oneDayIcon = "http://openweathermap.org/img/w/" + responseWeather.list[0].weather[0].icon + ".png";
        console.log(oneDayIcon);

        // $("#weatherTable > tbody").append("<tr><td>" + oneDayTempCity + "<img src='" + oneDayIcon + "'/></td>" + "<td>" + oneDayTempDay + "&deg; ( High: " + oneDayTempMax +"&deg; / Low: " + oneDayTempMin + "&deg; ) </td>" + "<td>" 
        //   + oneDayHumidity + "% </td>" + "<td>" + oneDayWind + " MPH</td>" + "</tr>");
  
        //$("#breweryTable > tbody").append("<tr><td>" + breweryIcons + "</td>" + "<td>" + breweryNames + "</td>" + "<td>" + breweryPhones + "</td>" + "<td>" + breweryAddresses + "</td>" + "<td class='hide'>" + breweryLong + "</td>" + "<td class='hide'>" + breweryLat + "</td>" +"</tr>");
  
        var weatherTableContent = '<tbody><td>' + oneDayTempCity + '<img src="' + oneDayIcon + '"/></td><td>' + + oneDayTempDay + "&deg; ( High: " + oneDayTempMax +"&deg; / Low: " + oneDayTempMin + '&deg; ) </td><td>' 
              + oneDayHumidity + '% </td><td>' + oneDayWind + " MPH</td>" + '</td></tbody>';

        weatherTable.append(weatherTableContent)
        var newForecast = {
          dayOneTempDuringDay:  oneDayTempDay,
          dayOneTempMax: oneDayTempMax,
          dayOneTempMin: oneDayTempMin,
          dayOneTempDuringNight: oneDayTempNight,
          dayOneHumidity: oneDayHumidity,
          dayOneWind: oneDayWind,
          dayOneIcon: oneDayIcon
        }

        database.ref().push(newForecast);

      });

      console.log(weatherTable)
      $("#weatherTable").html(weatherTable);

    };

  };

  //beer stuff
  function beerAPI(zipCode, checked) {

    if (checked === true) {
      console.log("inside beerAPI");
      var beer = $('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Breweries</h3>'
              + '</div><div class="panel-body"><div id="breweryTable"></div></div></div>');

      $("#beer").html(beer);

      var beerTable = $("<table>");
      beerTable.addClass("table table-hover");

      var beerTableHeader = $("<thead><tr><th>Logo</th><th>Brewery Name</th><th>Phone Number</th><th>Address</th></tr></thead>");
      beerTable.append(beerTableHeader);

      //Beer API (Nick)
      $.getJSON('https://cors-anywhere.herokuapp.com/' + ('https://api.brewerydb.com/v2/locations?key=cead0935bcae01ba063baf6bfb4b5988&postalCode=' + zipCode), function(response){
        console.log(response);
        
        if (response.hasOwnProperty('totalResults')){

          var amountOfBreweries = response.data.length;

          for (var i = 0; i < amountOfBreweries; i++) {

          if (response.data[i].longitude === "undefined" || response.data[i].longitude === null) {
            breweryLong = '';
          }
          else {
            var breweryLong = response.data[i].longitude;
          }
          
          if (response.data[i].latitude === "undefined" || response.data[i].longitude === null) {
            breweryLat = '';
          }
          else {
            var breweryLat = response.data[i].latitude;
          }
          //var breweryLatLong = "{lat:" + breweryLat + "," + "lng:" + breweryLong + "}"
          //var breweryHours = response.data[i].hoursOfOperation;
            var breweryIcons = '<a data-toggle="tooltip" data-placement="top" title="' 
            //+ breweryHours 
            //+ '" href="' + response.data[i].website 
            +'">' 
            + '<img width="auto" height="auto" src="' + response.data[i].brewery.images.icon 
            + '"' + ' /></a>';
            var breweryNames = '<a data-toggle="tooltip" data-placement="top" title="' //+ breweryHours 
              + '" href="' + response.data[i].website +'">' + response.data[i].brewery.name + '</a>';
            //var breweryWebsite = '<a href="' + response.contents.data[i].website +'">' + response.contents.data[i].brewery.name + '</a>';
            var breweryPhones = response.data[i].phone;
            var breweryAddresses = response.data[i].streetAddress + ", " + response.data[i].locality + ", " 
              + response.data[i].region + " " + response.data[i].postalCode;
      
            // if (breweryHours === undefined) {
            //   breweryHours = ''
            // }
            // Local temporary object holding brewery data
            var newBrewery = {
              name:  breweryNames,
              //location: breweryLatLong,
              //hours: breweryHours,
              icon: breweryIcons,
              phone: breweryPhones,
              address: breweryAddresses
            };
            console.log(newBrewery);
            // Uploads brewery data to the database
            database.ref().push(newBrewery);
            //$("#breweryTable > tbody").append("<tr><td>" + breweryIcons + "</td>" + "<td>" + breweryNames + "</td>" + "<td>" + breweryPhones + "</td>" + "<td>" + breweryAddresses + "</td>" + "<td class='hide'>" + breweryLong + "</td>" + "<td class='hide'>" + breweryLat + "</td>" +"</tr>");
          
            var beerTableContent = '<tbody><td>' + breweryIcons + '</td><td>' + breweryNames
                            + '</td><td>' + breweryPhones + '</td><td>'
                            + breweryAddresses + '</td></tbody>';

            beerTable.append(beerTableContent);

          }
        }
        else {
          beerTable.append("<tbody><td>No breweries in this area. Try another zip code. </td></tbody>");
        }

        // var beerTableContent = '<tbody><td><img width="auto" height="auto" src="' 
        //                       + response.data[0].brewery.images.icon + '"' 
        //                       + ' /></td><td>' + response.data[0].brewery.name
        //                       + '</td><td>' + response.data[0].phone + '</td><td>'
        //                       + response.data[0].streetAddress + ", " 
        //                       + response.data[0].name + ", " 
        //                       + response.data[0].region + " " 
        //                       + response.data[0].postalCode + '</td></tbody>';

        // //beerTableContent.attr("id", "breweryTableContent");

        // beerTable.append(beerTableContent)

      });
    };

    console.log(beerTable)
    $("#breweryTable").html(beerTable);
  };


function foodAPI(zipCode, checked) {

    if (checked === true) {
      
      console.log("inside foodAPI");
      var food = $('<div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">Food</h3>'
              + '</div><div class="panel-body"><div id="foodTable"></div></div></div>');

      $("#food").html(food);

      var foodTable = $("<table>");
      foodTable.addClass("table table-hover");

      var foodTableHeader = $("<thead><tr><th>Logo</th><th>Name of Establishment</th><th>Phone Number</th><th>Address</th></tr></thead>");
      foodTable.append(foodTableHeader);


      var yelpSettings = {
        "async": true,
        "crossDomain": true,
        "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" + zipCode,
        "method": "GET",
        "headers": {
        "authorization": "Bearer 8OuUJR-QLND67vEyh8486vuUdhCg1r1IhznI1APTqBej4UAifmROjMrw2CBMnEgUMKHk5-6Ln5rCJ59DE0--la2JjRPQxpcyAsC-VujIK6IOeIbuvl9089KC0ad_WXYx",
        "cache-control": "no-cache",
        "postman-token": "c6b3fdba-dd4b-d7a6-81db-6431f96e23ee"
        }
      };


      $.ajax(yelpSettings).done(function (responseYelp) {
        console.log(responseYelp);
        for (var i = 0; i < 10; i++) {
        var yelpLong = responseYelp.businesses[i].coordinates.longitude;
        if (yelpLong === undefined) {
          yelpLong = '';
        }
        var yelpLat = responseYelp.businesses[i].coordinates.latitude;
        if (yelpLat === undefined) {
          yelpLat = '';
        }
        var yelpLatLong = "{lat:" + yelpLat + "," + "lng:" + yelpLong + "}"
        var yelpName = "<a href='" + responseYelp.businesses[i].url + "'>" + responseYelp.businesses[i].name + "</a>";
        var yelpAddress = responseYelp.businesses[i].location.display_address;
        var yelpPhone = responseYelp.businesses[i].display_phone;
        var yelpIcon = "<img height='60px' width='auto' src='" + responseYelp.businesses[i].image_url + "' />";
        
        // $("#restaurantTable > tbody").append("<tr><td>" 
        //     + yelpIcon + "</td>" + "<td>" + yelpName + "</td>" 
        //     + "<td>" + yelpPhone + "</td>" + "<td>" + yelpAddress + "</td>" 
        //     + "<td class='hide'>" + yelpLong + "</td>" + "<td class='hide'>" + yelpLat + "</td>" +"</tr>");
        // }

        // console.log(newFood);
        // // Uploads brewery data to the database
        // database.ref().push(newBrewery);
        // //$("#breweryTable > tbody").append("<tr><td>" + breweryIcons + "</td>" + "<td>" + breweryNames + "</td>" + "<td>" + breweryPhones + "</td>" + "<td>" + breweryAddresses + "</td>" + "<td class='hide'>" + breweryLong + "</td>" + "<td class='hide'>" + breweryLat + "</td>" +"</tr>");
        
        var foodTableContent = '<tbody><td>' + yelpIcon + '</td><td>' + yelpName
                        + '</td><td>' + yelpPhone + '</td><td>'
                        + yelpAddress + '</td></tbody>';

        foodTable.append(foodTableContent);

        }
      });
        console.log(foodTable)
      $("#foodTable").html(foodTable);
    }; //close if

  }; //close foodAPI


// songkickAPI
$.getJSON("http://api.songkick.com/api/3.0/events.json?&location=clientip&apikey=5LOMbZ6HSzTdcX4e&jsoncallback=?",function(data) {

console.log(data.resultsPage.results);

for (var i = 0; i < 10; i++) {
  console.log(data.resultsPage.results.event[i].displayName);
  var tr = $('<tr/>');
  $(tr).append("<td>" + "<a href=" + data.resultsPage.results.event[i].uri + ">" + data.resultsPage.results.event[i].displayName + "</a>" + "</td>");
  $(tr).append("<td>" + data.resultsPage.results.event[i].location.city + "</td>");
  $('.table1').append(tr); 
 }

});// close songkickAPI

});
