// src/components/ProfileSetup.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const FormSection = styled.section`
  padding: 2rem;
  max-width: 500px;
  margin: 2rem auto;
  text-align: center;
  background: ${({ theme }) => theme.headerBg};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.accent};
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;

const ProfileSetup = () => {
  const [profile, setProfile] = useState({ contactNumber: "", address: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleProfileSetup = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        contactNumber: profile.contactNumber,
        address: profile.address,
        updatedAt: serverTimestamp()
      });
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <FormSection>
      <Title>Complete Your Profile</Title>
      <form onSubmit={handleProfileSetup}>
        <Input
          type="text"
          placeholder="Contact Number"
          value={profile.contactNumber}
          onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Shipping Address"
          value={profile.address}
          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          required
        />
        <Button type="submit">Save Profile</Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormSection>
  );
};

export default ProfileSetup;
