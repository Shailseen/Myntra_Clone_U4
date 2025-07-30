import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectCartTotal, updateQuantity, removeFromCart } from "../../redux/cartSlice";
import GiftCard from "../Payment/GiftCard";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [giftCardDiscount, setGiftCardDiscount] = useState(0);

  return (
    <div>
      <div>
        <h2>Cart Items</h2>
        {cartItems.map(item => (
          <div key={item.id}>
            <img src={item.image} alt={item.name} width={60} />
            <span>{item.name}</span>
            <span>₹{item.price}</span>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={e => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))}
              style={{ width: 40, marginLeft: 8 }}
            />
            <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
          </div>
        ))}
        <div>
          <strong>Total: ₹{cartTotal}</strong>
        </div>
      </div>
      <GiftCard
        totalAmount={cartTotal}
        onApply={setGiftCardDiscount}
      />
      <div>
        <strong>Net Payable: ₹{Math.max(cartTotal - giftCardDiscount, 0)}</strong>
      </div>
    </div>
  );
};

export default CheckoutPage;