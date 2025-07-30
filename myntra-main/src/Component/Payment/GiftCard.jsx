import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const GiftCardContainer = styled.div`
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  max-width: 500px;
`;

const GiftCardHeading = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #282c3f;
  text-transform: uppercase;
`;

const GiftCardInputContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
  align-items: center;
`;

const GiftCardInput = styled.input`
  flex: 1;
  box-sizing: border-box;
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
  padding: 10px 30px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #e33862;
  }
`;

const CardsContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-top: 15px;
  border-radius: 4px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to bottom, white, transparent);
    pointer-events: none;
    z-index: 1;
    display: ${props => props.isScrolledTop ? 'none' : 'block'};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to top, white, transparent);
    pointer-events: none;
    z-index: 1;
    display: ${props => props.isScrolledBottom ? 'none' : 'block'};
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const GiftCardItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  margin: 0 5px;
  border-bottom: 1px solid #f5f5f6;
`;

const GiftCardImage = styled.img`
  width: 50px;
  height: 40px;
  margin-right: 15px;
  object-fit: contain;
  border: 1px solid #f5f5f6;
  padding: 5px;
  border-radius: 4px;
`;

const GiftCardDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const GiftCardName = styled.h4`
  font-size: 16px;
  margin-bottom: 5px;
  color: #282c3f;
`;

const GiftCardValue = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #282c3f;
  margin-bottom: 5px;
  &::before {
    content: "₹";
  }
`;

const GiftCardDescription = styled.p`
  font-size: 12px;
  color: #94969f;
  margin: 0;
  line-height: 1.4;
`;

const ApplyCardButton = styled.button`
  background-color: white;
  color: #ff3f6c;
  border: 1px solid #ff3f6c;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 15px;
  flex-shrink: 0;
  &:hover {
    background-color: rgba(255, 63, 108, 0.05);
  }
`;

const GiftCardInfoMessage = styled.p`
  font-size: 12px;
  color: #ff3f6c;
  margin-top: 5px;
  text-align: center;
`;

const GiftCardAppliedSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f6;
  border-radius: 4px;
`;

const AppliedCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AppliedCardInfo = styled.div`
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  color: #ff3f6c;
  border: none;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PayButton = styled.button`
  background-color: ${props => props.disabled ? "#b4b4b4" : "#ff3f6c"};
  color: white;
  width: 100%;
  border: none;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  margin-top: 30px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.disabled ? "#b4b4b4" : "#e33862"};
  }
`;

const GiftCard = ({ onApply, totalAmount }) => {
  const navigate = useNavigate();
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedCard, setAppliedCard] = useState(null);
  const [message, setMessage] = useState('');
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Fetch gift card data from API
  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        setLoading(true);
        // Replace empty URL with your actual API endpoint when available
        const response = await fetch('');
        
        // For now, use mock data until API is available
        // When you have the actual API URL, replace this with:
        // const data = await response.json();
        const data = [
          {
            id: 1,
            name: "Myntra Gift Card",
            code: "MYNTRA500",
            value: 500,
            description: "Myntra exclusive gift card for fashion purchases",
            image: "https://constant.myntassets.com/pwa/assets/img/myntra-logo-small.png"
          },
          {
            id: 2,
            name: "Shopping Reward Card",
            code: "SHOP1000",
            value: 1000,
            description: "Special rewards for loyal customers",
            image: "https://constant.myntassets.com/pwa/assets/img/Gift-card.png"
          },
          {
            id: 3,
            name: "Premium Gift Voucher",
            code: "PREMIUM2000",
            value: 2000,
            description: "Premium shopping experience with extra savings",
            image: "https://constant.myntassets.com/pwa/assets/img/gift-card-premium.png"
          }
        ];
        
        setGiftCards(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gift cards:", err);
        setError("Failed to load gift cards. Please try again later.");
        setLoading(false);
      }
    };

    fetchGiftCards();
  }, []);

  const handleScroll = (e) => {
    setIsScrolledTop(e.target.scrollTop === 0);
    setIsScrolledBottom(
      Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) < 1
    );
  };

  const handleApplyCode = () => {
    if (!giftCardCode.trim()) {
      setMessage('Please enter a valid gift card code');
      return;
    }

    const card = giftCards.find(
      card => card.code.toLowerCase() === giftCardCode.toLowerCase()
    );
    
    if (card) {
      applyGiftCard(card);
    } else {
      setMessage('Invalid gift card code. Please try again.');
    }
    
    setGiftCardCode('');
  };

  const applyGiftCard = (card) => {
    if (appliedCard) {
      setMessage('You already have an applied gift card. Please remove it first.');
      return;
    }
    setAppliedCard(card);
    // Only discount up to the total amount
    const discountValue = Math.min(card.value, totalAmount);
    setDiscount(discountValue);
    onApply(discountValue);
    setMessage(`Gift card of ₹${discountValue} applied successfully!`);
  };

  const handleRemoveGiftCard = () => {
    setAppliedCard(null);
    setDiscount(0);
    onApply(0);
    setMessage('Gift card removed');
  };

  const handlePayNow = async () => {
    // Placeholder for your payment logic
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      navigate("/ordersuccess");
    }, 1000);
  };

  // Loading state
  if (loading) {
    return (
      <GiftCardContainer>
        <GiftCardHeading>Gift Card</GiftCardHeading>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          Loading gift card options...
        </div>
      </GiftCardContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <GiftCardContainer>
        <GiftCardHeading>Gift Card</GiftCardHeading>
        <div style={{ color: 'red', textAlign: 'center', padding: '20px 0' }}>
          {error}
        </div>
      </GiftCardContainer>
    );
  }

  return (
    <GiftCardContainer>
      <GiftCardHeading>Gift Card</GiftCardHeading>
      
      <GiftCardInputContainer>
        <GiftCardInput
          type="text"
          placeholder="Enter Gift Card Code"
          value={giftCardCode}
          onChange={(e) => setGiftCardCode(e.target.value)}
        />
        
        <ApplyButton onClick={handleApplyCode}>
          APPLY
        </ApplyButton>
      </GiftCardInputContainer>
      
      {message && <GiftCardInfoMessage>{message}</GiftCardInfoMessage>}
      
      {appliedCard ? (
        <>
          <GiftCardAppliedSection>
            <AppliedCard>
              <AppliedCardInfo>
                <GiftCardImage src={appliedCard.image} alt={appliedCard.name} />
                <GiftCardDetails>
                  <GiftCardName>{appliedCard.name}</GiftCardName>
                  <GiftCardValue>{appliedCard.value} Applied</GiftCardValue>
                </GiftCardDetails>
              </AppliedCardInfo>
              <RemoveButton onClick={handleRemoveGiftCard}>REMOVE</RemoveButton>
            </AppliedCard>
            <div style={{ marginTop: 10 }}>
              <span style={{ fontWeight: 600 }}>Order Total: </span>₹{totalAmount}<br />
              <span style={{ fontWeight: 600, color: "#ff3f6c" }}>Gift Card Discount: </span>-₹{discount}<br />
              <span style={{ fontWeight: 600 }}>Net Payable: </span>₹{Math.max(totalAmount - discount, 0)}
            </div>
          </GiftCardAppliedSection>
          <PayButton 
            onClick={handlePayNow} 
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? 'PROCESSING...' : `PAY NOW ₹${Math.max(totalAmount - discount, 0)}`}
          </PayButton>
        </>
      ) : (
        <>
          <GiftCardHeading>Available Gift Cards</GiftCardHeading>
          {giftCards.length > 0 ? (
            <>
              <CardsContainer 
                onScroll={handleScroll}
                isScrolledTop={isScrolledTop}
                isScrolledBottom={isScrolledBottom}
              >
                {giftCards.map((card) => (
                  <GiftCardItem key={card.id}>
                    <GiftCardImage src={card.image} alt={card.name} />
                    <GiftCardDetails>
                      <GiftCardName>{card.name}</GiftCardName>
                      <GiftCardValue>{card.value}</GiftCardValue>
                      <GiftCardDescription>{card.description}</GiftCardDescription>
                    </GiftCardDetails>
                    <ApplyCardButton onClick={() => applyGiftCard(card)}>
                      APPLY
                    </ApplyCardButton>
                  </GiftCardItem>
                ))}
              </CardsContainer>
              
              <PayButton disabled={true}>
                PAY NOW
              </PayButton>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              No gift cards available at the moment.
            </div>
          )}
        </>
      )}
    </GiftCardContainer>
  );
};

export default GiftCard;