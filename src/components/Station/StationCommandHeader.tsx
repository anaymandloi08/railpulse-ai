import React from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Train as TrainIcon, 
  AlertTriangle, 
  Users, 
  TrendingUp 
} from 'lucide-react';

interface StationCommandHeaderProps {
  selectedStation: string;
  setSelectedStation: (station: string) => void;
  criticalAlertsCount: number;
  avgDelayMinutes: number;
  crowdLevelPct: number;
  activeTrainsCount: number;
}

export const StationCommandHeader: React.FC<StationCommandHeaderProps> = ({
  selectedStation,
  setSelectedStation,
  criticalAlertsCount,
  avgDelayMinutes,
  crowdLevelPct,
  activeTrainsCount
}) => {
  return (
    <div className="bg-slate-900/95 border-b border-slate-800 p-3 space-y-2.5">
      
      {/* Top Station Selector & Subtitle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Station:</span>
            <div className="relative">
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="bg-slate-950 text-white font-bold text-xs sm:text-sm border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer pr-6 appearance-none"
              >
                <option value="Indore Junction (INDB)">Indore Junction (INDB)</option>
                <option value="Bhopal Junction (BPL)">Bhopal Junction (BPL)</option>
                <option value="Ujjain Junction (UJN)">Ujjain Junction (UJN)</option>
                <option value="Ratlam Junction (RTM)">Ratlam Junction (RTM)</option>
                <option value="New Delhi (NDLS)">New Delhi (NDLS)</option>
              </select>
              <span className="absolute right-2 top-2 text-[10px] text-slate-400 pointer-events-none">▾</span>
            </div>
            <span className="text-slate-500 text-xs hidden md:inline">|</span>
            <span className="text-xs text-slate-400 hidden md:inline">Live Railway Operations Grid</span>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            LIVE TELEMETRY
          </span>
        </div>
      </div>

      {/* 4 Focused Cards Above/Around Map */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        
        {/* 1. Live Trains */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <TrainIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Live Trains</div>
            <div className="text-lg font-black text-white">
              {activeTrainsCount} <span className="text-[10px] text-slate-400 font-normal">Active</span>
            </div>
          </div>
        </div>

        {/* 2. Active Alerts */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Active Alerts</div>
            <div className="text-lg font-black text-rose-400">
              {String(criticalAlertsCount).padStart(2, '0')} <span className="text-[10px] text-rose-300 font-normal">Critical</span>
            </div>
          </div>
        </div>

        {/* 3. Average Delay */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Avg. Delay</div>
            <div className="text-lg font-black text-amber-400">
              +{avgDelayMinutes} <span className="text-xs font-normal">min</span>
            </div>
          </div>
        </div>

        {/* 4. Crowd Level */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Crowd Level</div>
            <div className="text-lg font-black text-amber-400">
              {crowdLevelPct}% <span className="text-[10px] text-slate-400 font-normal">Capacity</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
