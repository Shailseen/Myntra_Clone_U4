import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  giftCard: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = Math.max(1, (existingItem.quantity || 1) + 1);
      } else {
        // Always set quantity to 1 if missing or invalid
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        // Always set quantity to at least 1
        item.quantity = Math.max(1, Number(quantity) || 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    applyGiftCard: (state, action) => {
      state.giftCard = {
        code: action.payload.code,
        value: action.payload.value,
      };
    },
    removeGiftCard: (state) => {
      state.giftCard = null;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  applyGiftCard,
  removeGiftCard
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart?.items || [];
export const selectCartTotal = (state) => {
  const items = state.cart?.items || [];
  return items.reduce((total, item) => total + (Number(item.price) * (Number(item.quantity) || 1)), 0);
};
export const selectGiftCard = (state) => state.cart?.giftCard || null;
export const selectFinalTotal = (state) => {
  const cartTotal = selectCartTotal(state);
  const giftCard = selectGiftCard(state);
  return giftCard ? Math.max(0, cartTotal - giftCard.value) : cartTotal;
};

export default cartSlice.reducer;