import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";

const Card = styled(motion.div)`
  background-color: ${({ theme }) => theme.headerBg || '#ffffff'};
  padding: 1.5rem;
  border-radius: 12px;
  width: 280px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 220px;
  position: relative;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const Tag = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${({ theme }) => theme.accent || '#4a90e2'};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  z-index: 1;
`;

const ProductTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.textPrimary || '#333'};
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const Price = styled.p`
  font-size: 1.2rem;
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.accent || '#4a90e2'};
`;

const SizesAvailable = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textSecondary || '#666'};
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.borderColor || '#eee'};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
  gap: 0.35rem;
  color: ${({ theme }) => theme.textSecondary || '#666'};
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.accent || '#4a90e2'};
    background-color: ${({ theme }) => `${theme.accent}10` || '#4a90e210'};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const QuickView = styled(ActionButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 0.4rem;
  border-radius: 50%;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 2;

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView, 
  showQuickView = true, 
  isNew = false 
}) => {
  return (
    <Card
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <ProductImage>
        <img src={product.image} alt={product.title} />
        {isNew && <Tag>NEW</Tag>}
        
        {showQuickView && (
          <QuickView onClick={(e) => {
            e.stopPropagation();
            onQuickView?.(product);
          }}>
            <FiEye />
          </QuickView>
        )}
      </ProductImage>
      
      <ProductTitle>{product.title}</ProductTitle>
      
      <ProductMeta>
        <Price>${product.price}</Price>
        {product.sizes && product.sizes.length > 0 && (
          <SizesAvailable>
            {product.sizes.length} {product.sizes.length === 1 ? 'size' : 'sizes'} available
          </SizesAvailable>
        )}
      </ProductMeta>
      
      <Actions>
        <ActionButton onClick={(e) => {
          e.stopPropagation();
          onAddToCart?.(product);
        }}>
          <FiShoppingCart /> Add to Cart
        </ActionButton>
        
        <ActionButton onClick={(e) => {
          e.stopPropagation();
          onAddToWishlist?.(product);
        }}>
          <FiHeart />
        </ActionButton>
      </Actions>
    </Card>
  );
};

export default ProductCard;