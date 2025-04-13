// src/components/Register.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FiUser, FiMail, FiLock, FiCheck, FiX, FiArrowRight } from "react-icons/fi";

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
  margin-bottom: 1.25rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textLight || "#666"};
  font-size: 1.1rem;
`;

const StatusIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ valid }) => valid ? "#4caf50" : "#e63946"};
  font-size: 1rem;
  display: ${({ show }) => show ? "block" : "none"};
`;

const Input = styled.input`
  padding: 1rem 2.5rem 1rem 3rem;
  width: 100%;
  border: 1px solid ${({ theme, error, valid }) => 
    error ? "#e63946" : valid ? "#4caf50" : (theme.borderColor || "#e1e1e1")};
  border-radius: 8px;
  outline: none;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.inputBg || "#fff"};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme, error, valid }) => 
      error ? "#e63946" : valid ? "#4caf50" : (theme.accent || "#000")};
    box-shadow: 0 0 0 3px ${({ error, valid }) => 
      error ? "rgba(230, 57, 70, 0.1)" : valid ? "rgba(76, 175, 80, 0.1)" : "rgba(0, 0, 0, 0.05)"};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.placeholderColor || "#aaa"};
  }
`;

const PasswordStrengthMeter = styled.div`
  height: 4px;
  background-color: #f1f1f1;
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
  display: ${({ show }) => show ? "block" : "none"};
`;

const StrengthIndicator = styled.div`
  height: 100%;
  width: ${({ strength }) => `${strength}%`};
  background-color: ${({ strength }) => 
    strength < 30 ? "#e63946" : 
    strength < 70 ? "#fb8b24" : 
    "#4caf50"};
  transition: all 0.3s ease;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textLight || "#666"};
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 0.3rem;
    
    svg {
      margin-right: 0.5rem;
      font-size: 0.9rem;
    }
    
    .valid {
      color: #4caf50;
    }
    
    .invalid {
      color: #e63946;
    }
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
  margin: 1.5rem 0 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: ${({ theme }) => theme.accentDark || "#222"};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover:not(:disabled) svg {
    transform: translateX(4px);
  }
`;

const GoogleButton = styled(Button)`
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.borderColor || "#e1e1e1"};
  color: #333;
  margin-bottom: 1rem;
  
  &:hover:not(:disabled) {
    background-color: #f8f9fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    color: #4285F4;
    margin-right: 0.75rem;
    margin-left: 0;
    font-size: 1.2rem;
  }
  
  &:hover:not(:disabled) svg {
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
  justify-content: center;
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
  padding: 0.5rem;
  background-color: rgba(230, 57, 70, 0.05);
  border-radius: 4px;
  text-align: center;
`;

const Register = () => {
  const [userData, setUserData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [validations, setValidations] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
    hasMinLength: false,
    passwordsMatch: false
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 0) {
      // Start with 25% if there's anything
      strength = 25;
      
      // Add for meeting various criteria
      if (validations.hasUpperCase) strength += 15;
      if (validations.hasLowerCase) strength += 15;
      if (validations.hasNumber) strength += 15;
      if (validations.hasSpecial) strength += 15;
      if (password.length >= 10) strength += 15;
    }
    return Math.min(strength, 100);
  };

  const validatePassword = (password) => {
    setValidations({
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasMinLength: password.length >= 8,
      passwordsMatch: password === userData.confirmPassword
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    
    if (name === "password") {
      validatePassword(value);
    } else if (name === "confirmPassword") {
      setValidations(prev => ({
        ...prev,
        passwordsMatch: value === userData.password
      }));
    }
  };

  const isFormValid = () => {
    const { hasUpperCase, hasLowerCase, hasNumber, hasSpecial, hasMinLength, passwordsMatch } = validations;
    return userData.name && userData.email && hasUpperCase && hasLowerCase && hasNumber && hasSpecial && hasMinLength && passwordsMatch;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!isFormValid()) {
      setError("Please ensure all fields are correctly filled in.");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: userData.name });
      
      // Create user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const nameParts = userData.name.split(" ");
      
      await setDoc(userDocRef, {
        uid: user.uid,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
        email: userData.email,
        isOnline: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Redirect to profile-setup for additional info
      navigate("/profile-setup");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleGoogleRegister = () => {
    alert("Implement Google Auth similar to Login");
  };

  const passwordStrength = calculatePasswordStrength(userData.password);

  return (
    <PageContainer>
      <FormSection>
        <Title>Join Belviano</Title>
        <Subtitle>Create your account</Subtitle>
        
        <GoogleButton onClick={handleGoogleRegister}>
          <FaGoogle /> Sign up with Google
        </GoogleButton>
        
        <Divider><span>OR</span></Divider>
        
        <form onSubmit={handleRegister}>
          <InputGroup>
            <InputIcon>
              <FiUser />
            </InputIcon>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={userData.name}
              onChange={handleInputChange}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <InputIcon>
              <FiMail />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={userData.email}
              onChange={handleInputChange}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleInputChange}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              required
            />
            <StatusIcon show={userData.password.length > 0} valid={isFormValid()}>
              {isFormValid() ? <FiCheck /> : <FiX />}
            </StatusIcon>
          </InputGroup>
          
          {passwordFocus && userData.password && (
            <>
              <PasswordStrengthMeter show={true}>
                <StrengthIndicator strength={passwordStrength} />
              </PasswordStrengthMeter>
              
              <RequirementsList>
                <li>
                  {validations.hasUpperCase ? (
                    <FiCheck className="valid" />
                  ) : (
                    <FiX className="invalid" />
                  )}
                  Uppercase letter
                </li>
                <li>
                  {validations.hasLowerCase ? (
                    <FiCheck className="valid" />
                  ) : (
                    <FiX className="invalid" />
                  )}
                  Lowercase letter
                </li>
                <li>
                  {validations.hasNumber ? (
                    <FiCheck className="valid" />
                  ) : (
                    <FiX className="invalid" />
                  )}
                  Number
                </li>
                <li>
                  {validations.hasSpecial ? (
                    <FiCheck className="valid" />
                  ) : (
                    <FiX className="invalid" />
                  )}
                  Special character
                </li>
                <li>
                  {validations.hasMinLength ? (
                    <FiCheck className="valid" />
                  ) : (
                    <FiX className="invalid" />
                  )}
                  At least 8 characters
                </li>
              </RequirementsList>
            </>
          )}
          
          <InputGroup>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              error={userData.confirmPassword && !validations.passwordsMatch}
              valid={userData.confirmPassword && validations.passwordsMatch}
              required
            />
            {userData.confirmPassword && (
              <StatusIcon show={true} valid={validations.passwordsMatch}>
                {validations.passwordsMatch ? <FiCheck /> : <FiX />}
              </StatusIcon>
            )}
          </InputGroup>
          
          <Button type="submit" disabled={!isFormValid()}>
            Create Account <FiArrowRight />
          </Button>
        </form>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FooterLinks>
          <span>Already have an account? </span>
          <LinkText as={Link} to="/login">&nbsp;Sign in</LinkText>
        </FooterLinks>
      </FormSection>
    </PageContainer>
  );
};

export default Register;