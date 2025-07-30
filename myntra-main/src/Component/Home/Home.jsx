import React from "react";
import { useDispatch } from "react-redux";
import { products } from "../../data/products";
import { addToCart } from "../../redux/cartSlice";
import styled from "styled-components";

const HomeContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
`;

const ProductCard = styled.div`
  border: 1px solid #eee;
  padding: 16px;
  width: 220px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-bottom: 12px;
`;

const ProductName = styled.h4`
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #282c3f;
`;

const ProductDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const ProductPrice = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #ff3f6c;
  margin: 0 0 12px 0;
`;

const AddToCartButton = styled.button`
  background-color: #ff3f6c;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e33862;
  }
`;

const Home = () => {
  const dispatch = useDispatch();

  return (
    <HomeContainer>
      <h1>Welcome to Myntra Clone</h1>
      <h2>Products</h2>
      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductImage src={product.image} alt={product.name} />
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.description}</ProductDescription>
            <ProductPrice>₹{product.price}</ProductPrice>
            <AddToCartButton onClick={() => dispatch(addToCart(product))}>
              Add to Cart
            </AddToCartButton>
          </ProductCard>
        ))}
      </ProductGrid>
    </HomeContainer>
  );
};

export default Home;