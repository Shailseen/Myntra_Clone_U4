import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import CartFoot from "../Cart/CartFoot";
import {
  BagCheckout,
  DotsCheckout,
  Logo,
  NavCheckOutSteps,
  NavContainer,
  NavLogo,
  NavSecure,
  PaymentCheckout,
  SecureLogo,
  SecureN,
} from "../Cart/CartNav.element";
import {
  AddressCheckoutAdd,
  AllPriceDiv,
  AvailableofferDiv,
  AvaOffer,
  CardCD,
  CardCDdiv,
  CardName,
  CardNumber,
  CashOnDel,
  ChooseMode,
  Cod,
  Container,
  CoupDis,
  CoupDisDiv,
  CoupDisrs,
  CoviFee,
  CoviFeediv,
  CoviFeeKM,
  CoviFeers,
  Cvv,
  Dmrp,
  DmrpDiv,
  Dmrprs,
  DotsCheckoutAdd,
  DotsCheckoutP,
  Emi,
  Emidiv,
  Expiry,
  ExpiryCvv,
  FirstOffer,
  FormRightDiv,
  FullpayemntPage,
  Giftleft,
  GiftRight,
  HaveGift,
  HaveGiftLabel,
  NetBank,
  NetBankdiv,
  PayemntMain,
  PaymentCheckoutP,
  PaymentLeft,
  PaymentMethods,
  PaymentMethodsInput,
  PayNowButton,
  PriceDetailsT,
  Tmrp,
  TmrpDiv,
  Tmrprs,
  TopLA,
  TotalAmount,
  TotalAmountdiv,
  TotalAmountrs,
  TotalPriceDiv,
  Upi,
  Upidiv,
  UpiIcon,
  Wallet,
  Walletdiv,
} from "./Payment.element";
import myntraLogo from "../../Images/myntraLogo.png";
import secure from "../../Images/secure.png";
import {
  AccountBalanceOutlined,
  AccountBalanceWalletOutlined,
  CardGiftcard,
  CreditCardOutlined,
  CurrencyRupeeOutlined,
  DiscountOutlined,
  PaymentsOutlined,
  QrCodeScanner,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GiftCard from "./GiftCard"; // Import the new GiftCard component
import { selectCartItems, selectCartTotal, selectGiftCard, selectFinalTotal } from '../../redux/cartSlice';
import { makeGiftCardPayment, makeWoohooPaymentXHR, testApiCallOnly } from '../../services/RazorpayService';

// Use environment variable for backend API base URL
const API_BASE_URL = process.env.REACT_APP_BACKEND_API;

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [creditCardNum, setCreditCardNum] = useState("#### #### #### ####");
  const [cardHolder, setCardHolder] = useState("Your Full Name");
  const [expireMonthYear, setExpireMonthYear] = useState("MM/YY");
  const [cvv, setCvv] = useState("CVV");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-debit");
  const [availableGiftCards, setAvailableGiftCards] = useState([]);
  const [addAmountGiftCards, setAddAmountGiftCards] = useState([]);
  const [isLoadingGiftCards, setIsLoadingGiftCards] = useState(true);
  const [giftCardError, setGiftCardError] = useState(null);

  // Get fresh data directly from Redux store
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const giftCard = useSelector(selectGiftCard);
  const finalTotal = useSelector(selectFinalTotal);
  
  // Calculate item count with quantities
  const itemCount = cartItems.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  
  // Gift card state from Redux
  const [giftCardApplied, setGiftCardApplied] = useState(!!giftCard);
  const [appliedGiftCard, setAppliedGiftCard] = useState(null);
  const [giftCardDiscount, setGiftCardDiscount] = useState(giftCard ? giftCard.value : 0);
  
  // Add fallback logic if bagData is empty
  const bagData = useSelector((state) => state.bag.bagData);
  
  // Calculate totals first, so they can be used by useEffect hooks later
  let totalMRP = 0;
  let totalAmount = 0;

  // Check if bagData has items
  if (bagData && bagData.length > 0) {
    bagData.forEach((e) => {
      totalMRP += Math.floor(Number(e.off_price || 0));
      totalAmount += Math.floor(Number(e.off_price) * ((100 - Number(e.discount)) / 100));
    });
  } else {
    // Fallback to cartTotal if bagData is empty
    totalMRP = cartTotal || 0;
    totalAmount = finalTotal || cartTotal || 0;
  }

  let totalDiscount = 0;
  
  // Calculate the final amount after gift card discount
  const calculatedFinalTotal = Math.max(0, totalAmount - giftCardDiscount);

  // Effect to sync with Redux gift card state
  useEffect(() => {
    if (giftCard) {
      setGiftCardApplied(true);
      setGiftCardDiscount(giftCard.value);
    } else {
      setGiftCardApplied(false);
      setGiftCardDiscount(0);
    }
  }, [giftCard]);

  // Fetch gift cards when component mounts (page loads)
  useEffect(() => {
    const fetchGiftCards = async () => {
      setIsLoadingGiftCards(true);
      setGiftCardError(null);

      try {
        console.log("Fetching gift cards on payment page load...");
        console.log('env value ', process.env.REACT_APP_BACKEND_API);
        
        const apiUrl = `${API_BASE_URL}/api/giftcards/search`;
        const payload = {
          "amount": totalAmount,
          "code": "Myntra"
        };

        console.log("Sending gift card request with payload:", payload);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        // --- DEBUG: Log the hits with their _isSuggestion flag
        if (data && data.hits && data.hits.hits && Array.isArray(data.hits.hits)) {
          console.log("Gift card API hits:", data.hits.hits.map(h => ({
            id: h._id,
            _isSuggestion: h._isSuggestion,
            sort: h.sort,
            name: h._source?.name
          })));
          // --- END DEBUG

          // FIX: Use strict comparison for _isSuggestion flag (it may be boolean or string)
          const searchHits = data.hits.hits.filter(hit => hit._isSuggestion === false || hit._isSuggestion === "false");
          const suggestionHits = data.hits.hits.filter(hit => hit._isSuggestion === true || hit._isSuggestion === "true");

          // Map to card format
          const apiCards = searchHits.map((hit, index) => {
            const source = hit._source || {};
            return {
              id: hit._id || `api-${index}`,
              name: source.name || 'Gift Card',
              value: Math.abs(totalAmount - hit.sort),
              code: source.id || `GC-${index + 1000}`,
              color: ['#ffeae9', '#fff1e0', '#e9f7ff', '#edfff0'][index % 4],
              offers: [
                `${source.description?.substring(0, 15) || 'Gift Card'}`
              ],
              // Add the baseUrl from the source
              baseUrl: source.baseUrl || null
            };
          });

          const addCards = suggestionHits.map((hit, index) => {
            const source = hit._source || {};
            return {
              id: hit._id || `addapi-${index}`,
              name: source.name || 'Gift Card',
              value: Math.abs(source.minimumOrderValue-totalAmount ?? 0),
              code: source.id || `GC-${index + 2000}`,
              color: ['#f0e9ff', '#e0f7fa', '#fffde7', '#fce4ec'][index % 4],
              offers: [
                `${source.description?.substring(0, 15) || 'Gift Card'}`
              ],
              minAmount: source.minimumOrderValue || 0,
              discountType: source.discountType,
              discountValue: source.discountValue,
              // Add the baseUrl from the source
              baseUrl: source.baseUrl || null
            };
          });

          setAvailableGiftCards(apiCards);
          setAddAmountGiftCards(addCards);
        } else {
          setAvailableGiftCards(mockGiftCards);
          setAddAmountGiftCards([]);
        }
      } catch (err) {
        setGiftCardError(err.message);
        setAvailableGiftCards(mockGiftCards);
        setAddAmountGiftCards([]);
      } finally {
        setIsLoadingGiftCards(false);
      }
    };

    fetchGiftCards();
  }, [totalAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Payment submission started...");
    
    // If using Razorpay for payments
    if (selectedPaymentMethod === "credit-debit") {
      const orderInfo = {
        orderId: `ORD_${Date.now()}`,
        name: "Test User",
        email: "test@example.com",
        phone: "9999999999",
        address: "Test Address"
      };
      
      console.log("Processing payment for amount:", calculatedFinalTotal);
      
      // Use testApiCallOnly to prevent automatic navigation
      testApiCallOnly()
        .then(result => {
          console.log("API call result:", result);
          // Don't navigate automatically - you can uncomment this when ready
          // if (result.success) {
          //   navigate("/ordersuccess");
          // }
        })
        .catch(error => {
          console.error("Payment failed:", error);
        });
    } else {
      // For other payment methods, just make API call without navigation
      makeWoohooPaymentXHR()
        .then(result => {
          console.log("Payment API response:", result);
          // Don't navigate automatically - you can uncomment this when ready
          // if (result.success) {
          //   console.log("Payment successful!");
          //   navigate("/ordersuccess");
          // } else {
          //   console.error("Payment failed:", result.error);
          // }
        })
        .catch(error => {
          console.error("Payment error:", error);
        });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleGiftCardApply = (amount, card) => {
    setGiftCardApplied(true);
    setGiftCardDiscount(parseFloat(amount));
    setAppliedGiftCard(card || null);
  };
  
  // Fix the payment methods with proper labels
  const paymentMethods = [
    { id: "cod", label: "Cash On Delivery", icon: CurrencyRupeeOutlined },
    { id: "credit-debit", label: "Credit/Debit Card", icon: CreditCardOutlined },
    { id: "upi", label: "GooglePay/PhonePay/UPI", icon: QrCodeScanner },
    { id: "wallet", label: "Paytm/Payzapp/Wallets", icon: AccountBalanceWalletOutlined },
    { id: "netbanking", label: "Net Banking", icon: AccountBalanceOutlined },
    { id: "emi", label: "EMI/Pay Later", icon: PaymentsOutlined },
    { id: "giftcard", label: "Gift Card", icon: CardGiftcard }
  ];

  // Icon color based on selection
  const getIconColor = (method) => {
    return selectedPaymentMethod === method ? "#ff3f6c" : "#777";
  };

  // Styled component for payment method options
  const PaymentMethodOption = styled.div`
    background-color: ${props => props.selected ? "#fff1f4" : "#f5f5f6"};
    border-left: ${props => props.selected ? "5px solid #ff3f6c" : "none"};
    cursor: pointer;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  `;

  return (
    <Container>
      <NavContainer>
        <NavLogo>
          <Logo src={myntraLogo} onClick={() => navigate("/")} />
        </NavLogo>
        <NavCheckOutSteps>
          <BagCheckout>BAG</BagCheckout>
          <DotsCheckoutAdd>---------</DotsCheckoutAdd>
          <AddressCheckoutAdd>ADDRESS</AddressCheckoutAdd>
          <DotsCheckoutP>---------</DotsCheckoutP>
          <PaymentCheckoutP>PAYMENT</PaymentCheckoutP>
        </NavCheckOutSteps>
        <NavSecure>
          <SecureLogo src={secure} />
          <SecureN>100% SECURE</SecureN>
        </NavSecure>
      </NavContainer>
      <FullpayemntPage>
        <PaymentLeft>
          <AvailableofferDiv>
            <TopLA>
              <DiscountOutlined sx={{ width: "25px", height: "25px" }} />
              <AvaOffer>Bank Offers</AvaOffer>
            </TopLA>
            <FirstOffer>
              10% Instant Discount on IDFC FIRST Bank Cards onamin spend of Rs
              2,500.TCA
            </FirstOffer>
            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: "#ff3f6c",
                      marginLeft: "-495px",
                      fontSize: "12px",
                    }}
                  />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  sx={{
                    color: "#ff3f6c",
                    fontSize: "12px",
                    marginBottom: "none",
                  }}
                >
                  Show More
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontSize: "12px", marginBottom: "5px" }}>
                  5% Unlimited Cashback on Flipkart Axis Bank Credit Card. TCA
                </Typography>
                <Typography sx={{ fontSize: "12px", marginBottom: "5px" }}>
                  10% Cashback upto Rs 100 on Paytm Postpaid transaction onamin
                  spend of Rs 1000. TCA
                </Typography>
                <Typography sx={{ fontSize: "12px", marginBottom: "5px" }}>
                  15% Cashback upto Rs 150 on Freecharge Paylater transaction.
                  TCA
                </Typography>
                <Typography sx={{ fontSize: "12px", marginBottom: "5px" }}>
                  10% Cashback upto Rs 200 on Ola Money Postpaid or wallet
                  transaction onamin spend of Rs 1000. TCA
                </Typography>
                <Typography sx={{ fontSize: "12px", marginBottom: "5px" }}>
                  Upto Rs 500 Cashback on Mobikwik Wallet Transactions onamin
                  spend of Rs 999.Use code MBK500 on Mobikwik.TCA
                </Typography>
                <Typography sx={{ fontSize: "12px", marginBottom: "5px" }}>
                  5% Cashback upto Rs 150 onaminimum spend of Rs 1,500 with
                  PayZapp. TCA
                </Typography>
              </AccordionDetails>
            </Accordion>
          </AvailableofferDiv>
          <ChooseMode>Choose Payment Mode</ChooseMode>
          <PayemntMain>
            <PaymentMethods>
              {paymentMethods.map(method => (
                <PaymentMethodOption 
                  key={method.id}
                  selected={selectedPaymentMethod === method.id}
                  onClick={() => handlePaymentMethodChange(method.id)}
                >
                  <method.icon 
                    sx={{ 
                      width: "25px", 
                      height: "25px",
                      color: getIconColor(method.id)
                    }} 
                  />
                  {method.id === "cod" ? (
                    <Cod>{method.label}</Cod>
                  ) : method.id === "credit-debit" ? (
                    <CardCD>{method.label}</CardCD>
                  ) : method.id === "upi" ? (
                    <Upi>{method.label}</Upi>
                  ) : method.id === "wallet" ? (
                    <Wallet>{method.label}</Wallet>
                  ) : method.id === "netbanking" ? (
                    <NetBank>{method.label}</NetBank>
                  ) : method.id === "emi" ? (
                    <Emi>{method.label}</Emi>
                  ) : (
                    <Emi>{method.label}</Emi>
                  )}
                </PaymentMethodOption>
              ))}
            </PaymentMethods>
            
            {selectedPaymentMethod === "credit-debit" && (
              <PaymentMethodsInput onSubmit={handleSubmit}>
                <ChooseMode>CREDIT/DEBIT CARD</ChooseMode>
                <CardNumber
                  placeholder="Card Number"
                  onChange={(e) => e.target.value}
                  pattern={"^[0-9]{12}$"}
                  maxlength="4"
                  required
                />
                <CardName
                  placeholder="Name On card"
                  onChange={(e) => e.target.value}
                  pattern={"^[A-Za-z]{5,16}$"}
                  required
                />
                <ExpiryCvv>
                  <Expiry
                    type="month/year"
                    placeholder="Valid Thru (MM/YY)"
                    onChange={(e) => e.target.value}
                    pattern={"^[0-9]{4}$"}
                    maxlength={4}
                    required
                  />
                  <Cvv
                    type="number"
                    placeholder="CVV"
                    onChange={(e) => e.target.value}
                    pattern={"^[0-9]{03}$"}
                    maxlength={3}
                    required
                  />
                </ExpiryCvv>
                <PayNowButton type="submit" value={`PAY NOW ₹${calculatedFinalTotal}`} />
              </PaymentMethodsInput>
            )}
            
            {selectedPaymentMethod === "giftcard" && (
              <GiftCard 
                onApply={(amount, card) => handleGiftCardApply(amount, card)} 
                totalAmount={totalAmount}
                availableCards={availableGiftCards}
                isLoading={isLoadingGiftCards}
                error={giftCardError}
                skipFetch={true}
                addAmountGiftCards={addAmountGiftCards} // Pass new prop
              />
            )}
            
            {selectedPaymentMethod !== "credit-debit" && selectedPaymentMethod !== "giftcard" && (
              <PaymentMethodsInput onSubmit={handleSubmit}>
                <ChooseMode>{selectedPaymentMethod.toUpperCase().replace("-", " ")}</ChooseMode>
                <p>Payment method details would be here</p>
                <PayNowButton type="submit" value={`PAY NOW ₹${calculatedFinalTotal}`} />
              </PaymentMethodsInput>
            )}
          </PayemntMain>
          <HaveGift>
            <Giftleft>
              <CardGiftcard sx={{ width: "25px", height: "25px" }} />
              <HaveGiftLabel>Have a Gift Card?</HaveGiftLabel>
            </Giftleft>
            <GiftRight onClick={() => handlePaymentMethodChange("giftcard")}>APPLY GIFT CARD</GiftRight>
          </HaveGift>
        </PaymentLeft>

        <FormRightDiv>
          <AllPriceDiv>
            <PriceDetailsT>
              PRICE DETAILS ({itemCount} Items)
            </PriceDetailsT>
            <TmrpDiv>
              <Tmrp>TOTAL MRP</Tmrp>
              <Tmrprs>₹{totalMRP}</Tmrprs> {/* Change from totalAmount to totalMRP */}
            </TmrpDiv>
            <DmrpDiv>
              <Dmrp>Discount on MRP</Dmrp>
              <Dmrprs>-₹{totalDiscount}</Dmrprs>
            </DmrpDiv>
            <CoupDisDiv>
              <CoupDis>Coupon Discount</CoupDis>
              <CoupDisrs>Apply Coupon</CoupDisrs>
            </CoupDisDiv>
            {/* Show gift card discount if applied */}
            {giftCardApplied && giftCardDiscount > 0 && (
              <DmrpDiv>
                <Dmrp>Gift Card Discount</Dmrp>
                <Dmrprs>₹{giftCardDiscount.toFixed(2)}</Dmrprs>
              </DmrpDiv>
            )}
            <CoviFeediv>
              <CoviFee>Convenience Fee</CoviFee>
              <CoviFeeKM>Know More</CoviFeeKM>
              <CoviFeers>FREE</CoviFeers>
            </CoviFeediv>
          </AllPriceDiv>
          <TotalPriceDiv>
            <TotalAmountdiv>
              <TotalAmount>Total Amount</TotalAmount>
              <TotalAmountrs>₹{calculatedFinalTotal}</TotalAmountrs>
            </TotalAmountdiv>
          </TotalPriceDiv>
        </FormRightDiv>
      </FullpayemntPage>
      
      <CartFoot />
    </Container>
  );
};

// Import the mock gift cards at the top of the file
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
      'Exclusive for premium users',
      'Valid for 1 year'
    ]
  },
  {
    id: 'gc3',
    name: 'Festival Gift Card',
    value: 1500,
    code: 'MYN1500',
    color: '#e9f7ff',
    offers: [
      'Special festival discount',
      'Non-refundable'
    ]
  },
  {
    id: 'gc4',
    name: 'New Year Gift Card',
    value: 2000,
    code: 'MYN2000',
    color: '#edfff0',
    offers: [
      'Welcome offer for new users',
      'Minimum purchase of 3000'
    ]
  }
];

export default Payment;