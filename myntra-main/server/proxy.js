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

// Add debugging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

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

    // Log before sending response
    console.log('Sending response back to frontend');
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
    console.log('➡️ Proxy server received request for gift card search');
    console.log('Request payload:', req.body);

    // Call /products/search
    const searchResponse = await axios.post('http://15.207.173.77:8000/products/search', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Call /products/suggestion
    const suggestionResponse = await axios.post('http://15.207.173.77:8000/products/suggestion', req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Mark suggestion hits with a flag
    const searchHits = (searchResponse.data?.hits?.hits || []).map(hit => ({
      ...hit,
      _isSuggestion: false
    }));
    const suggestionHits = (suggestionResponse.data?.hits?.hits || []).map(hit => ({
      ...hit,
      _isSuggestion: true
    }));

    // Combine: search hits first, then suggestion hits
    const combinedHits = [...searchHits, ...suggestionHits];

    // Clone the search response and replace hits.hits with combinedHits
    const combinedResponse = {
      ...searchResponse.data,
      hits: {
        ...searchResponse.data.hits,
        hits: combinedHits
      }
    };

    console.log('Combined gift card API hits:', combinedHits.length);

    // Return the combined response to the frontend
    res.json(combinedResponse);
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

// Add a test endpoint to verify server is working
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ status: 'success', message: 'Proxy server is working!' });
});

// Add a catch-all route to debug unmatched routes
app.use((req, res, next) => {
  console.log(`⚠️ UNMATCHED ROUTE: ${req.method} ${req.url}`);
  if (req.method === 'POST' && req.url.includes('giftcards')) {
    console.log('This looks like the gift card search request but did not match the route');
    console.log('Full URL:', req.url);
    console.log('Body:', req.body);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
