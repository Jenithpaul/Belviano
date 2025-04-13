// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { addDoc, collection, getDocs, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { FiPackage, FiList, FiGrid, FiTrash2, FiPlusCircle } from "react-icons/fi";

// Styled layout containers
const DashboardContainer = styled.div`
  display: flex;
  padding: 2.5rem;
  gap: 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  min-height: 90vh;
  background-color: ${({ theme }) => theme.bodyBg || '#f8f9fa'};
`;

const MenuColumn = styled.div`
  flex: 0 0 220px;
  background-color: ${({ theme }) => theme.sectionBg || '#ffffff'};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
`;

const ContentColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: ${({ theme }) => theme.sectionBg || '#ffffff'};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const PreviewColumn = styled.div`
  flex: 0 0 280px;
  background-color: ${({ theme }) => theme.sectionBg || '#ffffff'};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
`;

// Section header
const SectionHeader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${({ theme }) => theme.accent || '#4a90e2'};
  color: ${({ theme }) => theme.textPrimary || '#333'};
`;

// Styled form elements
const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary || '#333'};
`;

const Input = styled.input`
  padding: 0.75rem;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.borderColor || '#ddd'};
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent || '#4a90e2'};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.accent}30` || '#4a90e230'};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.borderColor || '#ddd'};
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent || '#4a90e2'};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.accent}30` || '#4a90e230'};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.25rem;
  background-color: ${({ theme, secondary }) => secondary ? '#ffffff' : theme.accent || '#4a90e2'};
  color: ${({ theme, secondary }) => secondary ? theme.accent || '#4a90e2' : '#ffffff'};
  border: ${({ theme, secondary }) => secondary ? `1px solid ${theme.accent || '#4a90e2'}` : 'none'};
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme, secondary }) => secondary ? '#f8f9fa' : theme.accentDark || '#3a80d2'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

// Styled menu item
const MenuItem = styled.div`
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  color: ${({ active, theme }) => active ? theme.accent || '#4a90e2' : theme.textPrimary || '#333'};
  background-color: ${({ active, theme }) => active ? `${theme.accent}10` || '#4a90e210' : 'transparent'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: ${({ active }) => active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, active }) => active ? `${theme.accent}10` || '#4a90e210' : `${theme.accent}05` || '#4a90e205'};
    color: ${({ theme }) => theme.accent || '#4a90e2'};
  }
`;

// Styled product preview card
const PreviewCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.textPrimary || '#333'};
  }

  p {
    margin: 0.5rem 0;
    color: ${({ theme }) => theme.textSecondary || '#666'};
  }
`;

const ProductItem = styled.div`
  padding: 1.25rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  
  strong {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.textPrimary || '#333'};
  }
  
  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.textSecondary || '#666'};
    margin-top: 0.25rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: ${({ theme }) => theme.textSecondary || '#666'};
  
  p {
    margin-bottom: 1rem;
  }
`;

const AdminDashboard = () => {
  // State for product details.
  const [product, setProduct] = useState({
    title: "",
    price: "",
    sizes: [],
    image: "",
    quantity: "",
    category: ""
  });
  // For displaying product list when managing products
  const [productList, setProductList] = useState([]);
  
  // State to track form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample sizes and categories.
  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const categories = ["Shirt", "T-Shirt", "Hoodies", "Full Sleeves", "Jackets", "Pants"];

  // State to determine active menu: "addProduct", "manageProducts", "collections"
  const [activeMenu, setActiveMenu] = useState("addProduct");

  // Real-time listener for product list when in "manageProducts" mode.
  useEffect(() => {
    if (activeMenu === "manageProducts") {
      const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductList(products);
      });
      return unsubscribe;
    }
  }, [activeMenu]);

  // Update product state on form change.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Update state for available sizes.
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setProduct(prev => {
      let newSizes = [...prev.sizes];
      if (checked) {
        newSizes.push(value);
      } else {
        newSizes = newSizes.filter(size => size !== value);
      }
      return { ...prev, sizes: newSizes };
    });
  };

  // Handler for submitting new product.
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "products"), {
        ...product,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
        createdAt: new Date()
      });
      
      alert("Product added successfully!");
      setProduct({
        title: "",
        price: "",
        sizes: [],
        image: "",
        quantity: "",
        category: ""
      });
    } catch (err) {
      console.error("Error adding product: ", err);
      alert("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form handler
  const handleResetForm = () => {
    setProduct({
      title: "",
      price: "",
      sizes: [],
      image: "",
      quantity: "",
      category: ""
    });
  };

  // Delete product handler (for manageProducts).
  const handleDeleteProduct = async (prodId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", prodId));
        alert("Product deleted successfully!");
      } catch (err) {
        console.error("Error deleting product: ", err);
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <DashboardContainer>
      {/* Left Column: Admin Menu */}
      <MenuColumn>
        <SectionHeader>Dashboard</SectionHeader>
        <MenuItem 
          active={activeMenu === "addProduct"} 
          onClick={() => setActiveMenu("addProduct")}
        >
          <FiPlusCircle /> Add Product
        </MenuItem>
        <MenuItem 
          active={activeMenu === "manageProducts"} 
          onClick={() => setActiveMenu("manageProducts")}
        >
          <FiList /> Manage Products
        </MenuItem>
        <MenuItem 
          active={activeMenu === "collections"} 
          onClick={() => setActiveMenu("collections")}
        >
          <FiGrid /> Collections
        </MenuItem>
      </MenuColumn>

      {/* Middle Column */}
      <ContentColumn>
        {activeMenu === "addProduct" && (
          <>
            <SectionHeader>Add New Product</SectionHeader>
            <form onSubmit={handleAddProduct}>
              <FormField>
                <Label>Product Name</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter product name"
                  value={product.title}
                  onChange={handleChange}
                  required
                />
              </FormField>
              
              <FormField>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={product.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </FormField>
              
              <FormField>
                <Label>Available Sizes</Label>
                <CheckboxGroup>
                  {availableSizes.map(size => (
                    <CheckboxLabel key={size}>
                      <input
                        type="checkbox"
                        value={size}
                        checked={product.sizes.includes(size)}
                        onChange={handleCheckboxChange}
                      />
                      {size}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormField>
              
              <FormField>
                <Label>Image URL</Label>
                <Input
                  type="text"
                  name="image"
                  placeholder="Enter image URL"
                  value={product.image}
                  onChange={handleChange}
                  required
                />
              </FormField>
              
              <FormField>
                <Label>Available Quantity</Label>
                <Input
                  type="number"
                  name="quantity"
                  placeholder="Number of pieces"
                  value={product.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </FormField>
              
              <FormField>
                <Label>Category</Label>
                <Select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </FormField>
              
              <ButtonGroup>
                <Button type="submit" disabled={isSubmitting}>
                  <FiPlusCircle /> {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
                <Button type="button" secondary onClick={handleResetForm}>
                  Reset Form
                </Button>
              </ButtonGroup>
            </form>
          </>
        )}

        {activeMenu === "manageProducts" && (
          <>
            <SectionHeader>Manage Products</SectionHeader>
            {productList.length === 0 ? (
              <EmptyState>
                <p>No products found in the inventory.</p>
                <Button onClick={() => setActiveMenu("addProduct")}>
                  <FiPlusCircle /> Add Your First Product
                </Button>
              </EmptyState>
            ) : (
              productList.map(prod => (
                <ProductItem key={prod.id}>
                  <ProductInfo>
                    <img src={prod.image} alt={prod.title} />
                    <ProductDetails>
                      <strong>{prod.title}</strong>
                      <span>${prod.price} • {prod.category}</span>
                      <span>Stock: {prod.quantity} • Sizes: {prod.sizes?.join(", ") || "None"}</span>
                    </ProductDetails>
                  </ProductInfo>
                  <Button secondary onClick={() => handleDeleteProduct(prod.id)}>
                    <FiTrash2 /> Delete
                  </Button>
                </ProductItem>
              ))
            )}
          </>
        )}
        
        {activeMenu === "collections" && (
          <>
            <SectionHeader>Collections</SectionHeader>
            <EmptyState>
              <p>Collections management feature coming soon.</p>
              <p>This section will allow you to organize products into themed collections.</p>
            </EmptyState>
          </>
        )}
      </ContentColumn>

      {/* Right Column: Live Preview (only active in addProduct mode) */}
      {activeMenu === "addProduct" && (
        <PreviewColumn>
          <SectionHeader>Live Preview</SectionHeader>
          <PreviewCard>
            {product.image ? (
              <img src={product.image} alt={product.title} />
            ) : (
              <div style={{ 
                height: '180px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px',
                marginBottom: '1rem'
              }}>
                <span>No image preview</span>
              </div>
            )}
            <h3>{product.title || "Product Name"}</h3>
            <p style={{ fontWeight: 'bold' }}>{product.price ? `$${product.price}` : "Price"}</p>
            {product.sizes.length > 0 && <p>Sizes: {product.sizes.join(", ")}</p>}
            {product.quantity && <p>In Stock: {product.quantity}</p>}
            {product.category && <p>Category: {product.category}</p>}
          </PreviewCard>
        </PreviewColumn>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;