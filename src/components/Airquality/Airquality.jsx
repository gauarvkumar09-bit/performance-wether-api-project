import React from 'react';

const Airquality = ({ data }) => {
  // 1. Safety Check: Agar data fetch ho raha hai toh crash na ho
  if (!data || !data.current) {
    return <div className="p-10 text-slate-500 text-center">Loading Air Quality Data...</div>;
  }

  // 2. Metrics Array: API data ko UI layout ke liye structure karna
  const metrics = [
    { label: "PM10", value: data.current.pm10, unit: "µg/m³", color: "border-yellow-500" },
    { label: "PM2.5", value: data.current.pm2_5, unit: "µg/m³", color: "border-blue-500" },
    { label: "Carbon Monoxide (CO)", value: data.current.carbon_monoxide, unit: "µg/m³", color: "border-green-500" },
    { label: "Carbon Dioxide (CO2)", value: data.current.carbon_dioxide || "N/A", unit: "ppm", color: "border-emerald-500" },
    { label: "Nitrogen Dioxide (NO2)", value: data.current.nitrogen_dioxide, unit: "µg/m³", color: "border-purple-500" },
    { label: "Sulphur Dioxide (SO2)", value: data.current.sulphur_dioxide, unit: "µg/m³", color: "border-pink-500" },
  ];

  return (
    <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-2xl mt-6 border border-slate-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-200">Air Quality Dashboard</h2>
      
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((item, index) => (
          <div 
            key={index} 
            className={`p-4 bg-slate-800 rounded-xl border-t-4 ${item.color} shadow-lg hover:scale-105 transition-transform duration-300`}
          >
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </p>
            <div className="mt-2 flex items-baseline gap-1">
              <h1 className="text-2xl font-bold text-white">{item.value}</h1>
              <span className="text-[10px] text-slate-500 font-medium">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Note: Hourly Graph ab alag 'Chart' component mein handle ho raha hai Pageone par */}
      <div className="mt-6 text-center text-xs text-slate-600 italic">
        Real-time air quality metrics synced with global sensors.
      </div>
    </div>
  );
}

export default Airquality;