import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [visualMatches, setVisualMatches] = useState([]);
  const [loading, setLoading] = useState(false); // New state for loading pop-up


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'oluutkeu');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dgziyn4xx/image/upload',
        formData
      );

      setImage(response.data.secure_url);

      // Call SERP API via proxy server
      try {
        const backendApiUrl = '/upload-image';
        const backendResponse = await axios.post(backendApiUrl, { imageUrl: response.data.secure_url });

        console.log('Image URL sent to backend successfully:', backendResponse.data);

        // Update visual matches
        setVisualMatches(backendResponse.data.visualMatches || []);
      } catch (error) {
        console.error('Error sending image URL to backend:', error);
        setLoading(false); // Hide loading pop-up
      }

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleVisitClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Upload a photo of the item you'd like to buy👇</h2>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css"></link>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'block', margin: 'auto' }} />
      {image && <img src={image} alt="Uploaded" style={{ width: '300px' }} />}
      {loading && <h2>Loading...</h2>} {/* Display "Loading..." when loading is true */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {
          visualMatches.map((match, index) => {
            const domain = new URL(match.link).hostname;

            // Limit the title to 30 characters and add ellipsis for overflow
            const limitedTitle = match.title.length > 30 ? `${match.title.slice(0, 30)}...` : match.title;

            return (
              <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', width: '45%', borderRadius: '10px', boxSizing: 'border-box', marginBottom: '20px' }}>
                <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                  <strong title={match.title}>{limitedTitle}</strong>
                  <div>{domain}</div>
                  <br />
                  {match.price && match.price.value && <span style={{ fontWeight: 'bold', color: 'white' }}>{match.price.value}</span>}
                </div>
                <img src={match.thumbnail} alt="Thumbnail" style={{ width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '10px' }} />
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handleVisitClick(match.link)} style={{ backgroundColor: '#ff6600', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Visit</button>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default ImageUploader;
