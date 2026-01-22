import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/all`);
        const foundProduct = response.data.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.sizes?.length > 0) setSelectedSize(foundProduct.sizes[0]);
          if (foundProduct.colors?.length > 0) setSelectedColor(foundProduct.colors[0]);
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={centerStyle}>Loading your style...</div>;
  if (error) return <div style={{ ...centerStyle, color: '#e53e3e' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <button 
        onClick={() => navigate('/products')}
        style={backButtonStyle}
      >
        ← Back to Catalog
      </button>

      <div style={containerGridStyle}>
        {/* Left Side: Image Gallery */}
        <div style={imageContainerStyle}>
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              style={mainImageStyle}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={placeholderIconStyle}>👟</div>
        </div>

        {/* Right Side: Product Details */}
        <div style={detailsPanelStyle}>
          <div>
            <span style={brandBadgeStyle}>{product.brand}</span>
            <h1 style={titleStyle}>{product.name}</h1>
            <p style={categoryStyle}>{product.category}</p>
          </div>

          <div style={priceTagStyle}>${product.price}</div>

          <hr style={dividerStyle} />

          <p style={descriptionStyle}>
            {product.description || 'Elevate your everyday look with these premium sneakers. Designed for maximum breathability and all-day comfort without compromising on style.'}
          </p>

          {/* Size Selector */}
          {product.sizes?.length > 0 && (
            <div style={sectionSpace}>
              <label style={labelStyle}>Select Size</label>
              <div style={optionGridStyle}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={selectedSize === size ? activeOptionStyle : inactiveOptionStyle}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors?.length > 0 && (
            <div style={sectionSpace}>
              <label style={labelStyle}>Available Colors</label>
              <div style={optionGridStyle}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={selectedColor === color ? activeOptionStyle : inactiveOptionStyle}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button 
            style={addToCartButtonStyle}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Add to Bag — ${(product.price).toFixed(2)}
          </button>

          {/* Trust Badges */}
          <div style={trustNoteStyle}>
            <span>✓ Free Shipping</span>
            <span>✓ 30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Modern Styles Object ---

const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60vh',
  fontSize: '1.2rem',
  fontWeight: '500'
};

const backButtonStyle = {
  padding: '10px 16px',
  background: 'transparent',
  color: '#4a5568',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  cursor: 'pointer',
  marginBottom: '24px',
  fontSize: '0.9rem',
  transition: 'all 0.2s'
};

const containerGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  gap: '50px',
  alignItems: 'start'
};

const imageContainerStyle = {
  backgroundColor: '#f7fafc',
  borderRadius: '24px',
  aspectRatio: '1 / 1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'sticky',
  top: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
};

const mainImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  padding: '20px'
};

const placeholderIconStyle = {
  fontSize: '6rem',
  display: 'none'
};

const detailsPanelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const brandBadgeStyle = {
  color: '#667eea',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: '0.8rem'
};

const titleStyle = {
  fontSize: '2.5rem',
  margin: '4px 0',
  color: '#1a202c',
  lineHeight: '1.2'
};

const categoryStyle = {
  color: '#718096',
  fontSize: '1rem'
};

const priceTagStyle = {
  fontSize: '1.8rem',
  fontWeight: '700',
  color: '#2d3748',
  margin: '10px 0'
};

const descriptionStyle = {
  color: '#4a5568',
  lineHeight: '1.7',
  fontSize: '1.05rem'
};

const labelStyle = {
  display: 'block',
  fontWeight: '600',
  marginBottom: '12px',
  color: '#2d3748'
};

const optionGridStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
};

const sectionSpace = {
  marginTop: '15px'
};

const inactiveOptionStyle = {
  padding: '10px 20px',
  border: '1px solid #e2e8f0',
  background: 'white',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const activeOptionStyle = {
  ...inactiveOptionStyle,
  borderColor: '#667eea',
  background: '#667eea',
  color: 'white',
  fontWeight: '600'
};

const addToCartButtonStyle = {
  marginTop: '30px',
  padding: '18px',
  background: '#1a202c',
  color: 'white',
  border: 'none',
  borderRadius: '14px',
  fontSize: '1.1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const trustNoteStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '15px',
  fontSize: '0.85rem',
  color: '#718096',
  justifyContent: 'center'
};

const dividerStyle = {
  border: 'none',
  borderTop: '1px solid #edf2f7',
  margin: '10px 0'
};

export default ProductDetails;