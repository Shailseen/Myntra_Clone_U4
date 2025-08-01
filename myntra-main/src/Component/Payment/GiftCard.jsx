import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CardGiftcard, LocalOfferOutlined } from "@mui/icons-material";
import { makeWoohooPaymentXHR } from '../../services/RazorpayService';
import { useNavigate } from 'react-router-dom';

// Import only necessary local logo images
import razorpayLogo from '../../assets/images/razorpay-logo-white.png';
import gpayLogo from '../../assets/images/gpay-logo.png';

// Mock gift card data with offers (fallback)
const mockGiftCards = [
  { 
    id: 'gc1', 
    name: 'Birthday Gift Card', 
    value: 500, 
    code: 'MYN500', 
    color: '#ffeae9',
    offers: [
      'Valid on all products',
      'Minimum amount: 2000'
    ]
  },
  { 
    id: 'gc2', 
    name: 'Anniversary Gift Card', 
    value: 1000, 
    code: 'MYN1000', 
    color: '#fff1e0',
    offers: [
      'Valid for 1 year from purchase',
      'Can be used with other offers'
    ]
  },
  { 
    id: 'gc3', 
    name: 'Special Gift Card', 
    value: 750, 
    code: 'MYN750', 
    color: '#e9f7ff',
    offers: [
      'Applicable on premium brands',
      'Exclusive member benefits'
    ]
  },
  { 
    id: 'gc4', 
    name: 'Celebration Gift Card', 
    value: 200, 
    code: 'MYN200', 
    color: '#edfff0',
    offers: [
      'Perfect for gifting',
      'Valid on all categories'
    ]
  },
];

const API_BASE_URL = process.env.REACT_APP_BACKEND_API;

// Styled components for GiftCard
const GiftCardContainer = styled.div`
  padding: 20px;
  width: 100%;
  box-sizing: border-box; // Ensure padding is included in width calculation
  overflow: hidden; // Prevent content from spilling out
`;

const GiftCardHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const GiftCardForm = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const GiftCardInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #d4d5d9;
  border-radius: 4px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #ff3f6c;
  }
`;

const ApplyButton = styled.button`
  background-color: #ff3f6c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #e63161;
  }
`;

const GiftCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
`;

const GiftCardItem = styled.div`
  border: 1px solid #eaeaec;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  width: auto;
//   margin-bottom: 15px;
  &:hover {
    border-color: #ff3f6c;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardImage = styled.div`
  background-color: ${props => props.color || '#f5f5f6'};
  height: 40px;
  width: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-right: 15px;
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  width: 100%;
`;

const CardName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const CardValue = styled.div`
  color: #282c3f; // Changed from pink (#ff3f6c) to neutral dark color
  font-weight: 600;
  font-size: 14px;
`;

const CardOffers = styled.div`
  font-size: 11px;
  color: #7e818c;
  margin-bottom: 0;
`;

const OfferItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 3px;
  margin-bottom: 2px;
  line-height: 1.2;
`;

const CardActions = styled.div`
  margin-left: -10px; // Use negative margin to pull button closer
  width: 100px;
  min-width: 60px;
`;

const CardApplyButton = styled.button`
  background-color: #ff3f6c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 0;
  width: 100%;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #e63161;
  }
`;

const Divider = styled.div`
  border-top: 1px dashed #d4d5d9;
  margin: 20px 0;
  position: relative;
  
  &::before {
    content: 'OR';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 0 10px;
    color: #7e818c;
    font-size: 12px;
  }
`;

const SuccessMessage = styled.div`
  color: #03a685;
  font-size: 16px;
  margin: 15px 0;
  padding: 10px;
  background-color: #f5fffd;
  border-radius: 4px;
  border-left: 3px solid #03a685;
`;

const GiftCardApplied = styled.div`
  border: 1px solid #eaeaec;
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: auto; // Allow container to determine width
  max-width: 100%; // Ensure it doesn't exceed parent width
  box-sizing: border-box; // Include padding in width calculation
`;

const AppliedCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f5f5f5;
  flex-wrap: wrap; // Allow wrapping if space is limited
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
`;

const RemoveButton = styled.button`
  color: #ff3f6c;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 5px;
  white-space: nowrap;
`;

const AmountApplied = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #282c3f;
`;

const NetPayableAmount = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #ff3f6c;
  margin-top: 15px;
  padding: 12px;
  background-color: #fff1f4;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
  max-width: 100%;
  box-sizing: border-box;
`;

const NetPayableLabel = styled.span`
  font-size: 16px;
  color: #282c3f;
  font-weight: 600;
`;

// Add the missing styled components
const DiscountPreview = styled.div`
  font-size: 12px;
  color: #03a685;
  margin-top: 5px;
`;

const NetPayablePreview = styled.div`
  font-size: 12px;
  color: #282c3f;
  font-weight: 500;
  margin-top: 3px;
`;

// Enhanced summary display
const OrderSummary = styled.div`
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eaeaec;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${props => props.highlight ? '#ff3f6c' : '#535766'};
  font-weight: ${props => props.bold ? '600' : '400'};
`;

// Add the PayNowButton styled component
const PayNowButton = styled.button`
  background-color: ${props => props.disabled ? "#cccccc" : "#ff3f6c"};
  color: white;
  border: none;
  border-radius: 4px;
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  opacity: ${props => props.disabled ? 0.7 : 1};
  transition: all 0.3s ease;
  &:hover {
    background-color: ${props => props.disabled ? "#cccccc" : "#e63161"};
  }
`;

// Add the missing styled components for payment iframe
const PaymentIframeContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PaymentIframe = styled.iframe`
  width: 420px;
  height: 480px;
  border: none;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const LoadingMessage = styled.div`
  color: white;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

// Update the component to accept pre-fetched cards
const GiftCard = ({ 
  onApply, 
  totalAmount, 
  availableCards: propCards, 
  isLoading: propIsLoading, 
  error: propError,
  skipFetch = false,
  addAmountGiftCards = [] // New prop
}) => {
  const navigate = useNavigate();
  const [giftCardCode, setGiftCardCode] = useState('');
  const [appliedCard, setAppliedCard] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [availableCards, setAvailableCards] = useState(propCards || mockGiftCards);
  const [isLoading, setIsLoading] = useState(propIsLoading !== undefined ? propIsLoading : true);
  const [error, setError] = useState(propError);
  
  // Add state for payment iframe
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(10); // 10 seconds
  
  // Add state for payment response details
  const [paymentResponse, setPaymentResponse] = useState({
    orderId: 'APCP2323000232', // Default fallback
    refNo: '',
    status: ''
  });

  const iframeRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // Update state when props change
  useEffect(() => {
    if (propCards) {
      setAvailableCards(propCards);
    }
    if (propIsLoading !== undefined) {
      setIsLoading(propIsLoading);
    }
    if (propError !== undefined) {
      setError(propError);
    }
  }, [propCards, propIsLoading, propError]);

  // Fetch gift cards from API only if not already provided via props
  useEffect(() => {
    // Skip fetching if skipFetch is true or cards are provided via props
    if (skipFetch || propCards) {
      return;
    }
    
    const fetchGiftCards = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        
        console.log("Fetching gift cards via proxy server...");
        
        const apiUrl = `${API_BASE_URL}/api/giftcards/search`;
        
        // Updated to use totalAmount from props instead of hardcoded value
        const payload = {
          "amount": totalAmount,
          "code": "Amazon"
        };
        
        console.log("Sending gift card request with payload:", payload);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Gift card API response:", data);
        
        // Handle the specific API response format
        if (data && data.hits && data.hits.hits && Array.isArray(data.hits.hits)) {
          if (data.hits.hits.length > 0) {
            // If we have hits, map them to our card format
            const apiCards = data.hits.hits.map((hit, index) => {
              const source = hit._source || {};
              return {
                id: hit._id || `api-${index}`,
                name: source.name || 'Gift Card',
                value: Math.abs(totalAmount - hit.sort || 100),
                code: source.id || `GC-${index + 1000}`,
                color: ['#ffeae9', '#fff1e0', '#e9f7ff', '#edfff0'][index % 4],
                offers: [
                  `${source.description?.substring(0, 15) + '...' || 'Gift Card'}`
                ]
              };
            });
            console.log("API gift cards:", apiCards);
            setAvailableCards(apiCards);
          } else {
            // No results, use mock data
            console.log("No gift cards found in API response, using mock data");
            setAvailableCards(mockGiftCards);
          }
        } else {
          // Fall back to mock data
          console.log("Unexpected API response format, using mock data");
          setAvailableCards(mockGiftCards);
        }
      } catch (err) {
        console.error("Error in gift card fetch process:", err);
        setError(err.message);
        setAvailableCards(mockGiftCards);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGiftCards();
  }, [skipFetch, propCards, totalAmount]);

  const handleApplyCode = () => {
    if (!giftCardCode.trim()) return;

    // Determine gift card value based on code
    let giftCardValue = 0;
    let cardName = "Myntra Gift Card";
    
    // Check if code matches any of our mock cards
    const matchedCard = mockGiftCards.find(card => 
      card.code.toUpperCase() === giftCardCode.toUpperCase()
    );
    
    if (matchedCard) {
      giftCardValue = matchedCard.value;
      cardName = matchedCard.name;
      
      // Apply the matched card
      handleApply({
        ...matchedCard,
        enteredCode: true
      });
    } else {
      // Default value for testing with custom codes
      giftCardValue = 200;
      
      // Apply a generic card
      handleApply({
        id: 'custom',
        name: cardName,
        value: giftCardValue,
        code: giftCardCode,
        enteredCode: true
      });
    }
    
    // Clear input
    setGiftCardCode('');
  };

  const handleApply = (card) => {
    setAppliedCard(card);
    setSuccessMessage(`Gift cards of ₹${card.value} applied successfully!`);
    if (onApply) onApply(card.value, card); // Pass both value and card
  };

  const handleRemove = () => {
    setAppliedCard(null);
    setSuccessMessage('');
    onApply(0); // Reset the discount
  };

  // Calculate net payable after gift card
  const netPayable = Math.max(0, totalAmount - (appliedCard?.value || 0));

  // Add a function to handle payment
  const handlePayment = async () => {
    if (appliedCard) {
      setIsProcessingPayment(true);
      
      try {
        // Call the makeWoohooPaymentXHR function with the netPayable amount
        console.log("Initiating payment with Woohoo API for amount:", netPayable);
        const paymentResult = await makeWoohooPaymentXHR(netPayable);
        
        console.log("Payment API response:", paymentResult);
        
        if (paymentResult.success) {
          // Store the payment response information
          const responseData = paymentResult.data || {};
          setPaymentResponse({
            orderId: responseData.orderId || 'ORD' + Math.floor(Math.random() * 1000000),
            refNo: responseData.refNo || '',
            status: responseData.status || 'PENDING'
          });

          // For demo: show payment overlay
          setShowPaymentIframe(true);
          setPaymentCountdown(10); // 10 seconds

          countdownTimerRef.current = setInterval(() => {
            setPaymentCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownTimerRef.current);
                setShowPaymentIframe(false);
                navigate('/ordersuccess');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          alert("Payment processing failed: " + (paymentResult.error || "Unknown error"));
          setIsProcessingPayment(false);
        }
      } catch (error) {
        console.error("Payment error:", error);
        alert("Payment error: " + (error.message || "Unknown error"));
        setIsProcessingPayment(false);
      }
    }
  };

  // Cleanup function for countdown timer
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Helper to generate the HTML for the dummy UPI QR payment page
  function getDummyUPIPaymentHTML(orderId, amount, timerSeconds) {
    return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f7f7f7; margin: 0; }
          .container { background: #fff; width: 380px; margin: 40px auto; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
          .header { background: #1746a2; color: #fff; padding: 18px 20px; }
          .header .brand { font-weight: bold; font-size: 18px; letter-spacing: 1px; }
          .header .order { font-size: 13px; margin-top: 6px; }
          .header .amt { font-size: 18px; font-weight: bold; margin-top: 8px; }
          .pay-section { padding: 18px 20px 10px 20px; }
          .pay-title { font-size: 15px; font-weight: 600; margin-bottom: 10px; }
          .qr-box { background: #fff; border: 1px solid #eee; border-radius: 6px; padding: 12px; text-align: center; }
          .qr-img { width: 140px; height: 140px; margin: 0 auto 10px auto; display: block; }
          .scan-pay { font-size: 14px; font-weight: 500; margin-bottom: 6px; }
          .upi-icons { margin: 8px 0 6px 0; }
          .upi-icons img { height: 22px; margin: 0 4px; vertical-align: middle; }
          .expires { color: #555; font-size: 13px; margin-top: 8px; }
          .footer { text-align: center; color: #888; font-size: 13px; margin: 18px 0 0 0; }
          .ccavenue { font-size: 12px; color: #888; margin-top: 12px; }
        </style>
        <script>
          let timer = ${timerSeconds};
          function updateTimer() {
            if (timer <= 0) return;
            timer--;
            var min = Math.floor(timer / 60);
            var sec = timer % 60;
            document.getElementById('timer').innerText = min + ':' + (sec < 10 ? '0' : '') + sec;
            if (timer > 0) setTimeout(updateTimer, 1000);
          }
          window.onload = updateTimer;
        </script>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">MALAYSIA AIRLINES BERHAD</div>
            <div class="order">Order ID : ${orderId}</div>
            <div class="amt">₹ ${amount}.00</div>
          </div>
          <div class="pay-section">
            <div class="pay-title">Pay through UPI QR Code</div>
            <div class="qr-box">
              <img class="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=demo@upi&pn=Demo%20Merchant&am=${amount}" alt="QR Code" />
              <div class="scan-pay">Scan and Pay</div>
              <div style="font-size:12px;color:#888;">Scan the QR code using any UPI app on your phone</div>
              <div class="upi-icons">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3b/UPI-Logo-vector.svg" alt="UPI" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Paytm_logo.png" alt="Paytm" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/WhatsApp_Logo.svg" alt="WhatsApp" />
              </div>
              <div class="expires">Expires in <span id="timer">${Math.floor(timerSeconds/60)}:${(timerSeconds%60).toString().padStart(2,'0')}</span> mins.</div>
            </div>
          </div>
          <div class="footer">
            <div class="ccavenue">CCAvenue<sup>®</sup> An Infibeam Avenues Product</div>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  // Dummy UPI payment styled components
const DummyUPIPaymentBox = styled.div`
  background: #fff;
  width: 420px;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.1);
  overflow: hidden;
  margin: 40px auto;
  padding-bottom: 16px;
  font-family: 'Inter', 'Roboto', sans-serif;
`;

const DummyHeader = styled.div`
  background: #0252cc; /* Razorpay blue */
  color: #fff;
  padding: 20px;
`;

const DummyBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

// Replace the background-image approach with a regular img element
const DummyLogo = styled.img`
  width: 120px;
  height: 30px;
  object-fit: contain;
`;

const DummyOrder = styled.div`
  font-size: 13px;
  margin-top: 6px;
  opacity: 0.9;
`;

const DummyAmt = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin-top: 10px;
  letter-spacing: 0.3px;
`;

const DummyPaySection = styled.div`
  padding: 20px;
`;

const DummyPayTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #222;
`;

const DummyQRBox = styled.div`
  background: #f9fafc;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const DummyQRImg = styled.img`
  width: 180px;
  height: 180px;
  margin: 0 auto 15px auto;
  display: block;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 4px;
  background: white;
`;

const DummyScanPay = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #222;
`;

const DummyUPIIcons = styled.div`
  margin: 12px 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  
  & img { 
    height: 24px;
    border-radius: 4px;
  }
`;

const DummyExpires = styled.div`
  color: #6b7280;
  font-size: 13px;
  margin-top: 12px;
  font-weight: 500;
`;

const DummyFooter = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 12px;
  margin: 20px 0 0 0;
  padding: 0 20px;
`;

const DummySecurity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
  
  & svg {
    color: #0252cc;
    font-size: 14px;
  }
`;

const DummyPoweredBy = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

  return (
    <GiftCardContainer>
      <GiftCardHeader>GIFT CARD</GiftCardHeader>
      {isLoading && <p>Loading gift cards...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}. Using default gift cards.</p>}

      {/* Render available gift cards */}
      {!appliedCard ? (
        <>
          <GiftCardList>
            {availableCards.map(card => (
              <GiftCardItem key={card.id}>
                {/* Show image if available, else fallback to icon */}
                {card.baseUrl ? (
                  <CardImage color={card.color}>
                    <img
                      src={card.baseUrl}
                      alt={card.name}
                      style={{ width: 36, height: 36, borderRadius: 4, objectFit: "cover" }}
                    />
                  </CardImage>
                ) : (
                  <CardImage color={card.color}>
                    <CardGiftcard sx={{ fontSize: 20, color: '#ff3f6c' }} />
                  </CardImage>
                )}
                <CardContent>
                  <CardInfo>
                    <CardName>{card.name}</CardName>
                    {/* Removed the CardValue component here */}
                  </CardInfo>
                  <CardOffers>
                    {card.offers.map((offer, index) => (
                      <OfferItem key={index}>
                        <LocalOfferOutlined sx={{ fontSize: 10, color: '#ff3f6c', marginTop: "2px" }} />
                        <span>{offer}</span>
                      </OfferItem>
                    ))}
                  </CardOffers>
                  <DiscountPreview>You save: ₹{Math.min(card.value, totalAmount).toFixed(2)}</DiscountPreview>
                  <NetPayablePreview>Net payable: ₹{Math.max(0, totalAmount - card.value).toFixed(2)}</NetPayablePreview>
                </CardContent>
                <CardActions>
                  <CardApplyButton
                    onClick={() => handleApply(card)}
                    disabled={card._isSuggestion === true}
                    style={card._isSuggestion ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  >
                    APPLY
                  </CardApplyButton>
                </CardActions>
              </GiftCardItem>
            ))}
          </GiftCardList>
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        </>
      ) : (
        <>
          <SuccessMessage>Gift card of ₹{appliedCard.value.toFixed(2)} applied successfully!</SuccessMessage>
          <GiftCardApplied>
            <AppliedCardHeader>
              <CardTitle>
                <CardGiftcard sx={{ fontSize: 24, color: '#ff3f6c' }} />
                {appliedCard.name}
              </CardTitle>
              <RemoveButton onClick={handleRemove}>REMOVE</RemoveButton>
            </AppliedCardHeader>
            
            <AmountApplied>₹{appliedCard.value.toFixed(2)} Applied</AmountApplied>
            
            {/* Enhanced order summary */}
            <OrderSummary>
              <SummaryRow>
                <span>Order Total:</span>
                <span>₹{totalAmount}</span>
              </SummaryRow>
              <SummaryRow highlight>
                <span>Gift Card Discount:</span>
                <span>-₹{Math.min(appliedCard.value.toFixed(2), totalAmount)}</span>
              </SummaryRow>
              <SummaryRow bold highlight>
                <span>Net Payable:</span>
                <span>₹{netPayable}</span>
              </SummaryRow>
            </OrderSummary>
            
            {/* Pay Now button */}
            <PayNowButton 
              onClick={handlePayment} 
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'PROCESSING...' : `PAY NOW ₹${netPayable}`}
            </PayNowButton>
          </GiftCardApplied>
        </>
      )}

      {/* Render "add amount" gift cards first */}
      {!appliedCard && addAmountGiftCards && addAmountGiftCards.length > 0 && (
        <GiftCardList>
          {addAmountGiftCards.map(card => (
            <GiftCardItem key={card.id} style={{ backgroundColor: '#f5f5f6' }}>
              {/* Show image if available, else fallback to icon */}
              {card.baseUrl ? (
                <CardImage color={card.color}>
                  <img
                    src={card.baseUrl}
                    alt={card.name}
                    style={{ width: 36, height: 36, borderRadius: 4, objectFit: "cover" }}
                  />
                </CardImage>
              ) : (
                <CardImage color={card.color}>
                  <CardGiftcard sx={{ fontSize: 20, color: '#ff3f6c' }} />
                </CardImage>
              )}
              <CardContent>
                <CardInfo>
                  <CardName>{card.name}</CardName>
                </CardInfo>
                <CardOffers>
                  {card.offers.map((offer, index) => (
                    <OfferItem key={index}>
                      <LocalOfferOutlined sx={{ fontSize: 10, color: '#ff3f6c', marginTop: "2px" }} />
                      <span>{offer}</span>
                    </OfferItem>
                  ))}
                </CardOffers>
                <DiscountPreview>
                  Add ₹{card.value && card.value.toFixed ? card.value.toFixed(2) : card.value} more to get {card.discountType=='flat' ?? 'flat ₹'}{card.discountValue}{card.discountType == 'percentage' ? '% discount' : 'off'}
                </DiscountPreview>
                <NetPayablePreview>
                  Minimum order: ₹{card.minAmount}
                </NetPayablePreview>
              </CardContent>
              <CardActions>
                <CardApplyButton disabled style={{ backgroundColor: '#888'}}>
                  APPLY
                </CardApplyButton>
              </CardActions>
            </GiftCardItem>
          ))}
        </GiftCardList>
      )}

      {!appliedCard && (addAmountGiftCards.length > 0 || availableCards.length > 0) ? (
        <PayNowButton onClick={handlePayment} disabled={true}>
            PAY NOW
          </PayNowButton>
      ) : (
        // add a condition if isLoading then this will not render
        <>
          {!isLoading && addAmountGiftCards.length === 0 && availableCards.length === 0 && (
            // show a message no gift cards available
            <p style={{ color: '#ff3f6c', fontWeight: 'bold', textAlign: 'center' }}>
              No gift cards available.
            </p>
          )}
        </>
      )}

      {/* Payment iframe overlay */}
      {showPaymentIframe && (
        <PaymentIframeContainer>
          {/* Razorpay-styled payment UI */}
          <DummyUPIPaymentBox>
            <DummyHeader>
              <DummyBrand>
                {/* Use local Razorpay logo image */}
                <DummyLogo 
                  src={razorpayLogo}
                  alt="Razorpay"
                />
              </DummyBrand>
              <DummyOrder>Order ID: {paymentResponse.orderId}</DummyOrder>
              <DummyAmt>₹ {netPayable.toFixed(2)}</DummyAmt>
            </DummyHeader>
            <DummyPaySection>
              <DummyPayTitle>Scan the QR code to pay</DummyPayTitle>
              <DummyQRBox>
                <DummyQRImg
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=razorpay@okicici&pn=Razorpay&am=${netPayable}&tn=Payment for order ${paymentResponse.orderId}&cu=INR`}
                  alt="QR Code"
                />
                <DummyScanPay>Scan QR with any UPI app</DummyScanPay>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  Complete payment using your preferred UPI app
                </div>
                <DummyUPIIcons>
                  {/* Use local asset for GPay, direct URLs for others */}
                  <img src={gpayLogo} alt="Google Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" />
                </DummyUPIIcons>
                <DummyExpires>
                  This QR code expires in {paymentCountdown} seconds
                </DummyExpires>
              </DummyQRBox>
            </DummyPaySection>
            <DummyFooter>
              <DummySecurity>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                </svg>
                <span>100% Secure Payments</span>
              </DummySecurity>
              <DummyPoweredBy>
                Powered by Razorpay © {new Date().getFullYear()}
              </DummyPoweredBy>
            </DummyFooter>
          </DummyUPIPaymentBox>
          <LoadingMessage>
            Completing your payment... Redirecting in {paymentCountdown} seconds
          </LoadingMessage>
        </PaymentIframeContainer>
      )}
    </GiftCardContainer>
  );
};

export default GiftCard;