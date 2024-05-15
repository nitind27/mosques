import axios from "axios";

export default async function GetMosques(req, res) {
  console.log(req.body.input);
  const input = req.body.input;
  const apiKey = process.env.MAP_API; // Replace with your actual API key
  const apiUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

  try {
    const response = await axios.get(apiUrl, {
      params: {
        input: input,
        key: apiKey,
        // Bias results towards London
        location: "51.5074,-0.1278", // Latitude and Longitude of London
        radius: 100000, // Bias results within 100km radius of London
     
      },
    });
   
    console.log("server:", response.data.predictions[0].structured_formatting);
    const predictions = response.data.predictions.map((prediction) => {
      let mosqueName = prediction.description;
      
      // Remove ", UK" from the description if it exists
      mosqueName = mosqueName.replace(", UK", "");

      return {
        id: prediction.place_id,
        name: mosqueName,
      };
    });

    // Filter out any predictions that still include the country name
    const filteredPredictions = predictions.filter(
      (prediction) => !prediction.name.includes("UK")
    );

    // Sort predictions by length
    filteredPredictions.sort((a, b) => a.name.length - b.name.length);

    res.json(filteredPredictions);
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
