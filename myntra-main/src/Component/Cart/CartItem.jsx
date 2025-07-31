import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';
import styled from 'styled-components';

const CartItemContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eaeaec;
  padding: 16px;
  position: relative;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 120px;
  object-fit: contain;
  margin-right: 16px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #282c3f;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
  color: #282c3f;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  border: 1px solid #d4d5d9;
  width: fit-content;
  border-radius: 3px;
`;

const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  background-color: ${props => props.disabled ? '#f5f5f6' : 'white'};
  border: none;
  color: ${props => props.disabled ? '#94969f' : '#ff3e6c'};
  font-size: 18px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  
  &:hover {
    background-color: ${props => props.disabled ? '#f5f5f6' : '#fff1f4'};
  }
`;

const QuantityValue = styled.span`
  width: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #282c3f;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #ff3e6c;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  
  // Add useEffect to log and fix item quantity if needed
  React.useEffect(() => {
    console.log("Item in CartItem:", item);
    if (!item.quantity || item.quantity <= 0) {
      // Fix this specific item's quantity
      dispatch(updateQuantity({ id: item.id, quantity: 1 }));
    }
  }, [item, dispatch]);
  
  const handleIncreaseQuantity = () => {
    const newQuantity = (item.quantity || 0) + 1;
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    console.log(`Increasing quantity to ${newQuantity}`);
  };
  
  const handleDecreaseQuantity = () => {
    if ((item.quantity || 0) > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
      console.log(`Decreasing quantity to ${item.quantity - 1}`);
    }
  };
  
  const handleRemoveItem = () => {
    dispatch(removeFromCart(item.id));
  };
  
  return (
    <CartItemContainer>
      <ItemImage src={item.image} alt={item.name} />
      
      <ItemDetails>
        <ItemName>{item.name}</ItemName>
        <ItemPrice>₹{item.price} × {item.quantity || 1} = ₹{item.price * (item.quantity || 1)}</ItemPrice>
        
        <QuantitySelector>
          <QuantityButton 
            onClick={handleDecreaseQuantity} 
            disabled={(item.quantity || 0) <= 1}
          >
            -
          </QuantityButton>
          <QuantityValue>{item.quantity || 1}</QuantityValue>
          <QuantityButton onClick={handleIncreaseQuantity}>+</QuantityButton>
        </QuantitySelector>
      </ItemDetails>
      
      <RemoveButton onClick={handleRemoveItem}>REMOVE</RemoveButton>
    </CartItemContainer>
  );
};

export default CartItem;