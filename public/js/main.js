
// ----------------------------------------------------------------------------
// ----------------------- GOOGLE MAPS API ------------------------------------
// ----------------------------------------------------------------------------
// This example requires the 'drawing' and 'places' libraries. Include them
// 'libraries=places,drawing' when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,drawing">

/*
 * declare map and rectangle as global variables
 */
var map;
var rectangle = null;

function initMap() {
  var latLng = new google.maps.LatLng(43.327001, -3.012916);
  var map = new google.maps.Map(document.getElementById('map'),
  {
    center: latLng,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['rectangle']
    },
    // rectangleOptions: {
    //   fillColor: '#000000',
    //   fillOpacity: 0.3,
    //   strokeWeight: 3,
    //   clickable: true,
    //   editable: true,
    //   zIndex: 1
    // }
  });

  // map.set("disableDoubleClickZoom", true);

  // Search Box
  var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('pac-input'));
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    searchBox.set('map', null);
    var places = searchBox.getPlaces();
    var bounds = new google.maps.LatLngBounds();
    var i, place;
    for (i = 0; place = places[i]; i++) {
      (function(place) {
        var marker = new google.maps.Marker({
          position: place.geometry.location
        });
        marker.bindTo('map', searchBox, 'map');
        google.maps.event.addListener(marker, 'map_changed', function() {
          if (!this.getMap()) {
            this.unbindAll();
          }
        });
        bounds.extend(place.geometry.location);
      }(place));
    }
    map.fitBounds(bounds);
    searchBox.set('map', map);
    map.setZoom(Math.min(map.getZoom(),15));

  });

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  drawingManager.setMap(map);
  google.maps.event.addDomListener(drawingManager, 'overlaycomplete', function(event) {
    if(event.type == google.maps.drawing.OverlayType.RECTANGLE) {
      // any other 'rectangle' on the map is removed
      if(rectangle != null)
        rectangle.setMap(null);
        $('#twitter tbody').empty();

      // obtain 'rectangle' latitude and longitude coordinates:
      rectangle = event.overlay;
      var b = rectangle.getBounds();
      var ne = rectangle.getBounds().getNorthEast();
      var sw = rectangle.getBounds().getSouthWest();
      var bounds = [ sw.lng(), sw.lat(), ne.lng(), ne.lat() ]
      console.log(bounds);
      // alert(bounds);

      // 'bounds' data is sent through socket.io:
      socket.emit('bounds', bounds);
    }
  });

  google.maps.event.addListener(drawingManager, 'drawingmode_changed', function() {
    if(rectangle != null)
      rectangle.setMap(null);
      $('#twitter tbody').empty();
  });
}

// ----------------------------------------------------------------------------
// ----------------------- SOCKET.IO ------------------------------------------
// ----------------------------------------------------------------------------
var socket = io.connect('http://localhost:4200');

socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});

socket.on('data', function(data) {
    data = JSON.parse(data)
    // console.log(data);
    $('#twitter tbody').append('<tr class="child"><td>' + data.screen_name + '</td><td>' + data.message + '</td></tr>');
});

// MAIN FUNCTION
//Attention: there is no need of defining a '$(document).ready' function when
//           using the google maps ASYNC API included in 'index.html' as:
//
// "https://maps.googleapis.com/maps/api/js?key=AIzaSyC9C5eBAOBShzba0cBSkqaDhlddA-WwWak&libraries=places,drawing&callback=initMap" async defer
//
//            If no ASYNC is used '$(document).ready' function is feasible.

// $(document).ready(function () {
//   initMap();
// })
