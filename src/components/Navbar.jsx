import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiMenu, FiSearch, FiHeart, FiUser } from "react-icons/fi";

const Nav = styled(motion.nav)`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.headerBg || "#ffffff"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  letter-spacing: 0.03em;
`;

// Left side icons container
const NavLeft = styled.div`
  display: flex;
  gap: 1.8rem;
  align-items: center;

  svg {
    font-size: 1.5rem;
    cursor: pointer;
    color: ${({ theme }) => theme.iconColor || "#333"};
    transition: all 0.3s ease;
  }

  svg:hover {
    transform: scale(1.15);
    color: ${({ theme }) => theme.accentColor || "#000"};
  }
`;

// Center brand as home link
const NavCenter = styled(Link)`
  font-size: 2.2rem;
  font-weight: 300;
  color: ${({ theme }) => theme.text || "#000"};
  text-decoration: none;
  font-family: 'Tenor Sans', sans-serif;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 0 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -4px;
    left: 50%;
    background-color: currentColor;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover:after {
    width: 80%;
  }
`;

// Right side icons container
const NavRight = styled.div`
  display: flex;
  gap: 1.8rem;
  align-items: center;

  a {
    color: inherit;
    display: flex;
    align-items: center;
    position: relative;
  }

  svg {
    font-size: 1.5rem;
    cursor: pointer;
    color: ${({ theme }) => theme.iconColor || "#333"};
    transition: all 0.3s ease;
  }

  svg:hover {
    transform: scale(1.15);
    color: ${({ theme }) => theme.accentColor || "#000"};
  }
`;

// Animation variants
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Navbar = () => {
  return (
    <Nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <NavLeft>
        <FiMenu aria-label="Menu" />
        <FiSearch aria-label="Search" />
      </NavLeft>
      
      <NavCenter to="/">Belviano</NavCenter>
      
      <NavRight>
        <Link to="/wishlist" aria-label="Wishlist">
          <FiHeart />
        </Link>
        <Link to="/profile" aria-label="Profile">
          <FiUser />
        </Link>
      </NavRight>
    </Nav>
  );
};

export default Navbar;