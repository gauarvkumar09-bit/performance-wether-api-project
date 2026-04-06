import React, { useState } from 'react'; // 1. Import useState zaroori hai
import Pageone from './components/Pageone';
import Pagetwo from './components/Pagetwo'; // 2. Naya Page 2 import karo

const App = () => {
  const [activePage, setActivePage] = useState(1); // Default Page 1

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4">
      
      {/* --- NAVIGATION TABS --- */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700 shadow-2xl">
          <button 
            onClick={() => setActivePage(1)}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${
              activePage === 1 
              ? 'bg-blue-600 text-white shadow-lg scale-105' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            Current Weather
          </button>
          
          <button 
            onClick={() => setActivePage(2)}
            className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 ${
              activePage === 2 
              ? 'bg-blue-600 text-white shadow-lg scale-105' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            Historical Data
          </button>
        </div>
      </div>

      {/* --- PAGE RENDERING --- */}
      <main className="container mx-auto">
        {activePage === 1 ? (
          <Pageone /> 
        ) : (
          <Pagetwo /> 
        )}
      </main>

    </div>
  );
};

export default App;