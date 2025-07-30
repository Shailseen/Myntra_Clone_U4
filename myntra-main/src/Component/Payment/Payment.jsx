import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from 'styled-components';

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
import { useSelector } from "react-redux";
import GiftCard from "./GiftCard"; // Import the new GiftCard component

const Payment = () => {
  const navigate = useNavigate();
  const [creditCardNum, setCreditCardNum] = useState("#### #### #### ####");
  const [cardHolder, setCardHolder] = useState("Your Full Name");
  const [expireMonthYear, setExpireMonthYear] = useState("MM/YY");
  const [cvv, setCvv] = useState("CVV");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-debit");
  const [giftCardApplied, setGiftCardApplied] = useState(false);
  const [giftCardDiscount, setGiftCardDiscount] = useState(0);

  const handleSubmit = (e) => {
    console.log("Hello");
    navigate("/ordersuccess");
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleGiftCardApply = (amount) => {
    setGiftCardApplied(true);
    setGiftCardDiscount(amount);
  };
  
  const bagData = useSelector((state) => state.bag.bagData);

  let totalAmount = 0;
  bagData?.map(
    (e) =>
      (totalAmount += Math.floor(
        Number(e.off_price) * ((100 - Number(e.discount)) / 100)
      ))
  );

  let totalMRP = 0;
  bagData?.map((e) => (totalMRP += Math.floor(Number(e.off_price))));

  let totalDiscount = totalMRP - totalAmount;
  
  // Calculate final total after gift card discount
  const finalTotal = totalAmount - giftCardDiscount > 0 ? totalAmount - giftCardDiscount : 0;

  // Fix the selection highlight for gift card
  const getPaymentMethodColor = (method) => {
    return selectedPaymentMethod === method ? "#ff3f6c" : "";
  };
  
  const getPaymentMethodStyle = (method) => {
    return {
      backgroundColor: selectedPaymentMethod === method ? "#fff1f4" : "",
      borderLeft: selectedPaymentMethod === method ? "5px solid #ff3f6c" : "",
    };
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
  
  // Icon color based on selection
  const getIconColor = (method) => {
    return selectedPaymentMethod === method ? "#ff3f6c" : "#777";
  };

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
              <PaymentMethodOption 
                selected={selectedPaymentMethod === "cod"}
                onClick={() => handlePaymentMethodChange("cod")}
              >
                <CurrencyRupeeOutlined sx={{ 
                  width: "25px", 
                  height: "25px",
                  color: getIconColor("cod")
                }} />
                <Cod>Cash On Delivery</Cod>
              </PaymentMethodOption>
              
              <PaymentMethodOption 
                selected={selectedPaymentMethod === "credit-debit"}
                onClick={() => handlePaymentMethodChange("credit-debit")}
              >
                <CreditCardOutlined
                  sx={{ 
                    width: "25px", 
                    height: "25px", 
                    color: getIconColor("credit-debit") 
                  }}
                />
                <CardCD>Credit/Debit Card</CardCD>
              </PaymentMethodOption>
              
              <PaymentMethodOption 
                selected={selectedPaymentMethod === "upi"}
                onClick={() => handlePaymentMethodChange("upi")}
              >
                <QrCodeScanner sx={{ 
                  width: "25px", 
                  height: "25px",
                  color: getIconColor("upi")
                }} />
                <Upi>GooglePay/PhonePay/Upi</Upi>
              </PaymentMethodOption>
              
              <PaymentMethodOption 
                selected={selectedPaymentMethod === "wallet"}
                onClick={() => handlePaymentMethodChange("wallet")}
              >
                <AccountBalanceWalletOutlined
                  sx={{ 
                    width: "25px", 
                    height: "25px",
                    color: getIconColor("wallet")
                  }}
                />
                <Wallet>Paytm/Payzapp/Wallets</Wallet>
              </PaymentMethodOption>
              
              <PaymentMethodOption 
                selected={selectedPaymentMethod === "netbanking"}
                onClick={() => handlePaymentMethodChange("netbanking")}
              >
                <AccountBalanceOutlined
                  sx={{ 
                    width: "25px", 
                    height: "25px",
                    color: getIconColor("netbanking")
                  }}
                />
                <NetBank>Net Banking</NetBank>
              </PaymentMethodOption>
              
              <PaymentMethodOption 
                selected={selectedPaymentMethod === "emi"}
                onClick={() => handlePaymentMethodChange("emi")}
              >
                <PaymentsOutlined sx={{ 
                  width: "25px", 
                  height: "25px",
                  color: getIconColor("emi")
                }} />
                <Emi>EMI/Pay Later</Emi>
              </PaymentMethodOption>
              
              <PaymentMethodOption 
                selected={selectedPaymentMethod === "giftcard"}
                onClick={() => handlePaymentMethodChange("giftcard")}
              >
                <CardGiftcard sx={{ 
                  width: "25px", 
                  height: "25px", 
                  color: getIconColor("giftcard") 
                }} />
                <Emi>Gift Card</Emi>
              </PaymentMethodOption>
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
                <PayNowButton type="submit" />
              </PaymentMethodsInput>
            )}
            
            {selectedPaymentMethod === "giftcard" && (
              <GiftCard onApply={handleGiftCardApply} totalAmount={totalAmount} />
            )}
            
            {selectedPaymentMethod !== "credit-debit" && selectedPaymentMethod !== "giftcard" && (
              <PaymentMethodsInput onSubmit={handleSubmit}>
                <ChooseMode>{selectedPaymentMethod.toUpperCase().replace("-", " ")}</ChooseMode>
                <p>Payment method details would be here</p>
                <PayNowButton type="submit" />
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
              PRICE DETAILS ({bagData.length} Items)
            </PriceDetailsT>
            <TmrpDiv>
              <Tmrp>TOTAL MRP</Tmrp>
              <Tmrprs>₹{totalMRP}</Tmrprs>
            </TmrpDiv>
            <DmrpDiv>
              <Dmrp>Discount on MRP</Dmrp>
              <Dmrprs>-₹{totalDiscount}</Dmrprs>
            </DmrpDiv>
            <CoupDisDiv>
              <CoupDis>Coupon Discount</CoupDis>
              <CoupDisrs>Apply Coupon</CoupDisrs>
            </CoupDisDiv>
            {giftCardApplied && (
              <DmrpDiv>
                <Dmrp>Gift Card Discount</Dmrp>
                <Dmrprs>-₹{giftCardDiscount}</Dmrprs>
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
              <TotalAmountrs>₹{finalTotal}</TotalAmountrs>
            </TotalAmountdiv>
          </TotalPriceDiv>
        </FormRightDiv>
      </FullpayemntPage>

      <CartFoot />
    </Container>
  );
};

export default Payment;

