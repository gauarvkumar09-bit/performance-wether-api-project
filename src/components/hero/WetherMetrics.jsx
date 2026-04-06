import React from 'react';

const WeatherMetrics = ({ weather }) => {
  // 1. Safety Check: Agar data loading mein hai toh crash na ho
  if (!weather || !weather.current || !weather.daily) {
    return <div className="p-10 text-slate-500 text-center">Loading Weather Stats...</div>;
  }

  // 2. Map chalane ke liye Data ko Array mein convert karna padega
  // Kyunki API se humein Object milta hai
  const stats = [
    { label: "Current Temp", value: weather.current.temperature_2m, unit: "°C" },
    { label: "Min Temp", value: weather.daily.temperature_2m_min[0], unit: "°C" },
    { label: "Max Temp", value: weather.daily.temperature_2m_max[0], unit: "°C" },
    { label: "Humidity", value: weather.current.relative_humidity_2m, unit: "%" },
    { label: "Precipitation", value: weather.current.precipitation, unit: "mm" },
  ];

  return (
    <div className="p-6 bg-slate-900 text-white shadow-2xl mt-4 rounded-3xl border border-slate-800">
      <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2">
        Weather Overview
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((item, index) => (
          <div 
            key={index} 
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition-all shadow-lg"
          >
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              {item.label}
            </p>
            <p className="text-xl mt-1 font-semibold text-blue-400">
              {item.value} 
              <span className="ml-1 text-xs text-slate-500 font-normal">
                {item.unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherMetrics;