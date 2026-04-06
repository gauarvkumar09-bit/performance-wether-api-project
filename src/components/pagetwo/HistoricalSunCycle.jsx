import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Brush 
} from 'recharts';

const HistoricalSunCycle = ({ startDate, endDate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSunHistory = async () => {
      setLoading(true);
      const lat = 28.6519, lon = 77.2315;
      // Note: Archive API se sunrise/sunset fetch kar rahe hain
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=sunrise,sunset&timezone=IST`;
      
      try {
        const res = await fetch(url);
        const json = await res.json();
        
        const formatted = json.daily.time.map((t, i) => {
          const sunrise = new Date(json.daily.sunrise[i]);
          const sunset = new Date(json.daily.sunset[i]);

          return {
            date: t,
            // Decimal format mein convert kar rahe hain taaki graph par plot ho sake (e.g., 6:30 -> 6.5)
            sunrise: sunrise.getHours() + sunrise.getMinutes() / 60,
            sunset: sunset.getHours() + sunset.getMinutes() / 60,
            sunriseLabel: sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sunsetLabel: sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });
        
        setData(formatted);
      } catch (err) {
        console.error("Sun Cycle Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) fetchSunHistory();
  }, [startDate, endDate]);

  if (loading) return <div className="h-[400px] bg-slate-800/20 animate-pulse rounded-3xl flex items-center justify-center text-slate-500 text-sm">Sun Cycle data loading...</div>;

  return (
    <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 h-[450px] shadow-xl">
      <h3 className="text-white font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-orange-400 rounded-full"></span>
        Sun Cycle Trends (Sunrise & Sunset - IST)
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickFormatter={(d) => d.split('-').slice(1).join('/')} />
          
          {/* YAxis 0 se 24 hours dikhayega */}
          <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 24]} tickFormatter={(h) => `${h}:00`} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
            formatter={(value, name, props) => [
              name === "sunrise" ? props.payload.sunriseLabel : props.payload.sunsetLabel, 
              name === "sunrise" ? "Sunrise" : "Sunset"
            ]}
          />
          <Legend verticalAlign="top" height={36}/>
          
          <Area type="monotone" dataKey="sunset" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSun)" name="sunset" />
          <Area type="monotone" dataKey="sunrise" stroke="#fcd34d" fill="#0f172a" name="sunrise" />

          <Brush dataKey="date" height={30} stroke="#475569" fill="#0f172a" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalSunCycle;