import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const HeroBackground = styled.video`
  width: 100%;
  height: 100vh;
  object-fit: cover;
  filter: brightness(0.6);
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const HeroSection = styled.section`
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
`;

const HeroContent = styled.div`
  color: ${({ theme }) => theme.text};
`;

const HeroTitle = styled(motion.h2)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
`;

const heroVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const Hero = () => (
  <HeroSection>
    <HeroBackground autoPlay loop muted playsInline>
      <source src="https://ncrphotos.com/guccihttps://videos.pexels.com/video-files/2047965/2047965-hd_1280_720_30fps.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </HeroBackground>
    <HeroContent>
      <HeroTitle variants={heroVariants} initial="hidden" animate="visible">
        Elevate Your Style
      </HeroTitle>
      <HeroSubtitle variants={heroVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
        Discover our exclusive collection of premium clothing.
      </HeroSubtitle>
    </HeroContent>
  </HeroSection>
);

export default Hero;
