import React from "react";
import styled from "styled-components";
import ProductCard from "./ProductCard";

const ProductsSection = styled.section`
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.sectionBg};
  text-align: center;
`;

const ProductsTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ProductGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const ProductList = ({ products, onAddToCart, onAddToWishlist }) => {
  return (
    <ProductsSection>
      <ProductsTitle>New Arrivals</ProductsTitle>
      <ProductGrid>
        {products.map((prod) => (
          <ProductCard 
            key={prod.id}
            product={prod}
            onAddToCart={() => onAddToCart(prod)}
            onAddToWishlist={() => onAddToWishlist(prod)}
          />
        ))}
      </ProductGrid>
    </ProductsSection>
  );
};

export default ProductList;
