import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const AboutSection = styled.section`
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const AboutTitle = styled(motion.h2)`
  font-size: 2.2rem;
  margin-bottom: 1rem;
`;

const AboutImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid ${({ theme }) => theme.accent};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const AboutText = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.6;
`;

const aboutVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const About = () => (
  <AboutSection>
    <AboutTitle variants={aboutVariants} initial="hidden" animate="visible">
      About Us
    </AboutTitle>
    <AboutImage src="https://ncrphotos.com/about.jpg" alt="Clothing Brand" />
    <AboutText variants={aboutVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
      We are a semi-luxury clothing brand combining timeless minimalism with modern elegance.
    </AboutText>
  </AboutSection>
);

export default About;
