const express = require('express');
const cors = require('cors');
const SerpApi = require('google-search-results-nodejs');
require("dotenv").config();
const search = new SerpApi.GoogleSearch(process.env.SERPAPI_Key);
const path = require("path")
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Function to perform the search and return a promise
const performSearch = (params) => {
    return new Promise((resolve, reject) => {
        search.json(params, (data) => {
            if (data && data["visual_matches"]) {
                resolve(data["visual_matches"]);
            } else {
                reject(new Error("Error performing the search."));
            }
        });
    });
};


app.post('/upload-image', async (req, res) => {
    const { imageUrl } = req.body;

    try {
        // Perform the search and get the visual matches
        const params = {
            engine: "google_lens",
            url: imageUrl
        };

        // Call the Google Search API and wait for the result
        const visualMatches = await performSearch(params);

        // Send the visual matches back to the frontend
        res.status(200).json({ visualMatches });
    } catch (error) {
        console.error('Error processing image search:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(express.static(path.join(__dirname, "./client/build")));
app.get('*', function (_, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"), function (err) {
        res.status(500).send(err);
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});