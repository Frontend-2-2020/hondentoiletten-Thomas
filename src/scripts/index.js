import '../styles/index.scss';

// Import leaflet API
import L from "leaflet";

// Import leaflet css
import "leaflet/dist/leaflet.css";

// NPM Geolib (spelen met coördinaten)
import { getDistance } from 'geolib';


// initialize the map on the "map" div with a given center and zoom
var map = L.map('map', {
    center: [51.0634127,3.7243032],
    zoom: 16
});

// Add layer tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Make new icon
var myIcon = L.icon({
    iconUrl: 'public/marker.png',
    iconSize: [26, 35], // grootte van icon
    iconAnchor: [13, 35],
    popupAnchor: [-3, -76],
});

var closestToiletIcon = L.icon({
  iconUrl: 'public/dog.png',
  iconSize: [26, 35], // grootte van icon
  iconAnchor: [13, 35],
  popupAnchor: [-3, -76],
});

// Import axios
import axios from 'axios';
 
// Make an axios request from Gent Hondenvoorzieningen json
axios.get('https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson')
  .then(function (response) {

    // Make data variable match array of coordinates
    var toiletten = response.data.coordinates;
    // tweede optie
    // var {coordinates} = response.data;
    
    // Positie ophalen vna user
    // navigator.geolocation.getCurrentPosition(setPosition);  
    navigator.geolocation.watchPosition(setPosition);   
    
    // Nieuw array maken van toiletten + distance
    console.log(toiletten);
    toiletten.forEach(element => {
      element.push(getDistance(
        { latitude: userLat, longitude: userLong },
        { latitude: element[1], longitude: element[0]}
      ));
    });
    console.log(toiletten);

    // Toiletten sorteren volgens distance
    toiletten.sort(toiletSorter);

    // For loop to generate all locations in the dataset
    
    // Closest 5 only
    for (let i = 0; i < 5; i++) {
      const location = toiletten[i];

      // Add name to closest toilets
      toiletten[i].push("Plek " + (i+1));

      // Add markers
      L.marker([location[1],location[0]], {icon: closestToiletIcon}).addTo(map);
    }
    // Rest of markers
    for (let i = 5; i < toiletten.length; i++) {
        const location = toiletten[i];
        // Add markers
        L.marker([location[1],location[0]], {icon: myIcon}).addTo(map);
    } 

    const mapList = document.querySelector(".mapList");
    mapList.forEach(element => {
        const mapList_item = document.createElement("li");
        mapList_item.innerHTML = "<h3>" + element[4] + "</h3>";
        mapList.appendChild(mapList_item);
    });


  });

// Ask for geolocation
var userLat = 0;
var userLong = 0;

// Functie om positie te plaatsen op kaart
function setPosition(pos){
  var userLat = pos.coords.latitude;
  var userLong = pos.coords.longitude;
  
  // Second option:
  // const {userLat, userLong} = pos.coords;

  // Add marker of user location
  L.marker([userLat,userLong]).addTo(map);

  // Recenter map to user location
  map.panTo([userLat,userLong]);
};

// Toiletten sorteren
function toiletSorter(a,b){
  if(a[3] > b[3]) { return -1; };
  if(a[3] < b[3]) { return 1; };
  return 0;
}

