// const Address = require('../models/addressModel');
// const asyncHandler = require('express-async-handler');

// // create an address
// const createAddress = asyncHandler(async (req, res) => {
//   try {
//     const { streetAddress, city, state, zipcode } = req.body;
//     const fullAddress = `${streetAddress}, ${city}, ${state} ${zipcode}`;

//     // Convert address to geocoordinates using a geocoding API (Mapbox in this example)
//     const mapboxAccessToken = process.env.MAPBOX_TOKEN; 

//     // Use dynamic import for fetch
//     const fetch = (await import('node-fetch')).default;

//     const geocodingResponse = await fetch(
//       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//         fullAddress
//       )}.json?access_token=${mapboxAccessToken}`
//     );

//     const geocodingData = await geocodingResponse.json();

//     if (!geocodingData.features || geocodingData.features.length === 0) {
//       return res.status(400).json({ message: 'Invalid address. No geocoding data found.' });
//     }

//     // Retrieve the coordinates from the geocoding response
//     const coordinates = geocodingData.features[0].geometry.coordinates;

//     // Save the address and coordinates to MongoDB
//     const addressData = {
//       streetAddress: streetAddress,
//       city: city,
//       state: state,
//       zipcode: zipcode,
//       coordinates: {
//         // Store the coordinates as GeoJSON format
//         type: 'Point',
//         coordinates: coordinates,
//       },
//     };

//     const createdAddress = await Address.create(addressData);

//     res.status(201).json(createdAddress);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// module.exports = { createAddress };
