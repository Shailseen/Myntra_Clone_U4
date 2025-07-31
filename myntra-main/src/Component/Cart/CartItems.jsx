import React from "react";
import {
  AddBoxOutlined,
  Clear,
  CloseFullscreenOutlined,
  CloseOutlined,
  IndeterminateCheckBoxOutlined,
} from "@mui/icons-material";
import {
  Brand,
  CartItemDiv,
  CartItems,
  Filtercontainer,
  FilterPM,
  Imagediv,
  ItemIamge,
  ItemInfoDiv,
  Name,
  Oprice,
  PercentOff,
  Price,
  PriceDis,
  RButton,
  RemoveButtonDiv,
  SizeDiv,
} from "./Cart.element";
import { removeFromCart, updateQuantity } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CartItemsDiv = ({
  images,
  id,
  title,
  sizes,
  price,
  off_price,
  discount,
  brand,
  quantity,
}) => {
  const dispatch = useDispatch();

  const handleModelBagClose = (id) => {
    dispatch(removeFromCart(id));
  };

  const increaseQ = () => {
    dispatch(updateQuantity({ id, quantity: (quantity || 1) + 1 }));
  };
  const decreaseQ = () => {
    if ((quantity || 1) > 1) {
      dispatch(updateQuantity({ id, quantity: (quantity || 1) - 1 }));
    }
  };

  return (
    <CartItemDiv>
      <Imagediv>
        <ItemIamge src={images?.image1 || images} />
      </Imagediv>
      <ItemInfoDiv>
        <Brand>{brand}</Brand>
        <Name>{title}</Name>
        <Filtercontainer>
          <SizeDiv>
            <h4>{`Size: ${sizes ? sizes[1] || sizes[0] : "M"}`}</h4>
          </SizeDiv>
          <FilterPM>
            <AddBoxOutlined
              onClick={increaseQ}
              sx={{
                backgroundColor: "#fff",
                color: "black",
                marginRight: "5px",
              }}
            />
            <p>{quantity || 1}</p>
            <IndeterminateCheckBoxOutlined
              onClick={decreaseQ}
              sx={{
                color: "black",
                backgroundColor: "#fff",
                marginLeft: "5px",
              }}
            />
          </FilterPM>
        </Filtercontainer>
        <PriceDis>
          <Price>
            ₹
            {Math.floor(
              Number(off_price || price) *
                ((100 - Number(discount || 0)) / 100)
            )}
          </Price>
          <Oprice>{`₹${off_price || price}`}</Oprice>
          <PercentOff>{`${discount || 0}% OFF`}</PercentOff>
        </PriceDis>
      </ItemInfoDiv>
      <RemoveButtonDiv>
        <RButton onClick={() => handleModelBagClose(id)}>
          <Clear sx={{ color: "black", width: "25px", height: "25px" }} />
        </RButton>
      </RemoveButtonDiv>
    </CartItemDiv>
  );
};

export default CartItemsDiv;
          