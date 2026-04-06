import React, { useState } from 'react';
import HistoricalTemp from './pagetwo/HistoricalTemp';
import HistoricalSunCycle from './pagetwo/HistoricalSunCycle';
import HistoricalPrecip from './pagetwo/HistoricalPrecip';
import HistoricalWind from './pagetwo/HistoricalWind';
import HistoricalAQI from './pagetwo/HistoricalAQI';
 // Mount the component

const Pagetwo = () => {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-01-31");

  return (
    <div className="space-y-10 p-6">
      {/* 1. Date Range Selectors (Common for all child components) */}
      <div className="flex bg-slate-800 p-4 rounded-2xl border border-slate-700 w-fit mx-auto gap-4">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-slate-900 p-2 rounded text-white outline-none" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-slate-900 p-2 rounded text-white outline-none" />
      </div>

      {/* 2. Mount Temperature Component */}
      <HistoricalTemp startDate={startDate} endDate={endDate} />

      <HistoricalSunCycle startDate={startDate} endDate={endDate} />

      {/* 3. Agla component (Precipitation) yahan aayega */}
      <HistoricalPrecip startDate={startDate} endDate={endDate} />
      {/* <HistoricalPrecip startDate={startDate} endDate={endDate} /> */}
     <HistoricalWind startDate={startDate} endDate={endDate} />

     <HistoricalAQI startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default Pagetwo;