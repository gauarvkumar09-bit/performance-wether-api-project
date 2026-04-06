import React, { useState, useEffect } from 'react';
import WeatherMetrics from './hero/WetherMetrics';
import Airquality from './Airquality/Airquality';
import Chart from './hero/Chart';

const Pageone = () => {
  const today = new Date().toISOString().split('T')[0];
  
  // States
  const [selectedDate, setSelectedDate] = useState(today);
  const [coords, setCoords] = useState({ lat: 28.6519, lon: 77.2315 }); // Default: Delhi
  const [locationName, setLocationName] = useState("Delhi, IN");
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null); 
  const [loading, setLoading] = useState(true);

  // 📍 GPS Function
  const handleGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLocationName("Current Location");
      }, (error) => {
        alert("Location access denied. Using default (Delhi).");
      });
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    const t0 = performance.now();

    // URLs with Dynamic Coords and Date
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=temperature_2m,relative_humidity_2m,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${selectedDate}&end_date=${selectedDate}&current=pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide&hourly=pm10,pm2_5&timezone=auto`;
    const hourlyUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&start_date=${selectedDate}&end_date=${selectedDate}&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m&timezone=auto`;

    try {
      const [res1, res2, res3] = await Promise.all([
        fetch(weatherUrl),
        fetch(airUrl),
        fetch(hourlyUrl)
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();
      const data3 = await res3.json();

      setWeatherData(data1);
      setAirQualityData(data2);
      setHourlyData(data3.hourly);

      const t1 = performance.now();
      console.log(`🚀 All APIs loaded in: ${(t1 - t0).toFixed(2)} ms`);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when Date or GPS changes
  useEffect(() => {
    fetchAllData();
  }, [selectedDate, coords]);

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto min-h-screen bg-slate-950 text-white">
      
      {/* HEADER: Location + GPS + Calendar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/80 p-5 rounded-3xl border border-slate-800 shadow-2xl gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
            <h2 className="text-xl font-black uppercase italic">{locationName}</h2>
          </div>
          
          <button 
            onClick={handleGPS}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2"
          >
            📍 Locate Me
          </button>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/50 p-2 px-4 rounded-2xl border border-slate-700">
          <label className="text-slate-400 text-[10px] font-bold uppercase">Date:</label>
          <input 
            type="date" 
            value={selectedDate}
            max={today} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white font-semibold outline-none cursor-pointer [color-scheme:dark]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium animate-pulse">Syncing with Satellites...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
          {/* Weather Cards */}
          <WeatherMetrics weather={weatherData} />
          
          {/* Air Quality Dashboard */}
          <Airquality data={airQualityData} />
          
          {/* Charts Section */}
          <Chart hourlyData={hourlyData} airQualityData={airQualityData} />
        </div>
      )}

      <footer className="text-center text-slate-600 text-[10px] py-4 uppercase tracking-[0.2em]">
        Open-Meteo API Engine | BCA Project 2026
      </footer>
    </div>
  );
};

export default Pageone;