import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Map as MapIcon, 
  Cpu, 
  Sliders, 
  Bell, 
  Play, 
  Pause, 
  FastForward, 
  Volume2, 
  VolumeX, 
  Train as TrainIcon,
  Layers,
  Zap
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'analytics' | 'sandbox' | 'heatmap' | 'alerts';
  setActiveTab: (tab: 'map' | 'analytics' | 'sandbox' | 'heatmap' | 'alerts') => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  unresolvedAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  simSpeed,
  setSimSpeed,
  soundEnabled,
  setSoundEnabled,
  unresolvedAlertsCount
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-50 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-lg shadow-lg shadow-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <TrainIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold tracking-wider text-base md:text-lg bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent">
                RAILPULSE AI
              </h1>
              <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                SIH EDITION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              National Railway AI Control & Real-Time Delay Prediction
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Live Tracking
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            AI Delay Predictor
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            "What-If" Sandbox
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'heatmap'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Corridor Heatmap
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'alerts'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts Log
            {unresolvedAlertsCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {unresolvedAlertsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Section: Simulation Controls, Audio, IST Clock */}
        <div className="flex items-center gap-3">
          
          {/* Simulation Speed Switcher */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold px-1.5 mr-0.5 hidden sm:inline">
              Sim:
            </span>
            <button
              onClick={() => setSimSpeed(simSpeed === 0 ? 1 : 0)}
              title={simSpeed === 0 ? "Resume Simulation" : "Pause Simulation"}
              className={`p-1 rounded text-xs transition ${
                simSpeed === 0 ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {simSpeed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            {[1, 2, 5, 10].map(s => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition ${
                  simSpeed === s
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute Audio Alerts" : "Enable Audio Alerts"}
            className={`p-2 rounded-lg border transition ${
              soundEnabled
                ? 'bg-blue-900/30 border-blue-500/30 text-blue-400 hover:bg-blue-900/50'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* IST Live Clock */}
          <div className="bg-slate-950/90 border border-slate-800 px-3 py-1 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <div className="text-right font-mono">
              <div className="text-xs font-bold text-slate-200">{time || '--:--:--'}</div>
              <div className="text-[9px] text-slate-500 font-semibold tracking-wider">IST (UTC+5:30)</div>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-800 bg-slate-950/90 px-2 py-1.5 text-xs">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
            activeTab === 'map' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Map</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
            activeTab === 'analytics' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Predict</span>
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
            activeTab === 'sandbox' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>What-If</span>
        </button>
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium ${
            activeTab === 'heatmap' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Heatmap</span>
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center py-1 px-2 rounded font-medium relative ${
            activeTab === 'alerts' ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
          {unresolvedAlertsCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>
      </div>
    </header>
  );
};
