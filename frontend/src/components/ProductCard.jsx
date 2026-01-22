// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   const { 
//     id, 
//     name, 
//     price, 
//     brand,
//     category, 
//     image_url,
//     colors = [],
//     sizes = []
//   } = product;

//   return (
//     <div className="product-card">
//       <div className="product-image">
//         {image_url ? (
//           <img 
//             src={image_url} 
//             alt={name}
//             style={{ 
//               width: '100%', 
//               height: '100%', 
//               objectFit: 'cover',
//               borderRadius: '8px'
//             }}
//             onError={(e) => {
//               e.target.style.display = 'none';
//               e.target.nextElementSibling.style.display = 'flex';
//             }}
//           />
//         ) : null}
//         <div 
//           style={{ 
//             display: image_url ? 'none' : 'flex',
//             width: '100%',
//             height: '100%',
//             alignItems: 'center',
//             justifyContent: 'center',
//             background: '#f0f0f0',
//             fontSize: '3rem',
//             borderRadius: '8px'
//           }}
//         >
//           👟
//         </div>
//       </div>

//       <div className="product-info">
//         <div className="product-category">{brand || category || 'Shoes'}</div>
//         <h3 className="product-name">{name}</h3>

//         {sizes.length > 0 && (
//           <div style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0' }}>
//             Sizes: {sizes.join(', ')}
//           </div>
//         )}

//         {colors.length > 0 && (
//           <div style={{ fontSize: '0.85rem', color: '#666', margin: '0.5rem 0' }}>
//             Colors: {colors.join(', ')}
//           </div>
//         )}

//         <div className="product-price" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#667eea', margin: '0.8rem 0' }}>
//           ${price || 0}
//         </div>

//         <div className="product-actions">
//           <button className="btn-cart" style={{
//             padding: '0.6rem 1rem',
//             background: '#667eea',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             width: '100%',
//             marginBottom: '0.5rem'
//           }}>
//             🛒 Add to Cart
//           </button>
//           <Link to={`/products/${id}`} className="btn-view" style={{
//             display: 'block',
//             padding: '0.6rem 1rem',
//             background: '#f0f0f0',
//             color: '#333',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             cursor: 'pointer',
//             textAlign: 'center',
//             textDecoration: 'none',
//             width: '100%'
//           }}>
//             View Details 
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;










import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react'; // Using lucide-react for cleaner icons

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    price,
    brand,
    category,
    image_url,
    colors = [],
    sizes = []
  } = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {/* Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
            New Arrival
          </span>
        </div>

        {/* Product Image */}
        {image_url ? (
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            src={image_url}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback Placeholder */}
        <div className={`w-full h-full flex items-center justify-center bg-slate-100 text-6xl ${image_url ? 'hidden' : 'flex'}`}>
          👟
        </div>

        {/* Quick Action Overlay (Visible on Hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white rounded-full shadow-lg text-slate-900 hover:bg-indigo-600 hover:text-white transition-colors"
          >
            <ShoppingCart size={20} />
          </motion.button>
          <Link to={`/products/${id}`}>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white rounded-full shadow-lg text-slate-900 hover:bg-indigo-600 hover:text-white transition-colors"
            >
              <Eye size={20} />
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-tight">
            {brand || category || 'Premium Footwear'}
          </span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={12} fill="currentColor" />
            <span className="text-xs text-slate-400 font-medium">4.8</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
          {name}
        </h3>

        {/* Color Swatches (Visual only) */}
        {colors.length > 0 && (
          <div className="flex gap-1.5 mb-3">
            {colors.slice(0, 3).map((color, index) => (
              <div 
                key={index} 
                className="w-3 h-3 rounded-full border border-slate-200" 
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {colors.length > 3 && <span className="text-[10px] text-slate-400">+{colors.length - 3}</span>}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-sm text-slate-400 line-through font-medium">
              ${(price * 1.2).toFixed(2)}
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              ${price || 0}
            </span>
          </div>
          
          <Link 
            to={`/products/${id}`}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;