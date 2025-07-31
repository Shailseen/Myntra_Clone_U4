// This file handles Razorpay payment integration for gift card payments

// Replace this with your actual Razorpay test key
const API_KEY = "rzp_test_YourTestKeyHere";

function getRandomString(minLength = 8, maxLength = 10) {
  // Determine a random length between min and max
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  
  // Generate random string
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}


export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Alternative function using XMLHttpRequest instead of fetch
export const makeWoohooPaymentXHR = async () => {
  return new Promise((resolve, reject) => {
    try {
      const refNo = getRandomString();

      console.log("Making XHR payment with reference number:", refNo);

      // Check if proxy server is running
      const useProxy = true; // Set to true when your proxy server is running

      if (useProxy) {
        // Change to use your local proxy server
        const API_URL = 'http://localhost:5000/api/woohoo/orders';

        const xhr = new XMLHttpRequest();
        xhr.open('POST', API_URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        // Add timeout to prevent hanging indefinitely
        xhr.timeout = 15000; // Increase timeout to 15 seconds
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log("XHR response:", xhr.responseText);
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({ success: true, data });
            } catch (e) {
              resolve({ 
                success: true, 
                data: { 
                  rawResponse: xhr.responseText,
                  status: xhr.status,
                  refNo: refNo
                } 
              });
            }
          } else {
            console.error("XHR error:", xhr.statusText);
            reject({ success: false, error: `XHR failed with status: ${xhr.status}` });
          }
        };
        
        xhr.onerror = function(e) {
          console.error("XHR network error", e);
          reject({ success: false, error: "Network error" });
        };

        xhr.ontimeout = function() {
          console.error("XHR request timed out - proxy server may not be responding fast enough");
          reject({ success: false, error: "Request timed out" });
        };
        
        const payload = JSON.stringify({
          "address": {
            "firstname": "alrahiyan",
            "lastname": "r",
            "email": "alrahiyan.r@pinelabs.com",
            "telephone": "+917395904703",
            "line1": "Qwikcilver Solutions",
            "line2": "111, BMC,Koramangala",
            "city": "bangalore",
            "region": "Karnataka",
            "country": "IN",
            "postcode": "560095",
            "company": "",
            "billToThis": true
          },
          "billing": {
            "firstname": "alrahiyan",
            "lastname": "",
            "email": "alrahiyan.r@pinelabs.com",
            "telephone": "+917395904703",
            "line1": "billing 1",
            "line2": "Billing 2",
            "city": "bangalore",
            "region": "Karnataka",
            "country": "IN",
            "postcode": "560095",
            "company": ""
          },
          "payments": [
            {
              "code": "amadeuscheckout",
              "amount": 100,
              "po_number": "12345"
            }
          ],
          "refno": refNo,
          "syncOnly": true,
          "products": [
            {
              "sku": "titanegiftcard",
              "price": 100,
              "qty": 1,
              "currency": "356",
              "cardNumber": "21321412341",
              "affiliateDetails": {
                "name": "raj",
                "id": "SBOMPW03"
              }
            }
          ],
          "additionalParams": {}
        });
        
        xhr.send(payload);
      } else {
        // Provide simulated response directly
        provideSimulatedResponse();
      }
      
      // Helper function to provide a simulated successful response
      function provideSimulatedResponse() {
        console.log("SIMULATION: Providing mock API response");
        setTimeout(() => {
          resolve({
            success: true,
            simulated: true,
            data: {
              orderId: "sim-" + Math.floor(Math.random() * 1000000),
              status: "SUCCESS",
              message: "This is a simulated response for development",
              refNo: refNo,
              createdOn: new Date().toISOString(),
              products: [
                {
                  sku: "titanegiftcard",
                  price: 100,
                  qty: 1
                }
              ]
            }
          });
        }, 1000); // Simulate a 1-second delay
      }
    } catch (error) {
      console.error("Error in XHR request:", error);
      reject({ success: false, error: error.message });
    }
  });
};

// New simplified function that only calls the Woohoo API
export const processPaymentOnly = async (onApiSuccess, onApiFailure) => {
  try {
    console.log("Processing payment - API call only");
    const result = await makeWoohooPaymentXHR();
    
    if (result.success) {
      console.log("API call completed successfully");
      onApiSuccess(result.data);
    } else {
      console.error("API call failed:", result.error);
      onApiFailure(result.error);
    }
    
    return result;
  } catch (error) {
    console.error("Payment processing error:", error);
    onApiFailure(error.message);
    return { success: false, error: error.message };
  }
};

// Modified version of makeGiftCardPayment that doesn't proceed to Razorpay
export const makeGiftCardPayment = async (amount, orderInfo, onSuccess, onFailure, paymentMethod) => {
  try {
    console.log("Starting gift card payment process - API call only");
    
    // Only make the Woohoo API call without proceeding to Razorpay
    const woohooResult = await makeWoohooPaymentXHR();

    // Log the result but DO NOT call onSuccess callback which might be triggering the redirect
    console.log("Woohoo payment API call result:", woohooResult);
    
    // Return the result without triggering callbacks
    return woohooResult;
    
  } catch (error) {
    console.error("Payment process error:", error);
    // Don't call the failure callback either as it might also be triggering a redirect
    // onFailure(error);
    return { success: false, error: error.message };
  }
};

// New function that can be used instead of makeGiftCardPayment to avoid any redirects
export const testApiCallOnly = async () => {
  try {
    console.log("Making API call test only - no callbacks or redirects");
    // Add a delay to ensure we can see the API call in progress
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await makeWoohooPaymentXHR();
    console.log("API call completed with result:", result);
    
    // Alert to show the result visually
    alert("API call completed. Check console for details.");
    
    return result;
  } catch (error) {
    console.error("API call test failed:", error);
    alert("API call failed: " + error.message);
    return { success: false, error: error.message };
  }
};