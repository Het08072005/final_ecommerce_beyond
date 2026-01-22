// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/Navbar.css';

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <Link to="/" className="navbar-brand">
//         <span className="brand-icon">👟</span>
//         <span>ShoeMart</span>
//       </Link>
      
//       <div className="navbar-center">
//         <Link to="/products" className="nav-link">
//           All Shoes
//         </Link>
//       </div>

//       <div className="navbar-right">
//         <Link to="/products" className="nav-link">
//           Shop
//         </Link>
//         <div className="cart-icon">
//           🛒
//           <span className="cart-badge">0</span>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;








// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ShoppingBag, Search, User } from 'lucide-react';
// import '../styles/Navbar.css';

// const Navbar = () => {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
//       <div className="navbar-container">
//         {/* Logo Section */}
//         <Link to="/" className="navbar-logo">
//           SHOE<span className="logo-light">MART</span>
//           <div className="logo-dot"></div>
//         </Link>

//         {/* Navigation Links */}
//         <div className="nav-menu">
//           <Link to="/" className="nav-item">Home</Link>
//           <Link to="/products" className="nav-item">New Arrivals</Link>
//           <Link to="/products" className="nav-item">Collections</Link>
//         </div>

//         {/* Actions Section */}
//         <div className="navbar-actions">
//           <button className="icon-btn">
//             <Search size={20} />
//           </button>
//           <button className="icon-btn">
//             <User size={20} />
//           </button>
//           <Link to="/cart" className="cart-wrapper">
//             <ShoppingBag size={22} />
//             <span className="cart-badge">3</span>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { ShoppingBag, Search, User } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Get current route

  // Check if we are on the products page
  const isProductPage = location.pathname === '/products';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    /* Combine classes: if it's products page OR scrolled, apply dark styles */
    <nav className={`navbar ${scrolled || isProductPage ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          SHOE<span className="logo-light">MART</span>
          <div className="logo-dot"></div>
        </Link>

        {/* Navigation Links */}
        <div className="nav-menu">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/products" className="nav-item">New Arrivals</Link>
          <Link to="/products" className="nav-item">Collections</Link>
        </div>

        {/* Actions Section */}
        <div className="navbar-actions">
          <button className="icon-btn">
            <Search size={20} />
          </button>
          <button className="icon-btn">
            <User size={20} />
          </button>
          <Link to="/cart" className="cart-wrapper">
            <ShoppingBag size={22} />
            <span className="cart-badge">3</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;