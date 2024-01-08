mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbGVuMTA2IiwiYSI6ImNscXlham03ZzBubGcya3BveXJveWRtaTQifQ.l4TqDA9Ht87uHzHR-e-Vmg'; // Replace with your Mapbox access token
const map = new mapboxgl.Map({
    container: 'map', // The HTML element ID where the map will be inserted
    style: 'mapbox://styles/mapbox/light-v10', // Replace with your desired map style
    center: [-85.2913559, 39.8089351], // Set the initial position [longitude, latitude]
    zoom: 10 // Set the initial zoom level
});

import { polygonCoordinates } from 'http://127.0.0.1:5500/backend/coordinates/polygon.js'; // Adjust the path as needed
import { nyStateCoordinates } from 'http://127.0.0.1:5500/backend/coordinates/polygon.js'; // Adjust the path as needed


let marker;
    const notification = document.getElementById('notification');

    map.on('load', () => {
      // Add your first polygon
      map.addLayer({
        id: 'my-polygon',
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: polygonCoordinates,
            },
          },
        },
        layout: {},
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.8,
        },
      });

      // Add your second polygon
      map.addLayer({
        id: 'ny-state-polygon',
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [nyStateCoordinates],
            },
          },
        },
        layout: {},
        paint: {
          'fill-color': '#05B4DF',
          'fill-opacity': 0.3,
          'fill-outline-color': '#088', // Optional: Outline color
        },
      });
    });




    document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitAddress);
    }
});

 const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });

  console.log('Geocoder initialized.');


    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

     function capitalizeFirstLetter(str) {
      return str.replace(/\b\w/g, (match) => match.toUpperCase());
    }

    console.log('Geocoder added to the HTML.');

    async function submitAddress() {
      const streetAddress = capitalizeFirstLetter(document.getElementById('streetAddress').value);
      const city = capitalizeFirstLetter(document.getElementById('city').value);
      const state = document.getElementById('state').value.toUpperCase();
      const zipcode = document.getElementById('zipcode').value;

      const fullAddress = `${streetAddress}, ${city}, ${state} ${zipcode}`;

    

      console.log(fullAddress); // Check if fullAddress is capitalized correctly
    
      try {
        // Convert the address to geocoordinates using Mapbox Geocoding API
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${mapboxgl.accessToken}`);
        console.log("geocoordines translation");
if (!response.ok) {
  throw new Error('Failed to geocode address');
}
const data = await response.json();


        // Retrieve the coordinates from the geocoding response
        const coordinates = data.features[0].geometry.coordinates;
        console.log(coordinates); // Check the coordinates


        // Fly to the new marker's location
        map.flyTo({
          center: coordinates,
          zoom: 15, // You can adjust the zoom level as needed
          speed: 1.5, // Animation speed
        });


        // Place a marker at the address location
        new mapboxgl.Marker({
    color: "#05B4DF" // Hex code for yellow
})
            .setLngLat(coordinates)
            .addTo(map);

// Assuming 'coordinates' is [longitude, latitude] of the marker
const point = turf.point(coordinates);

const polygon = turf.polygon([nyStateCoordinates]);

const isInsidePolygon = turf.booleanPointInPolygon(point, polygon);

const pricingInfoDiv = document.getElementById('pricing-info');

if (isInsidePolygon) {
    // If the condition is met, show the pricing information
    pricingInfoDiv.style.display = 'block';
} else {
    // Otherwise, keep it hidden
    pricingInfoDiv.style.display = 'none';
}

// Update the notification based on whether the marker is inside the polygon
const notification = document.getElementById('notification');
if (isInsidePolygon) {
    notification.innerHTML = `Service is available at<br> <strong>${fullAddress}</strong>.`;
    notification.style.display = 'block';
} else {
    notification.innerHTML = `Service is not available at<br> <strong>${fullAddress}</strong>.`;
    notification.style.display = 'block';
}

// Assuming this part determines if the address is inside the polygon
if (isInsidePolygon) {
    const pricingInfoDiv = document.getElementById('pricing-info');
    const packagesList = document.getElementById('packages-list');

    


    // Define your packages
    const packages = [
        { name: '50mb Package', price: '$29.99/month' },
        { name: '100mb Package', price: '$49.99/month' },
        { name: '1gbps Package', price: '$99.99/month' }
    ];


    // Display the pricing information
    pricingInfoDiv.style.display = 'block';
} else {
    // Hide the pricing information if not in polygon
    document.getElementById('pricing-info').style.display = 'none';
}


     const formData = {
    streetAddress: streetAddress,
    city: city,
    state: state,
    zipcode: zipcode,
    coordinates: {
        type: "Point", // As defined in your schema
        coordinates: [coordinates[0], coordinates[1]] // [longitude, latitude]
    }
};


        const backendResponse = await fetch('http://localhost:3000/api/address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (backendResponse.ok) {
          console.log('Address submitted successfully');
          // Optionally, you can redirect or display a success message here
        } else {
          console.error('Failed to submit address to backend:', backendResponse.statusText);
          // Handle the error (e.g., display an error message)
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle the error (e.g., display an error message)
      }
    }


