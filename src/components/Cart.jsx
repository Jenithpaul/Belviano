import React from "react";
import styled from "styled-components";

const CartSection = styled.section`
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const CartTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
`;

const CartList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CartItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.accent};
  display: flex;
  justify-content: space-between;
`;

const Cart = ({ cartItems }) => {
  return (
    <CartSection>
      <CartTitle>Your Cart</CartTitle>
      <CartList>
        {cartItems.map((item) => (
          <CartItem key={item.id}>
            <span>{item.title}</span>
            <span>${item.price}</span>
          </CartItem>
        ))}
      </CartList>
    </CartSection>
  );
};

export default Cart;
