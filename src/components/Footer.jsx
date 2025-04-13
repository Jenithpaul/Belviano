import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.headerBg};
  padding: 1rem;
  text-align: center;
`;

const Footer = () => (
  <FooterContainer as={motion.footer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <p>© {new Date().getFullYear()} Clothing Brand. All rights reserved.</p>
  </FooterContainer>
);

export default Footer;
