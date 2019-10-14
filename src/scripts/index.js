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
    iconUrl: 'public/dog_red.png',
    iconSize: [26, 35], // grootte van icon
    iconAnchor: [13, 35],
    popupAnchor: [-3, -76],
});

var closestToiletIcon = L.icon({
  iconUrl: 'public/dog_green.png',
  iconSize: [26, 35], // grootte van icon
  iconAnchor: [13, 35],
  popupAnchor: [-3, -76],
});

// Import axios
import axios from 'axios';
 
// Ask for geolocation
let userLat = 0;
let userLong = 0;

// Positie ophalen vna user
// navigator.geolocation.getCurrentPosition(setPosition);  
navigator.geolocation.getCurrentPosition(setPosition);  

// Make an axios request from Gent Hondenvoorzieningen json
axios.get('https://datatank.stad.gent/4/infrastructuur/hondenvoorzieningen.geojson')
  .then(function (response) {

    // Make data variable match array of coordinates
    var toiletten = response.data.coordinates;
    // tweede optie
    // var {coordinates} = response.data;
    
    calcDistance(toiletten);

    // Toiletten sorteren volgens distance
    toiletten.sort(toiletSorter);

    // For loop to generate all locations in the dataset
    renderClosestToilets(toiletten);
    
    // Render rest of toilets
    renderOtherMarkers(toiletten);

    // Render mapList
    renderMapList(toiletten);


  });

var distance;
function calcDistance(toiletten) {
  // Nieuw array maken van toiletten + distance
  if (toiletten && userLat) {
    
    toiletten.forEach(element => {
      distance = getDistance(
        { latitude: userLat, longitude: userLong },
        { latitude: element[1], longitude: element[0]}
      );

      element.push(distance/1000);
    });
  };
  console.log(toiletten);
}

// Functie om positie te plaatsen op kaart
function setPosition(pos){
  userLat = pos.coords.latitude;
  userLong = pos.coords.longitude;
  
  // Second option:
  // const {userLat, userLong} = pos.coords;

  // Add marker of user location
  L.marker([userLat,userLong]).addTo(map);

  // Recenter map to user location
  map.panTo([userLat,userLong]);
};

// Toiletten sorteren
function toiletSorter(a,b){
  if(a[2] > b[2]) { return 1; };
  if(a[2] < b[2]) { return -1; };
  return 0;
};

let location;
let mapList = document.querySelector("#mapList");

// Render closest 5 toilets
function renderClosestToilets(toiletten){
  for (let i = 0; i < 5; i++) {
    location = toiletten[i];
  
    // Add name to closest toilets
    toiletten[i].push(i+1);
  
    // Add markers
    L.marker([location[1],location[0]], {icon: closestToiletIcon}).addTo(map);

    // Render mapList
    let mapListItem = document.createElement("li");
    mapListItem.innerHTML = `
      <h4>Plek ${location[3]}</h4>
      <small>op ${location[2]} km afstand</small>
    `;
    mapListItem.setAttribute("id", `toilet${location[3]}`);
    mapListItem.setAttribute("class", "toilet");

    mapListItem.addEventListener("mouseover", changeMarker);

    mapList.appendChild(mapListItem);
  };
};

function renderOtherMarkers(toiletten){
  // Render Rest of markers
  for (let i = 0; i < toiletten.length; i++) {
      var currentToilet = toiletten[i];
      if(!currentToilet[3]) {
        // Add markers
        L.marker([currentToilet[1],currentToilet[0]], {icon: myIcon}).addTo(map);

      }
      
  }; 
}

function renderMapList(toiletten){
  
  for (let i = 0; i < toiletten[5]; i++) {
    
  };
}


function changeMarker(e) {
    console.log(e.currentTarget);
}
