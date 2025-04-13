import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 4rem;
`;

const NotFound = () => (
  <NotFoundContainer>
    <h2>404 - Page Not Found</h2>
    <p>Sorry, the page you are looking for doesn’t exist.</p>
    <Link to="/">Go Home</Link>
  </NotFoundContainer>
);

export default NotFound;
