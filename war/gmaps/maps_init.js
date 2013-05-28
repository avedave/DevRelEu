  var geocoder;
  var map;

  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(50.08, 19.94),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);
    geocoder = new google.maps.Geocoder();
  }
  
  //Make sure your API key for localhost does not contain an ampersand '&'
  var apiKey = 'AIzaSyBMA1DpBRPN6oYen_wFJaSiK14_5-TAnsI';
  var apiKeyIndex = location.search.indexOf('apiKey=');
  if (apiKeyIndex > -1) {
	  var index1 = apiKeyIndex + 7;
      var index2 = location.search.substr(index1).indexOf('&');
      if (index2 > -1) {
    	  apiKey = location.search.substr(index1, index2);  
      } else {
    	  apiKey = location.search.substr(index1);
      }  
  }
  
  function loadScript() {
	  var script = document.createElement("script");
	  script.type = "text/javascript";
	  script.src = "http://maps.googleapis.com/maps/api/js?key=" + apiKey + "&sensor=true&callback=initialize";
	  document.body.appendChild(script);
	}

	window.onload = loadScript;