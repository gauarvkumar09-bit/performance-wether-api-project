import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Brush 
} from 'recharts';

const HistoricalWind = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Degrees ko Directions mein badalne ka function
  const getDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  useEffect(() => {
    const fetchWindHistory = async () => {
      setLoading(true);
      const lat = 28.6519, lon = 77.2315;
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=wind_speed_10m_max,wind_direction_10m_dominant&timezone=IST`;
      
      try {
        const res = await fetch(url);
        const json = await res.json();
        
        const formatted = json.daily.time.map((t, i) => ({
          date: t,
          speed: json.daily.wind_speed_10m_max[i],
          dirDeg: json.daily.wind_direction_10m_dominant[i],
          dirText: getDirection(json.daily.wind_direction_10m_dominant[i])
        }));
        
        setData(formatted);
      } catch (err) {
        console.error("Wind Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) fetchWindHistory();
  }, [startDate, endDate]);

  if (loading) return <div className="h-[400px] bg-slate-800/20 animate-pulse rounded-3xl flex items-center justify-center text-slate-500">Loading Wind Analysis...</div>;

  return (
    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 h-[450px] shadow-xl">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-teal-400 rounded-full"></span>
        Wind Speed & Dominant Direction
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickFormatter={(d) => d.split('-').slice(1).join('/')} />
          <YAxis stroke="#94a3b8" fontSize={11} unit=" km/h" />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
            formatter={(value, name, props) => [
              `${value} km/h (${props.payload.dirText})`, 
              "Max Wind"
            ]}
          />
          
          <Area 
            type="monotone" 
            dataKey="speed" 
            stroke="#2dd4bf" 
            fillOpacity={1} 
            fill="url(#colorWind)" 
            strokeWidth={3}
            name="Wind Speed"
          />

          <Brush dataKey="date" height={30} stroke="#475569" fill="#0f172a" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalWind;