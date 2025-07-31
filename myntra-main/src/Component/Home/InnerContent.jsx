import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBestOfMyntra,
  getCategoriesData,
  getdealsOflaatestArival,
  getDealsOftheData,
  getGiftingCards,
  getNewTopBrands,
  getTopInInfluncerExclusive,
  getTopPicksData,
} from "../../redux/Home/actions";
import BestOfMyntra from "./BestOfMyntra";
import CategoriesToBag from "./CategoriesToBag";
import DealOftheDayCard from "./DealOftheDayCard";
import { SlideShow } from "./Slider";
import TopPicks from "./TopPicks";
import { products } from "../../data/products"; // <-- import your mock products
import { addToCart } from "../../redux/cartSlice"; // <-- if using redux cartSlice for add to cart

const divStyle = {
  textAlign: "start",
  letterSpacing: ".15em",
  textTransform: "uppercase",
  color: "#3e4152",
  letterSpacing: ".15em",
  fontSize: "1.8em",
  margin: " 50px 0 10px 30px",
  maxHeight: "5em",
  fontWeight: "500",
};

// Add these styles for the product card
const productCardStyle = {
  border: "1px solid #eee",
  padding: "16px",
  width: "220px",
  borderRadius: "4px",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};

const addToCartButtonStyle = {
  width: "100%",
  padding: "8px 16px",
  backgroundColor: "#ff3e6c",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "10px",
  "&:hover": {
    backgroundColor: "#ff527b",
  },
};

const API_BASE_URL = process.env.REACT_APP_BACKEND_API;

function InnerContent() {
  const dealsOftheDay = useSelector((state) => state.home.dealsOftheDay);
  const bestofMyntra = useSelector((state) => state.home.bestOfMyntra);
  const topPicks = useSelector((state) => state.home.topPicks);
  const categoriesToBag = useSelector((state) => state.home.gategoriesToBag);
  const giftingCards = useSelector((state) => state.home.giftingCards);
  const dealsoflatestarival = useSelector(
    (state) => state.home.dealsoflatestarival
  );
  const newintopbrands = useSelector((state) => state.home.newintopbrands);
  const topinfluncerseclusive = useSelector(
    (state) => state.home.topinfluncerseclusive
  );

  // console.log("data", dealsOftheDay);
  const dispatch = useDispatch();
  useEffect(() => {
    fetch(`https://myntrafinaldata.herokuapp.com/dealsofthday`)
      .then((res) => res.json())
      .then((res) => dispatch(getDealsOftheData(res)))
      .catch((e) => console.log(e));
    fetch(`https://myntrafinaldata.herokuapp.com/bestOfMyntra`)
      .then((res) => res.json())
      .then((res) => dispatch(getBestOfMyntra(res)))
      .catch((e) => console.log(e));
    fetch(`https://myntrafinaldata.herokuapp.com/topPicks`)
      .then((res) => res.json())
      .then((res) => dispatch(getTopPicksData(res)))
      .catch((e) => console.log(e));
    fetch(`https://myntrafinaldata.herokuapp.com/categoriesToBag`)
      .then((res) => res.json())
      .then((res) => dispatch(getCategoriesData(res)))
      .catch((e) => console.log(e));
    fetch(`${API_BASE_URL}/categoriesToBag`)
      .then((res) => res.json())
      .then((res) => dispatch(getCategoriesData(res)))
      .catch((e) => console.log(e));
    fetch(`https://myntrafinaldata.herokuapp.com/GiftingCards`)
      .then((res) => res.json())
      .then((res) => dispatch(getGiftingCards(res)))
      .catch((e) => console.log(e));
    fetch(`https://myntrafinaldata.herokuapp.com/dealsoOnLatestArival`)
      .then((res) => res.json())
      .then((res) => dispatch(getdealsOflaatestArival(res)))
      .catch((e) => console.log(e));
    fetch(`https://myntrafinaldata.herokuapp.com/newInTopBrands`)
      .then((res) => res.json())
      .then((res) => dispatch(getNewTopBrands(res)))
      .catch((e) => console.log(e));
    fetch(`https://myntrafinaldata.herokuapp.com/topInfluencerExclusiveStyles`)
      .then((res) => res.json())
      .then((res) => dispatch(getTopInInfluncerExclusive(res)))
      .catch((e) => console.log(e));
  }, [dispatch]);

  const handleAddToCart = (product) => {
    try {
      // Make sure to include quantity: 1 explicitly when dispatching addToCart
      const productWithQuantity = {
        ...product,
        quantity: 1,
      };

      console.log("Adding product with quantity:", productWithQuantity);
      dispatch(addToCart(productWithQuantity));

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  return (
    <div>
      <SlideShow />
      <div
        style={{
          textAlign: "start",
          letterSpacing: ".15em",
          textTransform: "uppercase",
          color: "#3e4152",
          fontSize: "1.8em",
          margin: "50px 0 10px 30px",
          fontWeight: "500",
        }}
      >
        <h4>FEATURED PRODUCTS</h4>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          margin: "30px",
          justifyContent: "flex-start",
        }}
      >
        {products &&
          products.map((product) => (
            <div key={product.id} style={productCardStyle}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "contain",
                  marginBottom: "10px",
                }}
              />
              <h4 style={{ margin: "10px 0", fontSize: "16px" }}>
                {product.name}
              </h4>
              <p style={{ color: "#535766", fontSize: "14px" }}>
                {product.description}
              </p>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: "10px 0",
                }}
              >
                ₹{product.price}
              </div>
              <button
                style={addToCartButtonStyle}
                onClick={() => handleAddToCart(product)}
              >
                ADD TO CART
              </button>
            </div>
          ))}
      </div>
      <div>
        <div style={divStyle}>
          {" "}
          <h4>DEALS OF THE DAY</h4>
        </div>
        <div
          style={{
            display: "grid",
            justifyContent: "space-between",
            gridTemplateColumns: "repeat(10, auto) ",
          }}
        >
          {dealsOftheDay.map((e) => (
            <DealOftheDayCard {...e} key={e.id} />
          ))}
        </div>
        <div style={divStyle}>
          {" "}
          <h4>BEST OF MYNTRA EXCLUSIVE BRANDS</h4>
        </div>
        <div
          style={{
            display: "grid",
            justifyContent: "space-between",
            gridTemplateColumns: "repeat(8, auto) ",
          }}
        >
          {bestofMyntra.map((e) => (
            <BestOfMyntra {...e} key={e.id} />
          ))}
        </div>
        <div style={divStyle}>
          {" "}
          <h4>TOP PICKS</h4>
        </div>
        <div
          style={{
            display: "grid",
            justifyContent: "space-between",
            gridTemplateColumns: "repeat(7, auto) ",
          }}
        >
          {topPicks.map((e) => (
            <TopPicks {...e} key={e.id} />
          ))}
        </div>
        <div style={divStyle}>
          {" "}
          <h4>TOP PICKSCATEGORIES TO BAG</h4>
        </div>
        <div
          style={{
            display: "grid",
            justifyContent: "space-around",
            gridTemplateColumns: "repeat(8, auto) ",
            rowGap: "0px",
          }}
        >
          {categoriesToBag.map((e) => (
            <CategoriesToBag {...e} key={e.id} />
          ))}
        </div>
        <div style={divStyle}>
          {" "}
          <h4>GIFTING CARDS</h4>
        </div>
        <div
          style={{
            display: "grid",
            justifyContent: "space-around",
            gridTemplateColumns: "repeat(5, auto) ",
            rowGap: "0px",
          }}
        >
          {giftingCards.map((e) => (
            <CategoriesToBag {...e} key={e.id} />
          ))}
        </div>
        <div style={divStyle}>
          {" "}
          <h4>TOP INFLUENCERS EXCLUSIVE STYLES</h4>
        </div>
        <div
          style={{
            display: "grid",
            justifyContent: "space-around",
            gridTemplateColumns: "repeat(6, auto) ",
            rowGap: "0px",
          }}
        >
          {topinfluncerseclusive.map((e) => (
            <CategoriesToBag {...e} key={e.id} />
          ))}
        </div>
        <div style={divStyle}>
          {" "}
          <h4>NEW IN TOP BRANDS</h4>
        </div>
        <div
          style={{
            display: "grid",
            justifyContent: "space-around",
            gridTemplateColumns: "repeat(8, auto) ",
            rowGap: "0px",
          }}
        >
          {newintopbrands.map((e) => (
            <CategoriesToBag {...e} key={e.id} />
          ))}
        </div>
        <div style={divStyle}>
          {" "}
          <h4>DEALS ON LATEST ARRIVALS</h4>
        </div>
        <div
          style={{
            display: "grid",
            justifyContent: "space-around",
            gridTemplateColumns: "repeat(2, auto) ",
            rowGap: "0px",
          }}
        >
          {dealsoflatestarival.map((e) => (
            <CategoriesToBag {...e} key={e.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default InnerContent;
