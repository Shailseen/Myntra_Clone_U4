const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for your frontend
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Proxy endpoint for Woohoo API
app.post('/api/woohoo/orders', async (req, res) => {
  try {
    console.log('Proxy server received request for Woohoo API');
    
    // Forward the request to the actual Woohoo API
    const response = await axios.post('https://qastatic.woohoo.in/rest/v3/orders', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'dateAtClient': new Date().toISOString(),
        'signature': 'f31c05e0ed783ff4c62b0e758dbe190d046e41b6db803e1fd8e40e8ad370714788924af9f3db7c8fc5e14bdac2b7253a81ae89e2f67d464b91480618bcd2c6c9',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb25zdW1lcklkIjo0LCJleHAiOjE3NTQ1Mzk4OTEsInRva2VuIjoiNTYwNjkwODc3ZWI4ZjhhYmFjMzVjYWFmNGIwYjgzMjgifQ.-zNqUa4vyV8xwFbqbaVKu1yxDegbwg_cnaM_0QLbg2I'
      }
    });
    
    console.log('Woohoo API response:', response.data);
    
    // Return the API response to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to Woohoo API:', error.message);
    
    // Send error details back to client
    res.status(500).json({
      error: 'Proxy server error',
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

// Add a new endpoint for gift card search
app.post('/api/giftcards/search', async (req, res) => {
  try {
    console.log('Proxy server received request for gift card search');
    
    // Forward the request to the actual gift card API
    const response = await axios.post('http://15.207.173.77:8000/product/search', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Gift card API response:', response.data);
    
    // Return the API response to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying to gift card API:', error.message);
    
    // Send error details back to client
    res.status(500).json({
      error: 'Proxy server error',
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
