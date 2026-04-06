import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Brush, Cell 
} from 'recharts';

const HistoricalPrecip = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrecipHistory = async () => {
      setLoading(true);
      const lat = 28.6519, lon = 77.2315;
      // Archive API for Daily Precipitation Sum
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=precipitation_sum&timezone=IST`;
      
      try {
        const res = await fetch(url);
        const json = await res.json();
        
        const formatted = json.daily.time.map((t, i) => ({
          date: t,
          amount: json.daily.precipitation_sum[i] || 0, // Handling nulls
        }));
        
        setData(formatted);
      } catch (err) {
        console.error("Precip Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) fetchPrecipHistory();
  }, [startDate, endDate]);

  if (loading) return <div className="h-[350px] bg-slate-800/20 animate-pulse rounded-3xl flex items-center justify-center text-slate-500">Loading Precipitation Data...</div>;

  return (
    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 h-[400px] shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span className="w-1.5 h-5 bg-blue-400 rounded-full"></span>
          Precipitation (Total Daily - mm)
        </h3>
        {/* Total sum display (Extra polish for Assignment) */}
        <div className="text-xs text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
          Total: {data.reduce((acc, curr) => acc + curr.amount, 0).toFixed(1)} mm
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickFormatter={(d) => d.split('-').slice(1).join('/')} 
          />
          <YAxis stroke="#94a3b8" fontSize={11} unit="mm" />
          <Tooltip 
            cursor={{ fill: '#1e293b', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
          />
          
          <Bar dataKey="amount" radius={[4, 4, 0, 0]} name="Rainfall (mm)">
            {data.map((entry, index) => (
              // Agar baarish 0 se zyada hai toh bright blue, warna dark
              <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#38bdf8' : '#1e293b'} />
            ))}
          </Bar>

          <Brush dataKey="date" height={30} stroke="#475569" fill="#0f172a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalPrecip;