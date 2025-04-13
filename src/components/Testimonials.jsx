import React, { useRef } from "react";
import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const TestimonialsSection = styled.section`
  background-color: ${({ theme }) => theme.sectionBg};
  position: relative;
  overflow: hidden;
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 700;
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -10px;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: ${({ theme }) => theme.accent};
    border-radius: 2px;
  }
`;

const SectionDescription = styled(motion.p)`
  max-width: 600px;
  margin: 0 auto;
  color: ${({ theme }) => theme.textMuted};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const TestimonialsWrapper = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadowMedium};
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &::before {
    content: '"';
    position: absolute;
    top: 1rem;
    left: 1.5rem;
    font-size: 5rem;
    font-family: serif;
    color: ${({ theme }) => theme.accent};
    opacity: 0.1;
    line-height: 1;
  }
`;

const QuoteText = styled.blockquote`
  font-style: italic;
  margin: 0;
  padding: 0;
  color: ${({ theme }) => theme.text};
  line-height: 1.8;
  font-size: 1.1rem;
  z-index: 1;
`;

const Stars = styled.div`
  display: flex;
  color: #FFD700;
  margin-bottom: 0.5rem;
  gap: 0.25rem;
`;

const Author = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorName = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const AuthorTitle = styled.span`
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.85rem;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const NavButton = styled(motion.button)`
  background-color: ${({ theme }) => theme.cardBg};
  border: none;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadowLight};
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackgroundDecoration = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.accent};
  opacity: 0.03;
  bottom: -200px;
  right: -200px;
  filter: blur(100px);
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Sample testimonials data
  const testimonials = [
    {
      text: "Working with this developer was an absolute pleasure. They delivered the project ahead of schedule and exceeded our expectations. The attention to detail and clean code made future maintenance a breeze.",
      author: "Alex Johnson",
      title: "Product Manager at TechCorp",
      image: "https://via.placeholder.com/50",
      stars: 5
    },
    {
      text: "The portfolio website created for our company perfectly captures our brand identity. The animations are smooth, and the design is both modern and functional. I highly recommend their services.",
      author: "Sarah Williams",
      title: "CEO of DesignStudio",
      image: "https://via.placeholder.com/50",
      stars: 5
    },
    {
      text: "Exceptional problem-solving skills and great communication throughout the project. They took our vague idea and transformed it into a fully functional web application that our users love.",
      author: "Michael Chen",
      title: "Startup Founder",
      image: "https://via.placeholder.com/50",
      stars: 5
    }
  ];

  return (
    <TestimonialsSection id="testimonials" ref={ref}>
      <BackgroundDecoration />
      <Container>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Client Testimonials
          </SectionTitle>
          <SectionDescription
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Here's what clients and collaborators have to say about working with me.
          </SectionDescription>
        </SectionHeader>
        
        <TestimonialsWrapper
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Stars>
                {[...Array(testimonial.stars)].map((_, i) => (
                  <FiStar key={i} fill="#FFD700" />
                ))}
              </Stars>
              <QuoteText>
                {testimonial.text}
              </QuoteText>
              <Author>
                <AuthorImage>
                  <img src={testimonial.image} alt={testimonial.author} />
                </AuthorImage>
                <AuthorInfo>
                  <AuthorName>{testimonial.author}</AuthorName>
                  <AuthorTitle>{testimonial.title}</AuthorTitle>
                </AuthorInfo>
              </Author>
            </TestimonialCard>
          ))}
        </TestimonialsWrapper>
        
        <NavigationButtons>
          <NavButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8 }}
          >
            <FiChevronLeft />
          </NavButton>
          <NavButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.9 }}
          >
            <FiChevronRight />
          </NavButton>
        </NavigationButtons>
      </Container>
    </TestimonialsSection>
  );
};

export default Testimonials;