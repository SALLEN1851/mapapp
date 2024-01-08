mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbGVuMTA2IiwiYSI6ImNscXlham03ZzBubGcya3BveXJveWRtaTQifQ.l4TqDA9Ht87uHzHR-e-Vmg'; // Replace with your Mapbox access token
const map = new mapboxgl.Map({
    container: 'map', // The HTML element ID where the map will be inserted
    style: 'mapbox://styles/mapbox/streets-v11', // Replace with your desired map style
    center: [-73.981934, 40.753019], // Set the initial position [longitude, latitude]
    zoom: 14 // Set the initial zoom level
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
        new mapboxgl.Marker()
            .setLngLat(coordinates)
            .addTo(map);

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


