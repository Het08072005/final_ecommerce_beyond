// import React, { useState, useEffect } from 'react';

// const SearchBar = ({ value, onSearch }) => {
//   const [input, setInput] = useState(value || '');

//   // ✅ ALWAYS sync input when parent value changes (AUTOFILL FIX)
//   useEffect(() => {
//     setInput(value || '');
//   }, [value]);

//   // ✅ Debounced search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (input.trim()) {
//         triggerSearch(input);
//       }
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [input]);

//   // ✅ Search + WebSocket
//   const triggerSearch = (searchTerm) => {
//     onSearch(searchTerm);

//     const ws = new WebSocket('ws://localhost:8000/ws');

//     ws.onopen = () => {
//       ws.send(
//         JSON.stringify({
//           type: 'search',
//           query: searchTerm,
//         })
//       );

//       // small delay = safer delivery
//       setTimeout(() => ws.close(), 50);
//     };

//     ws.onerror = (err) => {
//       console.error('WebSocket error:', err);
//     };
//   };

//   return (
//     <div style={{ display: 'flex', margin: '50px', alignItems: 'center' }}>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Search products..."
//         style={{
//           flex: 1,
//           padding: '10px 12px',
//           fontSize: '16px',
//           border: '1px solid gray',
//           borderRadius: '25px',
//           outline: 'none',
//         }}
//       />

//       <button
//         onClick={() => triggerSearch(input)}
//         style={{
//           padding: '10px 18px',
//           marginLeft: '10px',
//           fontSize: '16px',
//           backgroundColor: '#007BFF',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '6px',
//           cursor: 'pointer',
//         }}
//       >
//         Search
//       </button>
//     </div>
//   );
// };

// export default SearchBar;



import React, { useState, useEffect } from 'react';

const SearchBar = ({ value, onSearch, onChange }) => {
  const [input, setInput] = useState(value || '');

  // Parent se value sync karne ke liye (Voice search ya manual clear ke liye)
  useEffect(() => {
    setInput(value || '');
  }, [value]);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        triggerSearch(input);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [input]);

  const triggerSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;

    onSearch(searchTerm);
    const wsUrl = import.meta.env.VITE_WS_URL;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'search',
          query: searchTerm,
        })
      );
      setTimeout(() => ws.close(), 50);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  };

  // Input change handler jo parent ko turant batata hai
  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    // if (onChange) {
    //   onChange(val); 
    // }
  };

  return (
    <div style={{ display: 'flex', margin: '50px', alignItems: 'center' }}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Search products..."
        style={{
          flex: 1,
          padding: '10px 12px',
          fontSize: '16px',
          border: '1px solid gray',
          borderRadius: '25px',
          outline: 'none',
        }}
      />

      <button
        onClick={() => triggerSearch(input)}
        style={{
          padding: '10px 18px',
          marginLeft: '10px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;