import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CardGiftcard, LocalOfferOutlined } from "@mui/icons-material";
import { makeWoohooPaymentXHR } from '../../services/RazorpayService';
import { useNavigate } from 'react-router-dom';

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
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const PaymentIframe = styled.iframe`
  width: 80%;
  height: 80%;
  border: none;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const LoadingMessage = styled.div`
  color: white;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

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
  const [paymentCountdown, setPaymentCountdown] = useState(10);
  
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
        
        const apiUrl = 'http://localhost:5000/api/giftcards/search';
        
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
    // Set success message and apply discount
    setSuccessMessage(`Gift card of ₹${card.value} applied successfully!`);
    
    // Store the applied card info
    setAppliedCard(card);
    
    // Notify parent component
    onApply(card.value);
  };

  const handleRemove = () => {
    setAppliedCard(null);
    setSuccessMessage('');
    onApply(0); // Reset the discount
  };

  // Calculate net payable after gift card
  const netPayable = Math.max(0, totalAmount - (appliedCard?.value || 0));

  // Add a function to handle payment
  const handlePayment = () => {
    if (appliedCard) {
      setIsProcessingPayment(true);
      
      makeWoohooPaymentXHR()
        .then(result => {
          console.log("Payment API response:", result);
          
          if (result && result.success) {
            const data = result.data;
            
            // Extract the redirect URL from the payment response
            if (data && data.payments && data.payments.redirect && data.payments.redirect.url) {
              const redirectUrl = data.payments.redirect.url;
              console.log("Payment redirect URL:", redirectUrl);
              
              // Show the iframe with the payment URL
              setPaymentUrl(redirectUrl);
              setShowPaymentIframe(true);
              
              // Start countdown for auto-redirect
              setPaymentCountdown(10);
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
              console.error("Payment redirect URL not found in response");
              // Still proceed to success page for demo purposes
              setTimeout(() => {
                navigate('/ordersuccess');
              }, 2000);
            }
          } else {
            console.error("Payment failed:", result?.error || "Unknown error");
            setIsProcessingPayment(false);
          }
        })
        .catch(error => {
          console.error("Payment error:", error);
          setIsProcessingPayment(false);
        });
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

  return (
    <GiftCardContainer>
      <GiftCardHeader>GIFT CARD</GiftCardHeader>
      {isLoading && <p>Loading gift cards...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}. Using default gift cards.</p>}

      {/* Render "add amount" gift cards first */}
      {addAmountGiftCards && addAmountGiftCards.length > 0 && (
        <GiftCardList>
          {addAmountGiftCards.map(card => (
            <GiftCardItem key={card.id}>
              <CardImage color={card.color}>
                <CardGiftcard sx={{ fontSize: 20, color: '#ff3f6c' }} />
              </CardImage>
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
                  Add ₹{card.value} more to your cart to unlock this gift card!
                </DiscountPreview>
                <NetPayablePreview>
                  Minimum order: ₹{card.minAmount}
                </NetPayablePreview>
              </CardContent>
              <CardActions>
                <CardApplyButton disabled>
                  APPLY
                </CardApplyButton>
              </CardActions>
            </GiftCardItem>
          ))}
        </GiftCardList>
      )}

      {/* Render available gift cards */}
      {!appliedCard ? (
        <>
          <GiftCardList>
            {availableCards.map(card => (
              <GiftCardItem key={card.id}>
                <CardImage color={card.color}>
                  <CardGiftcard sx={{ fontSize: 20, color: '#ff3f6c' }} />
                </CardImage>
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
                  <DiscountPreview>You save: ₹{Math.min(card.value, totalAmount)}</DiscountPreview>
                  <NetPayablePreview>Net payable: ₹{Math.max(0, totalAmount - card.value)}</NetPayablePreview>
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
          
          {/* Add disabled PAY NOW button */}
          <PayNowButton disabled={true}>
            PAY NOW
          </PayNowButton>
        </>
      ) : (
        <>
          <SuccessMessage>Gift card of ₹{appliedCard.value} applied successfully!</SuccessMessage>
          <GiftCardApplied>
            <AppliedCardHeader>
              <CardTitle>
                <CardGiftcard sx={{ fontSize: 24, color: '#ff3f6c' }} />
                {appliedCard.name}
              </CardTitle>
              <RemoveButton onClick={handleRemove}>REMOVE</RemoveButton>
            </AppliedCardHeader>
            
            <AmountApplied>₹{appliedCard.value} Applied</AmountApplied>
            
            {/* Enhanced order summary */}
            <OrderSummary>
              <SummaryRow>
                <span>Order Total:</span>
                <span>₹{totalAmount}</span>
              </SummaryRow>
              <SummaryRow highlight>
                <span>Gift Card Discount:</span>
                <span>-₹{Math.min(appliedCard.value, totalAmount)}</span>
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
      
      {/* Payment iframe overlay */}
      {showPaymentIframe && (
        <PaymentIframeContainer>
          <PaymentIframe 
            ref={iframeRef}
            src={paymentUrl}
            title="Payment Gateway"
            allowFullScreen
          />
          <LoadingMessage>
            Completing your payment... Redirecting in {paymentCountdown} seconds
          </LoadingMessage>
        </PaymentIframeContainer>
      )}
    </GiftCardContainer>
  );
};

export default GiftCard;