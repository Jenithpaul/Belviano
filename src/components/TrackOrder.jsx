import React, { useState } from "react";
import styled from "styled-components";

const TrackSection = styled.section`
  padding: 2rem 1rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const TrackTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.accent};
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
`;

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    // Replace with actual API call to track order
    setTrackingInfo({ status: "Shipped", estimatedDelivery: "2025-05-01" });
  };

  return (
    <TrackSection>
      <TrackTitle>Track Your Order</TrackTitle>
      <form onSubmit={handleTrack}>
        <Input 
          type="text" 
          placeholder="Enter your Order ID" 
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required 
        />
        <Button type="submit">Track Order</Button>
      </form>
      {trackingInfo && (
        <div>
          <p>Status: {trackingInfo.status}</p>
          <p>Estimated Delivery: {trackingInfo.estimatedDelivery}</p>
        </div>
      )}
    </TrackSection>
  );
};

export default TrackOrder;
