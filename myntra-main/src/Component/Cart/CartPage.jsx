import React from 'react';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal } from '../../redux/cartSlice';
import CartItem from './CartItem';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CartPageContainer = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 7fr 3fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsSection = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const CartHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eaeaec;
`;

const CartTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #282c3f;
  margin: 0;
`;

const PriceDetailsSection = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 16px;
  height: fit-content;
`;

const PriceDetailsTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #282c3f;
  margin: 0 0 16px 0;
  text-transform: uppercase;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #282c3f;
`;

const TotalRow = styled(PriceRow)`
  font-weight: 600;
  font-size: 15px;
  border-top: 1px solid #eaeaec;
  padding-top: 16px;
  margin-top: 16px;
`;

const CheckoutButton = styled.button`
  background-color: #ff3e6c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 0;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  margin-top: 16px;
  
  &:hover {
    background-color: #ff527b;
  }
`;

const EmptyCartContainer = styled.div`
  text-align: center;
  padding: 40px;
  grid-column: span 2;
`;

const EmptyCartMessage = styled.h3`
  font-size: 18px;
  color: #282c3f;
  margin-bottom: 16px;
`;

const ShopNowButton = styled(Link)`
  display: inline-block;
  background-color: #ff3e6c;
  color: white;
  text-decoration: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: 600;
  
  &:hover {
    background-color: #ff527b;
  }
`;

const CartPage = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  
  // Calculate additional values
  const deliveryCharge = cartTotal > 799 ? 0 : 99;
  const discount = Math.floor(cartTotal * 0.1); // Example: 10% discount
  const totalAmount = cartTotal + deliveryCharge - discount;
  
  // Force recalculation of cart total using correct quantities
  // Debug info to check what quantities are coming through
  console.log("Cart items with quantities:", cartItems);
  console.log("Calculated total:", cartTotal);

  // Calculate item count with quantities
  const itemCount = cartItems.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  
  if (cartItems.length === 0) {
    return (
      <EmptyCartContainer>
        <EmptyCartMessage>Your shopping bag is empty</EmptyCartMessage>
        <p>Add products to your bag and shop!</p>
        <ShopNowButton to="/">SHOP NOW</ShopNowButton>
      </EmptyCartContainer>
    );
  }
  
  return (
    <CartPageContainer>
      <CartItemsSection>
        <CartHeader>
          <CartTitle>Shopping Bag ({itemCount} items)</CartTitle>
        </CartHeader>
        
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </CartItemsSection>
      
      <PriceDetailsSection>
        <PriceDetailsTitle>Price Details</PriceDetailsTitle>
        
        <PriceRow>
          <span>Total MRP</span>
          <span>₹{cartTotal}</span>
        </PriceRow>
        
        <PriceRow>
          <span>Discount on MRP</span>
          <span style={{ color: '#03a685' }}>-₹{discount}</span>
        </PriceRow>
        
        <PriceRow>
          <span>Delivery Charge</span>
          <span>
            {deliveryCharge === 0 ? (
              <span style={{ color: '#03a685' }}>FREE</span>
            ) : (
              `₹${deliveryCharge}`
            )}
          </span>
        </PriceRow>
        
        <TotalRow>
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </TotalRow>
        
        <CheckoutButton>PLACE ORDER</CheckoutButton>
      </PriceDetailsSection>
    </CartPageContainer>
  );
};

export default CartPage;
