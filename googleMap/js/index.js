var map;
var markers = [];
var infoWindow;
function initMap() {
  var losAngeles = {
    lat: 34.06338,
    lng: -118.35808,
  };

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.06338, lng: -118.35808 },
    zoom: 8,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "rgb(51, 218, 115)" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "rgb(51, 218, 115)" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });

  infoWindow = new google.maps.InfoWindow(); //we defined the info window at the top global scope
  searchStores();
  setOnClickListener();
}

function searchStores() {
  var foundStores = [];
  var zipCode = document.getElementById("zip-code-input").value;
  if (zipCode) {
    stores.forEach(function (store) {
      var postal = store.address.postalCode.substring(0, 5);
      if (postal == zipCode) {
        foundStores.push(store);
      }
    });
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);
  showStoreMarkers(foundStores);
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener() {
  var storeElements = document.querySelectorAll(".store-container");
  storeElements.forEach(function (elem, index) {
    elem.addEventListener("click", function () {
      google.maps.event.trigger(markers[index], "click");
    });
  });
}

function displayStores(stores) {
  var storesHtml = "";
  stores.forEach(function (store, index) {
    var address = store.addressLines;
    var phone = store.phoneNumber;
    storesHtml += `
    <div class="store-container">
      <div class="store-info-container">
        <div class="store-address">
          <address>${address[0]}</address>
          <address>${address[1]}</address>
        </div>
        <div class="store-phone-number">
          <p>
            <i class="fas fa-phone-volume">&ThickSpace;</i>Phone: ${phone}
          </p>
        </div>
      </div>

      <div class="store-number-container">
        <div class="store-number">${index + 1}</div>
      </div>
    </div>`;
  });

  document.querySelector(".stores-list").innerHTML = storesHtml;
}

//////////////////Showing the markers////////////////////////
function showStoreMarkers(stores) {
  var bounds = new google.maps.LatLngBounds();
  stores.forEach(function (store, index) {
    var latlng = new google.maps.LatLng( //to spread the markers
      store.coordinates.latitude,
      store.coordinates.longitude
    );
    console.log(latlng);
    var name = store.name;
    var address = store.addressLines[0]; //we only get the first part of the address
    var openStatus = store.openStatusText;
    var phoneNumber = store.phoneNumber;
    bounds.extend(latlng); //for extending the bound if any markers are outside
    //of the bound to fit it!
    createMarker(latlng, name, address, openStatus, phoneNumber, index);
  });
  map.fitBounds(bounds); // to spread the markers
}

///////////////////Creating Markers here for google maps////////////////
function createMarker(latlng, name, address, openStatus, phoneNumber, index) {
  var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatus} 
            </div>
            <div class="store-info-address">
            <div class="circle">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <!--Next line will help us to show the destionation on the exact google map-->
            <a style="color:rgb(218, 218, 218);" href="https://www.google.com/maps/dir/?api=1&destination=${address}" target="_blank">
                ${address}
                </a>
            </div>
            <div class="store-info-phone">
                <div class="circle">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                    ${phoneNumber} 
            </div>
        </div>
    `;

  //////////////////////////icon variable creation and  addition////////////////////////////
  var coffeeMarker = {
    url: "https://image.flaticon.com/icons/svg/808/808866.svg",
    size: new google.maps.Size(60, 60),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(50, 50),
  };

  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    icon: coffeeMarker,
    animation: google.maps.Animation.DROP,
    label: `${index + 1}`,
  });
  ////////toogle bounce animation section////////////
  marker.addListener("click", toggleBounce);
  function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){ marker.setAnimation(null); }, 1000);
    }
  }
  ////////////////////////////////////////////////////7
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}
///////////////////////////////Sound effects on hover//////////////////////////////

function playSound(soundObj) {
  var thisSound = document.getElementById(soundObj);
  thisSound.play();
}

function stopSound(soundObj) {
  var thisSound = document.getElementById(soundObj);
  thisSound.pause();
  thisSound.currentTime = 0;
}
