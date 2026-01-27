// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ChevronRight, Zap } from 'lucide-react';
// import LiveKitWidgetSticky from '../components/ai_avatar/LiveKitWidgetSticky';

// const Home = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex items-center">
//       {/* Background Visuals */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
//         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
//       </div>

//       <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">

//           {/* --- Left Side Content --- */}
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }}
//             className="flex flex-col space-y-10"
//           >
//             <div className="space-y-6">
//               <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-indigo-400 text-[10px] font-black uppercase tracking-widest">
//                 <Zap size={12} fill="currentColor" /> AI Powered Experience
//               </div>

//               <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter">
//                 REDEFINE <br /> 
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-500">
//                   YOUR PACE.
//                 </span>
//               </h1>

//               <p className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed">
//                 Experience the future of footwear. Our AI Concierge analyzes your movement in real-time to find your <span className="text-white">perfect fit.</span>
//               </p>
//             </div>

//             {/* --- CTA Buttons (Fixed Padding & Alignment) --- */}
//             <div className="flex flex-wrap gap-5">
//               <button 
//                 onClick={() => navigate('/products')} 
//                 className="h-14 px-10 bg-white text-black text-[13px] font-black uppercase tracking-widest rounded-md 
//                            flex items-center justify-center gap-3 
//                            hover:bg-indigo-600 hover:text-white 
//                            active:scale-95 transition-all duration-300 shadow-xl"
//               >
//                 SHOP COLLECTION <ChevronRight size={18} strokeWidth={3} />
//               </button>

//               <button className="h-14 px-10 bg-transparent text-white text-[13px] font-black uppercase tracking-widest rounded-md 
//                                  border-2 border-white/10 flex items-center justify-center 
//                                  hover:border-white hover:bg-white/5 active:scale-95 transition-all duration-300">
//                 LEARN MORE
//               </button>
//             </div>
//           </motion.div>

//           {/* --- Right Side Widget --- */}
//           <motion.div 
//             initial={{ opacity: 0, scale: 0.98 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="w-full flex justify-center lg:justify-end"
//           >

//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;





import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Play } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden flex items-center">
      {/* --- Advanced Background Decor --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* --- Left Side: Content --- */}
          <div className="space-y-10 animate-fade-in-up">
            <div className="space-y-6">


              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter italic">
                STEP INTO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                  HYPERSPACE
                </span>
              </h1>


            </div>


          </div>

          {/* --- Right Side: Animated Shoe --- */}
          <div className="relative flex justify-center items-center">
            {/* Shoe Glow Effect */}
            <div className="absolute w-[80%] h-[80%] bg-indigo-500/20 blur-[100px] rounded-full animate-soft-glow"></div>

            {/* The Shoe Image */}
            <div className="relative z-10 animate-float">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=75&w=1200&auto=format&fit=crop"
                alt="Premium Sneaker"
                fetchpriority="high"
                loading="eager"
                className="w-full max-w-[600px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700"
              />

              {/* Product Badge */}

            </div>

            {/* Background Text Overlay */}
            <div className="absolute -z-10 text-[15rem] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter">
              2026
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;