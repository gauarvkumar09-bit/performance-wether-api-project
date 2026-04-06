import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Brush 
} from 'recharts';

const HistoricalAQI = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAQIHistory = async () => {
      setLoading(true);
      const lat = 28.6519, lon = 77.2315;
      
      // ✅ Using Air Quality Archive API (Note the different domain)
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&hourly=pm10,pm2_5&timezone=IST`;
      
      try {
        const res = await fetch(url);
        const json = await res.json();
        
        // Data Formatting: Archive API hourly data bhejti hai, 
        // hum trends ke liye usse format karenge
        const formatted = json.hourly.time.map((t, i) => ({
          time: t.replace('T', ' '),
          pm10: json.hourly.pm10[i],
          pm25: json.hourly.pm2_5[i],
        }));
        
        setData(formatted);
      } catch (err) {
        console.error("AQI Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) fetchAQIHistory();
  }, [startDate, endDate]);

  if (loading) return <div className="h-[400px] bg-slate-800/20 animate-pulse rounded-3xl flex items-center justify-center text-slate-500">Analyzing Air Quality Trends...</div>;

  return (
    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 h-[450px] shadow-xl">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-purple-500 rounded-full"></span>
        Air Quality Trends (PM10 & PM2.5)
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickFormatter={(str) => str.split(' ')[0].split('-').slice(1).join('/')} 
          />
          <YAxis stroke="#94a3b8" fontSize={11} unit=" μg/m³" />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
          />
          <Legend verticalAlign="top" height={36} />
          
          {/* PM10 Line (Yellowish/Orange) */}
          <Line 
            type="monotone" 
            dataKey="pm10" 
            stroke="#fbbf24" 
            strokeWidth={2} 
            dot={false} 
            name="PM10" 
          />
          
          {/* PM2.5 Line (Blue/Cyan) */}
          <Line 
            type="monotone" 
            dataKey="pm25" 
            stroke="#22d3ee" 
            strokeWidth={2} 
            dot={false} 
            name="PM2.5" 
          />

          <Brush dataKey="time" height={30} stroke="#475569" fill="#0f172a" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalAQI;