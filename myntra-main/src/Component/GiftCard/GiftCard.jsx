import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyGiftCard, removeGiftCard } from "../../redux/cartSlice";
import { TextField, Button } from "@mui/material";

const GiftCard = ({ onApply, totalAmount }) => {
  const [giftCardCode, setGiftCardCode] = useState("");
  const dispatch = useDispatch();
  const { giftCard } = useSelector((state) => state.cart);

  const handleApplyGiftCard = () => {
    // Assuming the gift card has a fixed value for simplicity
    const cardValue = 100;
    dispatch(applyGiftCard({ code: giftCardCode, value: cardValue }));
    onApply(cardValue); // Call the onApply handler with the discount amount
  };

  const handleRemoveGiftCard = () => {
    dispatch(removeGiftCard());
    onApply(0); // Reset the discount to zero
  };

  return (
    <div>
      <TextField
        label="Gift Card Code"
        variant="outlined"
        value={giftCardCode}
        onChange={(e) => setGiftCardCode(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleApplyGiftCard}
      >
        Apply Gift Card
      </Button>
      {giftCard && (
        <div>
          <p>Gift Card Applied: {giftCard.code}</p>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRemoveGiftCard}
          >
            Remove Gift Card
          </Button>
        </div>
      )}
    </div>
  );
};

export default GiftCard;