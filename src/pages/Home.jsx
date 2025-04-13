import React, { useState } from "react";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import TrackOrder from "../components/TrackOrder";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

// Sample product data for demonstration
const sampleProducts = [
  { id: 1, title: "Stylish Jacket", price: 99.99, image: "https://ncrphotos.com/product1.jpg" },
  { id: 2, title: "Trendy T-Shirt", price: 29.99, image: "https://ncrphotos.com/product2.jpg" },
  { id: 3, title: "Elegant Dress", price: 149.99, image: "https://ncrphotos.com/product3.jpg" }
];

const Home = () => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const handleAddToCart = (product) => setCartItems([...cartItems, product]);
  const handleAddToWishlist = (product) => setWishlistItems([...wishlistItems, product]);

  return (
    <>
      <Hero />
      <ProductList 
        products={sampleProducts}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />
      <TrackOrder />
      <About />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
