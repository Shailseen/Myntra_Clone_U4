// This file handles Razorpay payment integration for gift card payments

// Replace this with your actual Razorpay test key
const API_KEY = "rzp_test_YourTestKeyHere";

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const makeGiftCardPayment = async (amount, orderInfo, onSuccess, onFailure, paymentMethod) => {
  try {
    const res = await initializeRazorpay();
    
    if (!res) {
      throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
    }
    
    // In a real application, you would make an API call to your backend to create a Razorpay order
    // For this example, we'll simulate an order with a dummy ID
    const orderData = {
      id: `order_${Math.random().toString(36).substring(7)}`,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR'
    };
    
    const options = {
      key: API_KEY,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Myntra Clone",
      description: `Payment for order ${orderInfo.orderId || 'MYNTRA-TEST'}`,
      order_id: orderData.id,
      handler: function(response) {
        // This handler is called when payment is successful
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      prefill: {
        name: orderInfo.name || "Test User",
        email: orderInfo.email || "test@example.com",
        contact: orderInfo.phone || "9999999999"
      },
      notes: {
        address: orderInfo.address || "Test Address",
        giftCardApplied: true
      },
      theme: {
        color: "#ff3f6c"
      }
    };
    
    // Set specific payment method if provided
    if (paymentMethod) {
      options.method = paymentMethod;
    }
    
    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response){
      onFailure(response.error);
    });
    
    paymentObject.open();
  } catch (error) {
    onFailure(error);
  }
};
