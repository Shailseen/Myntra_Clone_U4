import { LocalOfferOutlined } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AllPriceDiv,
  AppCou,
  ApplyButton,
  ApplyCoupondiv,
  CartRight,
  CoupDis,
  CoupDisDiv,
  CoupDisrs,
  CouponApplyDiv,
  CoviFee,
  CoviFeediv,
  CoviFeeKM,
  CoviFeers,
  Dmrp,
  DmrpDiv,
  Dmrprs,
  NameC,
  PlaceorderButton,
  PlaceorderDiv,
  PriceDetailsT,
  Tmrp,
  TmrpDiv,
  Tmrprs,
  TotalAmount,
  TotalAmountdiv,
  TotalAmountrs,
  TotalPriceDiv,
} from "./CartRight.element";
import { useSelector } from "react-redux";
import { selectCartItems, selectGiftCard, selectFinalTotal } from "../../redux/cartSlice";

const CartRightS = ({ totalItems, totalAmount: propTotalAmount }) => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const giftCard = useSelector(selectGiftCard);
  const finalTotal = useSelector(selectFinalTotal);

  // Use provided total or calculate from Redux cart
  let totalAmount = propTotalAmount;
  if (!totalAmount) {
    totalAmount = 0;
    cartItems?.forEach(
      (e) => {
        totalAmount += Math.floor(Number(e.price) * (e.quantity || 1));
      }
    );
  }

  let totalMRP = 0;
  cartItems?.forEach(
    (e) => (totalMRP += Math.floor(Number(e.price)))
  );

  let totalDiscount = totalMRP - totalAmount;

  const placeOrder = () => {
    navigate("/address");
  };
  return (
    <CartRight>
      <CouponApplyDiv>
        <NameC>Coupons</NameC>
        <ApplyCoupondiv>
          <LocalOfferOutlined sx={{ width: "25px", height: "25px" }} />
          <AppCou>Apply Coupons</AppCou>
          <ApplyButton>APPLY</ApplyButton>
        </ApplyCoupondiv>
      </CouponApplyDiv>
      <AllPriceDiv>
        <PriceDetailsT>PRICE DETAILS ({cartItems.length} Items)</PriceDetailsT>
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
        {giftCard && (
          <DmrpDiv>
            <Dmrp>Gift Card Discount</Dmrp>
            <Dmrprs>-₹{giftCard.value}</Dmrprs>
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
          <TotalAmountrs>₹{giftCard ? finalTotal : totalAmount}</TotalAmountrs>
        </TotalAmountdiv>
        <PlaceorderDiv>
          <PlaceorderButton onClick={placeOrder}>PLACE ORDER</PlaceorderButton>
        </PlaceorderDiv>
      </TotalPriceDiv>
    </CartRight>
  );
};

export default CartRightS;