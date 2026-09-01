import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Map as MapIcon, 
  Cpu, 
  Bell, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Train as TrainIcon,
  Layers,
  Zap
} from 'lucide-react';

interface NavbarProps {
  primaryView: 'STATION_COMMAND' | 'NATIONAL_FLEET';
  setPrimaryView: (view: 'STATION_COMMAND' | 'NATIONAL_FLEET') => void;
  activeTab: 'map' | 'analytics' | 'sandbox' | 'heatmap' | 'alerts';
  setActiveTab: (tab: 'map' | 'analytics' | 'sandbox' | 'heatmap' | 'alerts') => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  unresolvedAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  primaryView,
  setPrimaryView,
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
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Brand & Dual View Mode Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <TrainIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black tracking-wider text-base md:text-lg bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent">
                  RAILPULSE AI
                </h1>
                <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-black px-2 py-0.2 rounded-full">
                  SIH
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Indian Railways Operations & Crowd Command Grid
              </p>
            </div>
          </div>

          {/* Primary View Switcher: Station Cockpit vs National Fleet */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setPrimaryView('STATION_COMMAND')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                primaryView === 'STATION_COMMAND'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Station Command Center</span>
            </button>

            <button
              onClick={() => setPrimaryView('NATIONAL_FLEET')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                primaryView === 'NATIONAL_FLEET'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>National Fleet Corridor</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs when in National Fleet view */}
        {primaryView === 'NATIONAL_FLEET' && (
          <nav className="hidden xl:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeTab === 'map' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3 h-3" /> Live Tracking
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3 h-3" /> AI Predictor
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeTab === 'sandbox' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-400" /> "What-If"
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeTab === 'heatmap' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" /> Heatmap
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                activeTab === 'alerts' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-3 h-3" /> Alerts ({unresolvedAlertsCount})
            </button>
          </nav>
        )}

        {/* Controls & IST Clock */}
        <div className="flex items-center gap-2.5">
          {/* Sim speed */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSimSpeed(simSpeed === 0 ? 1 : 0)}
              className="p-1 text-slate-400 hover:text-white"
            >
              {simSpeed === 0 ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            {[1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  simSpeed === s ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Sound */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs ${
              soundEnabled ? 'bg-blue-900/40 border-blue-500/40 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* IST Clock */}
          <div className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{time || '--:--:--'}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
