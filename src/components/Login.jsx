// src/components/Login.jsx
import React, { useState } from "react";
import styled from "styled-components";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme.bgLight || "#f8f9fa"};
`;

const FormSection = styled.section`
  width: 100%;
  max-width: 430px;
  padding: 2.5rem;
  background: ${({ theme }) => theme.headerBg || "#fff"};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.05em;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.textLight || "#666"};
  font-size: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textLight || "#666"};
  font-size: 1.1rem;
`;

const Input = styled.input`
  padding: 1rem 1rem 1rem 3rem;
  width: 100%;
  border: 1px solid ${({ theme, error }) => error ? "red" : (theme.borderColor || "#e1e1e1")};
  border-radius: 8px;
  outline: none;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.inputBg || "#fff"};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme, error }) => error ? "red" : (theme.accent || "#000")};
    box-shadow: 0 0 0 3px ${({ theme, error }) => error ? "rgba(255, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.05)"};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.placeholderColor || "#aaa"};
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: ${({ theme }) => theme.accent || "#000"};
  border: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  width: 100%;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: ${({ theme }) => theme.accentDark || "#222"};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const GoogleButton = styled(Button)`
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.borderColor || "#e1e1e1"};
  color: #333;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    color: #4285F4;
    margin-right: 0.75rem;
    margin-left: 0;
    font-size: 1.2rem;
  }
  
  &:hover svg {
    transform: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &:before, &:after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.borderColor || "#e1e1e1"};
  }
  
  span {
    padding: 0 1rem;
    color: ${({ theme }) => theme.textLight || "#666"};
    font-size: 0.9rem;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.borderColor || "#e1e1e1"};
  font-size: 0.9rem;
`;

const LinkText = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.accent || "#000"};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: #e63946;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(230, 57, 70, 0.05);
  border-radius: 4px;
  text-align: center;
`;

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        // Check if additional profile info exists
        if (!userSnap.exists() || !userSnap.data().contactNumber || !userSnap.data().address) {
          navigate("/profile-setup");
        } else {
          await setDoc(userDocRef, { isOnline: true, updatedAt: serverTimestamp() }, { merge: true });
          navigate("/profile");
        }
      }
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No such user found. Please register first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = result.additionalUserInfo?.isNewUser || false;
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      if (isNewUser) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email,
          isOnline: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        navigate("/profile-setup");
      } else {
        await setDoc(userDocRef, { isOnline: true, updatedAt: serverTimestamp() }, { merge: true });
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!credentials.email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, credentials.email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <PageContainer>
      <FormSection>
        <Title>Welcome back</Title>
        <Subtitle>Sign in to your account</Subtitle>
        
        <GoogleButton onClick={handleGoogleSignIn}>
          <FaGoogle /> Continue with Google
        </GoogleButton>
        
        <Divider><span>OR</span></Divider>
        
        <form onSubmit={handleLogin}>
          <InputGroup>
            <InputIcon>
              <FiMail />
            </InputIcon>
            <Input
              type="email"
              placeholder="Email address"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </InputGroup>
          
          <Button type="submit">
            Sign In <FiArrowRight />
          </Button>
        </form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FooterLinks>
          <LinkText as={Link} to="/register">Create account</LinkText>
          <LinkText onClick={handleForgotPassword}>Forgot password?</LinkText>
        </FooterLinks>
      </FormSection>
    </PageContainer>
  );
};

export default Login;