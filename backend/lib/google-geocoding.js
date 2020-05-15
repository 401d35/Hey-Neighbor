'use strict'

const express = require('express');
const dotenv = require('dotenv');
const app = express();
const regionSchema = require('backend\schemas\region-schema.js');

dotenv.config();

app.use(express.json());
app.use(userRoutes);
app.use(reviewRoutes);

google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {
    let input = document.getElementById('address');
    let autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function () {
    let place = autocomplete.getPlace();

    // place has the lat and long 
 
  document.getElementById("latitude").value = place.geometry['location'].lat();
  document.getElementById("longitude").value = place.geometry['location'].lng();
});
}

async function givesUserAddress () {
  let userAddress = initialize

}
