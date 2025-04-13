import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const SkillsSection = styled.section`
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const SkillsTitle = styled(motion.h2)`
  font-size: 2.2rem;
  margin-bottom: 1rem;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
`;

const SkillItem = styled(motion.li)`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 20px;
  background-color: ${({ theme }) => theme.headerBg};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Skills = () => (
  <SkillsSection>
    <SkillsTitle>Our Expertise</SkillsTitle>
    <SkillList>
      {["Minimal Design", "Quality Materials", "Timeless Styles", "Innovative Cuts"].map((skill) => (
        <SkillItem key={skill}>{skill}</SkillItem>
      ))}
    </SkillList>
  </SkillsSection>
);

export default Skills;
