import React from "react";
import styled from "styled-components";

const WishlistSection = styled.section`
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const WishlistTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
`;

const WishlistList = styled.ul`
  list-style: none;
  padding: 0;
`;

const WishlistItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.accent};
  display: flex;
  justify-content: space-between;
`;

const Wishlist = ({ wishlistItems }) => {
  return (
    <WishlistSection>
      <WishlistTitle>Your Wish List</WishlistTitle>
      <WishlistList>
        {wishlistItems.map((item) => (
          <WishlistItem key={item.id}>
            <span>{item.title}</span>
            <span>${item.price}</span>
          </WishlistItem>
        ))}
      </WishlistList>
    </WishlistSection>
  );
};

export default Wishlist;
