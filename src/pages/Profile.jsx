// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FiUser, FiPackage, FiHeart, FiMail, FiUpload, FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";

const ProfileContainer = styled.div`
  display: flex;
  padding: 3rem 2rem;
  gap: 3rem;
  max-width: 1100px;
  margin: 0 auto;
  min-height: 80vh;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const NavColumn = styled.div`
  flex-basis: 240px;
  flex-shrink: 0;
  border-right: 1px solid ${({ theme }) => theme.accent || "#e0e0e0"};
  padding: 1.5rem 1rem 1.5rem 0;
  height: fit-content;
  position: sticky;
  top: 100px;
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.accent || "#e0e0e0"};
    padding-bottom: 1rem;
    position: static;
    top: auto;
  }
`;

const ContentColumn = styled.div`
  flex-grow: 1;
  padding-left: 1rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 1rem;
    border: 2px solid ${({ theme }) => theme.accent || "#ddd"};
  }
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 500;
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.textLight || "#666"};
    font-size: 0.9rem;
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  color: ${({ active, theme }) => active ? (theme.accent || "#000") : (theme.text || "#333")};
  border-left: 3px solid ${({ active, theme }) => active ? (theme.accent || "#000") : "transparent"};
  padding-left: ${({ active }) => active ? "12px" : "15px"};
  transition: all 0.2s ease;
  font-weight: ${({ active }) => active ? "500" : "400"};

  svg {
    margin-right: 10px;
    font-size: 1.2rem;
  }

  &:hover {
    color: ${({ theme }) => theme.accent || "#000"};
    border-left-color: ${({ theme }) => theme.accent || "#000"};
    padding-left: 12px;
  }
`;

const LogoutButton = styled(MenuItem)`
  margin-top: 2rem;
  color: #e63946;
  
  &:hover {
    color: #e63946;
    border-left-color: #e63946;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
  background-color: ${({ theme }) => theme.sectionBg || "#fff"};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: ${({ active }) => active ? "block" : "none"};
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  position: relative;
  padding-bottom: 0.75rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: ${({ theme }) => theme.accent || "#000"};
    border-radius: 2px;
  }
`;

const InfoItem = styled.div`
  font-size: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  
  strong {
    min-width: 120px;
    display: inline-block;
    color: ${({ theme }) => theme.textLight || "#666"};
    font-weight: 500;
  }
`;

const ProfileImage = styled.div`
  margin: 1.5rem 0;
  text-align: center;
  
  img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${({ theme }) => theme.accent || "#ddd"};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const OrderItem = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor || "#eee"};
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
  
  h4 {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }
  
  p {
    margin: 0.25rem 0;
    color: ${({ theme }) => theme.textLight || "#666"};
    font-size: 0.9rem;
  }
`;

const WishlistItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.borderColor || "#eee"};
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
  
  .item-details {
    flex-grow: 1;
  }
  
  h4 {
    margin: 0 0 0.25rem 0;
    font-weight: 500;
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.textLight || "#666"};
    font-size: 0.9rem;
  }
  
  .price {
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.textLight || "#666"};
  
  a {
    color: ${({ theme }) => theme.accent || "#000"};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  input, textarea {
    padding: 0.75rem;
    border: 1px solid ${({ theme }) => theme.borderColor || "#ddd"};
    border-radius: 6px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.accent || "#000"};
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background-color: ${({ theme }) => theme.accent || "#000"};
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    align-self: flex-start;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

const UploadSection = styled.div`
  border: 2px dashed ${({ theme }) => theme.borderColor || "#ddd"};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin: 1rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.accent || "#000"};
    background-color: ${({ theme }) => theme.bgLight || "#f9f9f9"};
  }
  
  svg {
    font-size: 2rem;
    color: ${({ theme }) => theme.textLight || "#666"};
    margin-bottom: 1rem;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.textLight || "#666"};
  }
`;

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [activeSection, setActiveSection] = useState("account");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          navigate("/profile-setup");
        }
      } catch (err) {
        console.error("Error fetching user data: ", err);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  // Retrieve order history and wishlist; if not present show placeholder
  const orderHistory = userData?.orderHistory || [];
  const wishlist = userData?.wishlist || [];

  return (
    <ProfileContainer>
      <NavColumn>
        {userData && (
          <ProfileHeader>
            {userData.profileImageUrl ? (
              <img src={userData.profileImageUrl} alt="Profile" />
            ) : (
              <img src="/api/placeholder/60/60" alt="Profile" />
            )}
            <div>
              <h3>{userData.firstName} {userData.lastName}</h3>
              <p>{userData.email}</p>
            </div>
          </ProfileHeader>
        )}
        
        <MenuItem 
          active={activeSection === "account"} 
          onClick={() => setActiveSection("account")}
        >
          <FiUser /> Account Info
        </MenuItem>
        <MenuItem 
          active={activeSection === "orders"} 
          onClick={() => setActiveSection("orders")}
        >
          <FiPackage /> Order History
        </MenuItem>
        <MenuItem 
          active={activeSection === "wishlist"} 
          onClick={() => setActiveSection("wishlist")}
        >
          <FiHeart /> Wish List
        </MenuItem>
        <MenuItem 
          active={activeSection === "contact"} 
          onClick={() => setActiveSection("contact")}
        >
          <FiMail /> Contact Us
        </MenuItem>
        <MenuItem 
          active={activeSection === "upload"} 
          onClick={() => setActiveSection("upload")}
        >
          <FiUpload /> Upload Profile Image
        </MenuItem>
        
        <LogoutButton onClick={handleLogout}>
          <FiLogOut /> Logout
        </LogoutButton>
      </NavColumn>
      
      <ContentColumn>
        {userData && (
          <>
            <Section active={activeSection === "account"}>
              <SectionTitle>Account Information</SectionTitle>
              <InfoItem>
                <strong>Name:</strong> {userData.firstName} {userData.lastName}
              </InfoItem>
              <InfoItem>
                <strong>Contact:</strong> {userData.contactNumber || "Not provided"}
              </InfoItem>
              <InfoItem>
                <strong>Email:</strong> {userData.email}
              </InfoItem>
              <InfoItem>
                <strong>Shipping Address:</strong> {userData.address || "Not provided"}
              </InfoItem>
              
              {userData.profileImageUrl && (
                <ProfileImage>
                  <img src={userData.profileImageUrl} alt="Profile" />
                </ProfileImage>
              )}
            </Section>

            <Section active={activeSection === "orders"}>
              <SectionTitle>Order History</SectionTitle>
              {orderHistory.length === 0 ? (
                <EmptyState>
                  <p>You haven't placed any orders yet.</p>
                  <a href="/products">Start shopping</a>
                </EmptyState>
              ) : (
                orderHistory.map((order, index) => (
                  <OrderItem key={index}>
                    <h4>Order #{order.orderId}</h4>
                    <p>Date: {order.date}</p>
                    <p>Status: <strong>{order.status}</strong></p>
                  </OrderItem>
                ))
              )}
            </Section>

            <Section active={activeSection === "wishlist"}>
              <SectionTitle>Wish List</SectionTitle>
              {wishlist.length === 0 ? (
                <EmptyState>
                  <p>Your wishlist is empty.</p>
                  <a href="/products">Find something you love</a>
                </EmptyState>
              ) : (
                wishlist.map((item, index) => (
                  <WishlistItem key={index}>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>Category: {item.category || "Clothing"}</p>
                    </div>
                    <div className="price">${item.price}</div>
                  </WishlistItem>
                ))
              )}
            </Section>

            <Section active={activeSection === "contact"}>
              <SectionTitle>Contact Us</SectionTitle>
              <ContactForm>
                <input type="text" placeholder="Subject" />
                <textarea placeholder="How can we help you?"></textarea>
                <button type="button">Send Message</button>
              </ContactForm>
            </Section>

            <Section active={activeSection === "upload"}>
              <SectionTitle>Upload Profile Image</SectionTitle>
              <UploadSection>
                <FiUpload />
                <p>Click to select a file or drag and drop</p>
                <p>JPG, PNG or GIF, max 5MB</p>
              </UploadSection>
            </Section>
          </>
        )}
      </ContentColumn>
    </ProfileContainer>
  );
};

export default Profile;