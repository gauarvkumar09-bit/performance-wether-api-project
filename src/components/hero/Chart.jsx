import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Brush, CartesianGrid, Legend 
} from 'recharts';

const Chart = ({ hourlyData, airQualityData }) => {
  const [unit, setUnit] = useState('C');
  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    // 1. Data Processing: Dono APIs ke data ko merge karna
    if (hourlyData && airQualityData) {
      const formatted = hourlyData.time.slice(0, 24).map((t, index) => {
        const tempC = hourlyData.temperature_2m[index];
        return {
          time: new Date(t).getHours() + ":00",
          tempC: tempC,
          tempF: ((tempC * 9/5) + 32).toFixed(1), // C to F conversion
          humidity: hourlyData.relative_humidity_2m[index],
          precip: hourlyData.precipitation[index],
          visibility: hourlyData.visibility[index],
          wind: hourlyData.wind_speed_10m[index],
          // Air Quality data ko hourly index se match karna
          pm10: airQualityData.hourly?.pm10[index] || 0,
          pm25: airQualityData.hourly?.pm2_5[index] || 0,
        };
      });
      setCombinedData(formatted);
    }
  }, [hourlyData, airQualityData]);

  if (!combinedData.length) return <div className="p-10 text-center text-slate-500">Preparing Charts...</div>;

  return (
    <div className="space-y-8 p-4">
      {/* 1. Unit Toggle Button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          Switch to °{unit === 'C' ? 'F' : 'C'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRAPH 1: Temperature */}
        <GraphCard title={`Temperature (°${unit})`}>
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px' }} />
            <Line type="monotone" dataKey={unit === 'C' ? 'tempC' : 'tempF'} stroke="#f87171" strokeWidth={3} dot={false} name={`Temp °${unit}`} />
            <Brush dataKey="time" height={30} stroke="#475569" fill="#0f172a" />
          </LineChart>
        </GraphCard>

        {/* GRAPH 2: PM10 & PM2.5 Combined */}
        <GraphCard title="Air Quality (PM10 & PM2.5)">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px' }} />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="pm10" stroke="#fbbf24" strokeWidth={2} name="PM10" dot={false} />
            <Line type="monotone" dataKey="pm25" stroke="#60a5fa" strokeWidth={2} name="PM2.5" dot={false} />
            <Brush dataKey="time" height={30} stroke="#475569" fill="#0f172a" />
          </LineChart>
        </GraphCard>

        {/* GRAPH 3: Relative Humidity */}
        <GraphCard title="Relative Humidity (%)">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Line type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} name="Humidity %" dot={false} />
            <Brush dataKey="time" height={30} stroke="#475569" fill="#0f172a" />
          </LineChart>
        </GraphCard>

        {/* GRAPH 4: Precipitation */}
        <GraphCard title="Precipitation (mm)">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Line type="step" dataKey="precip" stroke="#0ea5e9" strokeWidth={2} name="Precipitation" dot={false} />
            <Brush dataKey="time" height={30} stroke="#475569" fill="#0f172a" />
          </LineChart>
        </GraphCard>

        {/* GRAPH 5: Visibility */}
        <GraphCard title="Visibility (meters)">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Line type="monotone" dataKey="visibility" stroke="#a855f7" strokeWidth={2} name="Visibility" dot={false} />
            <Brush dataKey="time" height={30} stroke="#475569" fill="#0f172a" />
          </LineChart>
        </GraphCard>

        {/* GRAPH 6: Wind Speed */}
        <GraphCard title="Wind Speed (km/h)">
          <LineChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Line type="monotone" dataKey="wind" stroke="#f97316" strokeWidth={2} name="Wind Speed" dot={false} />
            <Brush dataKey="time" height={30} stroke="#475569" fill="#0f172a" />
          </LineChart>
        </GraphCard>

      </div>
    </div>
  );
};

// Reusable Container Fix (to handle Recharts resizing)
const GraphCard = ({ title, children }) => (
  /* 1. Parent div ki height 'auto' rakho taaki aspect ratio kaam kare */
  <div className="bg-slate-800/60 p-4 rounded-3xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
    
    <h4 className="text-slate-400 font-bold mb-4 text-xs uppercase tracking-widest text-center shrink-0">
      {title}
    </h4>

    {/* 2. ResponsiveContainer mein 'aspect' ratio de do (2 ka matlab Width = 2x Height) */}
    <div className="w-full overflow-hidden">
      <ResponsiveContainer width="100%" aspect={2}>
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default Chart;