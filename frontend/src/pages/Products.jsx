// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import CategoryFilter from '../components/CategoryFilter';
// import PriceFilter from '../components/PriceFilter';
// import SearchBar from '../components/SearchBar';
// import axios from '../api/axios';
// import { connectWebSocket, disconnectWebSocket } from '../websocket.js';
// import '../styles/Products.css';

// const Products = () => {
//   const [searchParams] = useSearchParams();

//   const [selectedCategory, setSelectedCategory] = useState(
//     searchParams.get('category') || 'all'
//   );
//   const [minPrice, setMinPrice] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');
//   const [sortBy, setSortBy] = useState('popular');

//   // 🔑 SEARCH STATE
//   const [searchInput, setSearchInput] = useState('');
//   const [searchResults, setSearchResults] = useState(null);
//   const [searchLoading, setSearchLoading] = useState(false);

//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // --- 🛠️ ADVANCED PRICE PARSER LOGIC ---
//   useEffect(() => {
//     if (!searchInput.trim()) return;

//     const query = searchInput.toLowerCase();

//     // Function to convert '5k' or '5.5k' to 5000 or 5500
//     const parseValue = (val) => {
//       if (val.includes('k')) {
//         return parseFloat(val.replace('k', '')) * 1000;
//       }
//       return parseFloat(val);
//     };

//     // Extract all numbers and k-values (e.g., 4000, 4k, 6.5k)
//     const priceMatches = query.match(/\d+(\.\d+)?k|\d+/g);

//     if (priceMatches) {
//       const prices = priceMatches.map(parseValue);

//       // Case 1: "4000 to 8000" or "4k to 8k" (Range)
//       if (prices.length >= 2) {
//         const sorted = [...prices].sort((a, b) => a - b);
//         setMinPrice(sorted[0].toString());
//         setMaxPrice(sorted[1].toString());
//       } 
//       // Case 2: "under 5000" or "below 5k"
//       else if (query.includes('under') || query.includes('below') || query.includes('less')) {
//         setMinPrice('');
//         setMaxPrice(prices[0].toString());
//       }
//       // Case 3: "above 2000" or "over 2k"
//       else if (query.includes('above') || query.includes('over') || query.includes('more')) {
//         setMinPrice(prices[0].toString());
//         setMaxPrice('');
//       }
//     }
//   }, [searchInput]);

//   // Fetch all products
//   const fetchAllProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/all');
//       setAllProducts(response.data || []);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setAllProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllProducts();
//   }, []);

//   // WebSocket voice search
//   useEffect(() => {
//     connectWebSocket((data) => {
//       if (data.type === 'SEARCH_RESULT') {
//         setSearchInput(data.query || '');
//         setSearchResults(data.products || []);
//         setAllProducts(data.products || []);
//       }
//     });

//     return () => disconnectWebSocket();
//   }, []);

//   // ✅ AUTO CLEAR SEARCH RESULTS WHEN INPUT IS EMPTY
//   useEffect(() => {
//     if (searchInput.trim() === '') {
//       setSearchResults(null); 
//       setMinPrice('');
//       setMaxPrice('');
//       if (allProducts.length === 0 || searchResults !== null) {
//           fetchAllProducts();
//       }
//     }
//   }, [searchInput]);

//   // Apply filters logic
//   useEffect(() => {
//     let filtered = [...allProducts];

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(
//         (product) => product.gender === selectedCategory
//       );
//     }

//     if (minPrice) {
//       filtered = filtered.filter(
//         (product) => product.price >= Number(minPrice)
//       );
//     }

//     if (maxPrice) {
//       filtered = filtered.filter(
//         (product) => product.price <= Number(maxPrice)
//       );
//     }

//     if (sortBy === 'price-low') {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortBy === 'price-high') {
//       filtered.sort((a, b) => b.price - a.price);
//     } else if (sortBy === 'newest') {
//       filtered.sort((a, b) => b.id - a.id);
//     }

//     setFilteredProducts(filtered);
//   }, [selectedCategory, minPrice, maxPrice, sortBy, allProducts]);

//   // Manual Search (API)
//   const handleSearch = async (term) => {
//     if (!term.trim()) return;

//     try {
//       setSearchLoading(true);
//       await axios.get('/search', {
//         params: { q: term }
//       });
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchInput('');
//     setSearchResults(null);
//     setMinPrice('');
//     setMaxPrice('');
//     fetchAllProducts();
//   };

//   const displayProducts =
//     searchResults !== null ? searchResults : filteredProducts;

//   return (
//     <div className="products-container">
//       {/* 🔑 PASSING onChange TO SYNC INPUT IMMEDIATELY */}
//       <SearchBar
//         value={searchInput}
//         onChange={setSearchInput}
//         onSearch={handleSearch}
//       />

//       {searchResults !== null && (
//         <div style={{ padding: '0 20px' }}>
//           <button
//             onClick={handleClearSearch}
//             className="apply-filters-btn"
//           >
//             ← Clear Search
//           </button>
//           <p style={{ color: '#666' }}>
//             {searchLoading
//               ? 'Searching...'
//               : `Found ${searchResults.length} result(s)`}
//           </p>
//         </div>
//       )}

//       <div className="products-layout">
//         <aside className="sidebar">
//           <CategoryFilter
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//           />
//           <PriceFilter
//             minPrice={minPrice}
//             setMinPrice={setMinPrice}
//             maxPrice={maxPrice}
//             setMaxPrice={setMaxPrice}
//           />
//           <button className="apply-filters-btn">
//             ✓ Apply Filters
//           </button>
//         </aside>

//         <div className="products-main">
//           <div className="products-header">
//             <h1>
//               {searchResults !== null
//                 ? 'Search Results'
//                 : 'Our Premium Shoes Collection'}
//             </h1>

//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="popular">Popular</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="newest">Newest</option>
//             </select>
//           </div>

//           {loading ? (
//             <div className="loading-state">Loading products...</div>
//           ) : displayProducts.length > 0 ? (
//             <div className="products-grid">
//               {displayProducts.map((product) => (
//                 <a
//                   key={product.id}
//                   href={`/products/${product.id}`}
//                   className="product-card"
//                 >
//                   <div className="product-image-wrapper">
//                     <img
//                       src={product.image_url || 'https://via.placeholder.com/300'}
//                       alt={product.name}
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/300';
//                       }}
//                     />
//                   </div>
//                   <div className="product-info">
//                     <p className="product-brand">{product.brand}</p>
//                     <h3 className="product-name">{product.name}</h3>
//                     <div className="product-footer">
//                       <span className="product-price">${product.price}</span>
//                       <button className="view-btn">View</button>
//                     </div>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           ) : (
//             <div className="no-results">No products found</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;










// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import CategoryFilter from '../components/CategoryFilter';
// import PriceFilter from '../components/PriceFilter';
// import SearchBar from '../components/SearchBar';
// import axios from '../api/axios';
// import { connectWebSocket, disconnectWebSocket } from '../websocket.js';
// import '../styles/Products.css';

// const Products = () => {
//   const [searchParams] = useSearchParams();

//   const [selectedCategory, setSelectedCategory] = useState(
//     searchParams.get('category') || 'all'
//   );

//   const [minPrice, setMinPrice] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');
//   const [sortBy, setSortBy] = useState('popular');

//   // 🔑 SEARCH
//   const [searchInput, setSearchInput] = useState('');
//   const [searchResults, setSearchResults] = useState(null);
//   const [searchLoading, setSearchLoading] = useState(false);

//   // 🆕 SIZE FILTER STATE
//   const [selectedSize, setSelectedSize] = useState('');

//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // --- 🛠️ PRICE + SIZE PARSER ---
//   useEffect(() => {
//     if (!searchInput.trim()) return;

//     const query = searchInput.toLowerCase();

//     // PRICE PARSER
//     const parseValue = (val) => {
//       if (val.includes('k')) {
//         return parseFloat(val.replace('k', '')) * 1000;
//       }
//       return parseFloat(val);
//     };

//     const priceMatches = query.match(/\d+(\.\d+)?k|\d+/g);

//     if (priceMatches) {
//       const prices = priceMatches.map(parseValue);

//       if (prices.length >= 2) {
//         const sorted = [...prices].sort((a, b) => a - b);
//         setMinPrice(sorted[0].toString());
//         setMaxPrice(sorted[1].toString());
//       } else if (
//         query.includes('under') ||
//         query.includes('below') ||
//         query.includes('less')
//       ) {
//         setMinPrice('');
//         setMaxPrice(prices[0].toString());
//       } else if (
//         query.includes('above') ||
//         query.includes('over') ||
//         query.includes('more')
//       ) {
//         setMinPrice(prices[0].toString());
//         setMaxPrice('');
//       }
//     }

//     // 🆕 SIZE PARSER (size 9, shoe 8, 10 size)
//     const sizeMatch = query.match(/size\s*(\d+)|(\d+)\s*size|shoe\s*(\d+)/);

//     if (sizeMatch) {
//       const size =
//         sizeMatch[1] || sizeMatch[2] || sizeMatch[3];
//       setSelectedSize(size);
//     }
//   }, [searchInput]);

//   // FETCH ALL PRODUCTS
//   const fetchAllProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/all');
//       setAllProducts(response.data || []);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setAllProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllProducts();
//   }, []);

//   // WEBSOCKET SEARCH
//   useEffect(() => {
//     connectWebSocket((data) => {
//       if (data.type === 'SEARCH_RESULT') {
//         setSearchInput(data.query || '');
//         setSearchResults(data.products || []);
//         setAllProducts(data.products || []);
//       }
//     });

//     return () => disconnectWebSocket();
//   }, []);

//   // AUTO CLEAR
//   useEffect(() => {
//     if (searchInput.trim() === '') {
//       setSearchResults(null);
//       setMinPrice('');
//       setMaxPrice('');
//       setSelectedSize('');
//       fetchAllProducts();
//     }
//   }, [searchInput]);

//   // 🔥 APPLY FILTERS (CATEGORY + PRICE + SIZE)
//   useEffect(() => {
//     let filtered = [...allProducts];

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(
//         (product) => product.gender === selectedCategory
//       );
//     }

//     if (minPrice) {
//       filtered = filtered.filter(
//         (product) => product.price >= Number(minPrice)
//       );
//     }

//     if (maxPrice) {
//       filtered = filtered.filter(
//         (product) => product.price <= Number(maxPrice)
//       );
//     }

//     // 🆕 SIZE FILTER LOGIC
//     if (selectedSize) {
//       filtered = filtered.filter(
//         (product) =>
//           Array.isArray(product.sizes) &&
//           product.sizes.includes(Number(selectedSize))
//       );
//     }

//     if (sortBy === 'price-low') {
//       filtered.sort((a, b) => a.price - b.price);
//     } else if (sortBy === 'price-high') {
//       filtered.sort((a, b) => b.price - a.price);
//     } else if (sortBy === 'newest') {
//       filtered.sort((a, b) => b.id - a.id);
//     }

//     setFilteredProducts(filtered);
//   }, [
//     selectedCategory,
//     minPrice,
//     maxPrice,
//     selectedSize,
//     sortBy,
//     allProducts
//   ]);

//   // MANUAL SEARCH
//   const handleSearch = async (term) => {
//     if (!term.trim()) return;

//     try {
//       setSearchLoading(true);
//       await axios.get('/search', {
//         params: { q: term }
//       });
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchInput('');
//     setSearchResults(null);
//     setMinPrice('');
//     setMaxPrice('');
//     setSelectedSize('');
//     fetchAllProducts();
//   };

//   const displayProducts =
//     searchResults !== null ? searchResults : filteredProducts;

//   return (
//     <div className="products-container">
//       <SearchBar
//         value={searchInput}
//         onChange={setSearchInput}
//         onSearch={handleSearch}
//       />

//       {searchResults !== null && (
//         <div style={{ padding: '0 20px' }}>
//           <button
//             onClick={handleClearSearch}
//             className="apply-filters-btn"
//           >
//             ← Clear Search
//           </button>
//           <p style={{ color: '#666' }}>
//             {searchLoading
//               ? 'Searching...'
//               : `Found ${searchResults.length} result(s)`}
//           </p>
//         </div>
//       )}

//       <div className="products-layout">
//         <aside className="sidebar">
//           <CategoryFilter
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//           />
//           <PriceFilter
//             minPrice={minPrice}
//             setMinPrice={setMinPrice}
//             maxPrice={maxPrice}
//             setMaxPrice={setMaxPrice}
//           />
//           <button className="apply-filters-btn">
//             ✓ Apply Filters
//           </button>
//         </aside>

//         <div className="products-main">
//           <div className="products-header">
//             <h1>
//               {searchResults !== null
//                 ? 'Search Results'
//                 : 'Our Premium Shoes Collection'}
//             </h1>

//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="popular">Popular</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="newest">Newest</option>
//             </select>
//           </div>

//           {loading ? (
//             <div className="loading-state">Loading products...</div>
//           ) : displayProducts.length > 0 ? (
//             <div className="products-grid">
//               {displayProducts.map((product) => (
//                 <a
//                   key={product.id}
//                   href={`/products/${product.id}`}
//                   className="product-card"
//                 >
//                   <div className="product-image-wrapper">
//                     <img
//                       src={product.image_url || 'https://via.placeholder.com/300'}
//                       alt={product.name}
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/300';
//                       }}
//                     />
//                   </div>
//                   <div className="product-info">
//                     <p className="product-brand">{product.brand}</p>
//                     <h3 className="product-name">{product.name}</h3>
//                     <div className="product-footer">
//                       <span className="product-price">${product.price}</span>
//                       <button className="view-btn">View</button>
//                     </div>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           ) : (
//             <div className="no-results">No products found</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;














import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import PriceFilter from '../components/PriceFilter';
import SearchBar from '../components/SearchBar';
import axios from '../api/axios';
import '../styles/Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // 🔑 SEARCH
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // 🆕 SIZE FILTER STATE
  const [selectedSize, setSelectedSize] = useState('');

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🆕 PAGINATION STATE
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef();

  // --- 🛠️ INFINITE SCROLL OBSERVER ---
  const lastProductElementRef = useCallback(node => {
    if (loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip(prevSkip => prevSkip + 20);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, isFetchingMore, hasMore]);

  // --- 🛠️ FETCH LOGIC ---
  const fetchProducts = async (currentSkip, isAppend = false) => {
    try {
      if (isAppend) setIsFetchingMore(true);
      else setLoading(true);

      // If we are in search mode, use /search
      if (searchResults !== null || searchInput.trim()) {
        const term = searchInput.trim();
        const response = await axios.get('/search', {
          params: { q: term, skip: currentSkip, limit: 20 }
        });
        const data = response.data || [];
        if (isAppend) {
          setSearchResults(prev => [...prev, ...data]);
        } else {
          setSearchResults(data);
        }
        setHasMore(data.length === 20);
      } else {
        // Normal fetch /all with filters
        const params = {
          skip: currentSkip,
          limit: 20,
          gender: selectedCategory !== 'all' ? selectedCategory : undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
          size: selectedSize || undefined
        };
        const response = await axios.get('/all', { params });
        const data = response.data || [];
        if (isAppend) {
          setAllProducts(prev => [...prev, ...data]);
        } else {
          setAllProducts(data);
          setSearchResults(null);
        }
        setHasMore(data.length === 20);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Ref to track if the search was triggered by WS (to avoid double fetching)
  const isFromWS = useRef(false);

  // Reset and fetch when filters change
  useEffect(() => {
    if (isFromWS.current) {
      isFromWS.current = false;
      return;
    }
    setSkip(0);
    setHasMore(true);
    fetchProducts(0, false);
  }, [selectedCategory, minPrice, maxPrice, selectedSize, searchInput]);

  // Fetch more when skip changes
  useEffect(() => {
    if (skip > 0) {
      fetchProducts(skip, true);
    }
  }, [skip]);

  // Listen for Global WebSocket Searches (Dispatched from App.jsx)
  useEffect(() => {
    const handleWSResult = (event) => {
      const data = event.detail;
      console.log("Products received WS Data:", data);

      if (data.type === 'SEARCH_RESULT') {
        const query = data.query || '';
        const products = data.products || [];

        // 1. Mark as WS so the other useEffect doesn't re-fetch
        isFromWS.current = true;

        // 2. Update states directly
        setSearchInput(query);
        setSearchResults(products);
        setAllProducts(products);
        setHasMore(products.length === 20); // standard limit is 20
        setSkip(0);
      }
    };

    window.addEventListener("ws-search-result", handleWSResult);

    // 🆕 Check if there's a pending search result from before we mounted (e.g. during navigation)
    if (window.lastWSSearchResult) {
      console.log("Found pending WS result, applying...");
      handleWSResult({ detail: window.lastWSSearchResult });
      window.lastWSSearchResult = null; // Consume it
    }

    return () => window.removeEventListener("ws-search-result", handleWSResult);
  }, []);

  // MANUAL SEARCH
  const handleSearch = async (term) => {
    setSearchInput(term);
    // useEffect will handle the fetching
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchResults(null);
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSkip(0);
    setHasMore(true);
    fetchProducts(0, false);
  };

  // Current display products (already filtered by backend)
  const productsToDisplay = searchResults !== null ? searchResults : allProducts;

  // Frontend Sorting (only on the current list, moving to backend would be better but let's keep it simple)
  // Actually, if we want proper sorting, it should be on backend. 
  // Let's at least sort what we have.
  const displayProducts = [...productsToDisplay];
  if (sortBy === 'price-low') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    displayProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    displayProducts.sort((a, b) => b.id - a.id);
  }

  // --- 🛠️ PRICE + SIZE PARSER (for searchInput) ---
  useEffect(() => {
    if (!searchInput.trim()) return;
    const query = searchInput.toLowerCase();
    const parseValue = (val) => val.includes('k') ? parseFloat(val.replace('k', '')) * 1000 : parseFloat(val);
    const priceMatches = query.match(/\d+(\.\d+)?k|\d+/g);
    if (priceMatches) {
      const prices = priceMatches.map(parseValue);
      if (prices.length >= 2) {
        const sorted = [...prices].sort((a, b) => a - b);
        setMinPrice(sorted[0].toString());
        setMaxPrice(sorted[1].toString());
      } else if (query.includes('under') || query.includes('below') || query.includes('less')) {
        setMinPrice('');
        setMaxPrice(prices[0].toString());
      } else if (query.includes('above') || query.includes('over') || query.includes('more')) {
        setMinPrice(prices[0].toString());
        setMaxPrice('');
      }
    }
    const sizeMatch = query.match(/size\s*(\d+)|(\d+)\s*size|shoe\s*(\d+)/);
    if (sizeMatch) {
      const size = sizeMatch[1] || sizeMatch[2] || sizeMatch[3];
      setSelectedSize(size);
    }
  }, [searchInput]);

  // Render Color Circles helper
  const renderColorDots = (colors) => {
    if (!colors) return null;
    const colorArray = Array.isArray(colors) ? colors : [colors];

    return (
      <div className="product-color-dots">
        {colorArray.map((color, index) => (
          <span
            key={index}
            className="color-dot"
            style={{
              backgroundColor: color.toLowerCase().replace(' ', ''),
              border: color.toLowerCase() === 'white' ? '1px solid #ddd' : 'none'
            }}
            title={color}
          ></span>
        ))}
      </div>
    );
  };

  return (
    <div className="products-container">
      <SearchBar
        value={searchInput}
        onSearch={handleSearch}
      />

      {searchResults !== null && (
        <div style={{ padding: '0 20px' }}>
          <button
            onClick={handleClearSearch}
            className="apply-filters-btn"
          >
            ← Clear Search
          </button>
          <p style={{ color: '#666' }}>
            {searchLoading
              ? 'Searching...'
              : `Found ${searchResults.length} result(s)`}
          </p>
        </div>
      )}

      {/* MODIFIED LAYOUT: Products Left, Sidebar Right */}
      <div className="products-layout" style={{ flexDirection: 'row' }}>

        {/* PRODUCTS MAIN (Left Side) */}
        <div className="products-main" style={{ flex: '1' }}>
          <div className="products-header">
            <h1>
              {searchResults !== null
                ? 'Search Results'
                : 'Our Premium Shoes Collection'}
            </h1>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading && skip === 0 ? (
            <div className="loading-state">Loading products...</div>
          ) : displayProducts.length > 0 ? (
            <>
              <div className="products-grid">
                {displayProducts.map((product, index) => {
                  const isLastElement = displayProducts.length === index + 1;
                  return (
                    <a
                      key={`${product.id}-${index}`} // Use index to avoid duplicate key issues if same product appears
                      ref={isLastElement ? lastProductElementRef : null}
                      href={`/products/${product.id}`}
                      className="product-card"
                    >
                      <div className="product-image-wrapper">
                        <img
                          src={product.image_url || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300';
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <div className="brand-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <p className="product-brand">{product.brand}</p>
                          {/* 🆕 COLOR DOTS ADDED HERE */}
                          {renderColorDots(product.colors || product.color)}
                        </div>
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-footer">
                          <span className="product-price">${product.price}</span>
                          <button className="view-btn">View</button>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
              {isFetchingMore && (
                <div className="loading-more" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  Loading more products...
                </div>
              )}
              {!hasMore && displayProducts.length > 0 && (
                <div className="no-more" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No more products to show.
                </div>
              )}
            </>
          ) : (
            <div className="no-results">No products found</div>
          )}
        </div>

        {/* SIDEBAR (Right Side) */}
        <aside className="sidebar" style={{ width: '280px', marginLeft: '20px' }}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <PriceFilter
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
          <button className="apply-filters-btn">
            ✓ Apply Filters
          </button>
        </aside>

      </div>
    </div>
  );
};

export default Products;