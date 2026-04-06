import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Brush 
} from 'recharts';

const HistoricalTemp = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTempHistory = async () => {
      setLoading(true);
      const lat = 28.6519, lon = 77.2315;
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=IST`;
      
      try {
        const res = await fetch(url);
        const json = await res.json();
        
        // Formatting for Recharts
        const formatted = json.daily.time.map((t, i) => ({
          date: t,
          max: json.daily.temperature_2m_max[i],
          min: json.daily.temperature_2m_min[i],
          mean: json.daily.temperature_2m_mean[i],
        }));
        
        setData(formatted);
      } catch (err) {
        console.error("Temp Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) fetchTempHistory();
  }, [startDate, endDate]); // Jab bhi parent mein date badlegi, ye naya data layega

  if (loading) return <div className="h-[400px] bg-slate-800/20 animate-pulse rounded-3xl flex items-center justify-center text-slate-500">Loading Temp Trends...</div>;

  return (
    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 h-[450px] shadow-xl transition-all hover:border-slate-500">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
        <span className="w-1.5 h-5 bg-red-500 rounded-full"></span>
        Temperature Analysis (Max, Mean, Min)
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickFormatter={(d) => d.split('-').slice(1).join('/')} />
          <YAxis stroke="#94a3b8" fontSize={11} unit="°C" />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
          <Legend verticalAlign="top" height={36}/>
          
          <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={3} dot={false} name="Max" animationDuration={1500} />
          <Line type="monotone" dataKey="mean" stroke="#fbbf24" strokeWidth={2} dot={false} name="Mean" animationDuration={1500} />
          <Line type="monotone" dataKey="min" stroke="#3b82f6" strokeWidth={2} dot={false} name="Min" animationDuration={1500} />

          {/* Requirement: Horizontal Scrolling & Zoom */}
          <Brush dataKey="date" height={30} stroke="#475569" fill="#0f172a" travellerWidth={10} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalTemp;