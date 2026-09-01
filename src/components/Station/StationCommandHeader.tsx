import React from 'react';
import { StationHealthData } from '../../types/stationCommand';
import { 
  Building2, 
  AlertTriangle, 
  Users, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  MapPin, 
  Clock 
} from 'lucide-react';

interface StationCommandHeaderProps {
  selectedStation: string;
  setSelectedStation: (station: string) => void;
  health: StationHealthData;
  criticalAlertsCount: number;
  activeIncidentsCount: number;
  aiActionsCount: number;
}

export const StationCommandHeader: React.FC<StationCommandHeaderProps> = ({
  selectedStation,
  setSelectedStation,
  health,
  criticalAlertsCount,
  activeIncidentsCount,
  aiActionsCount
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 p-3 space-y-2.5">
      
      {/* Top Station Selector & Subtitle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Station Terminal Command Center
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.2 rounded-full">
                LIVE TELEMETRY
              </span>
            </div>
            
            {/* Station Dropdown */}
            <div className="flex items-center gap-2 mt-0.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="bg-slate-850 text-white font-extrabold text-base border border-slate-700 rounded-lg px-2.5 py-0.5 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Indore Junction (INDB)">Indore Junction (INDB) — Western Railway</option>
                <option value="New Delhi (NDLS)">New Delhi (NDLS) — Northern Railway</option>
                <option value="Mumbai Central (MMCT)">Mumbai Central (MMCT) — Western Railway</option>
                <option value="Kota Junction (KOTA)">Kota Junction (KOTA) — West Central Railway</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operational Status Badge */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-300 font-semibold">CCTV AI & IoT Grid:</span>
            <span className="text-emerald-400 font-bold">100% Operational</span>
          </div>
        </div>
      </div>

      {/* 5 Focused High-Impact KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
        
        {/* KPI 1: Station Health Score (78/100) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold uppercase">Station Health</span>
            <span className="text-emerald-400 font-mono font-bold">{health.overallScore} / 100</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                health.overallScore > 75 ? 'bg-emerald-500' : health.overallScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${health.overallScore}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-400 flex justify-between font-mono">
            <span>Safety: {health.safetyIndex}%</span>
            <span>Ops: {health.operationsEfficiency}%</span>
          </div>
        </div>

        {/* KPI 2: Critical Alerts */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Critical Alerts</div>
            <div className="text-lg font-black text-rose-400">
              {String(criticalAlertsCount).padStart(2, '0')} <span className="text-[10px] font-normal text-rose-300">Active</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Crowd Density */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Avg Crowd Density</div>
            <div className="text-lg font-black text-amber-400">
              {health.crowdHealth}% <span className="text-[10px] font-normal text-amber-300">Capacity</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Active Incidents */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Active Incidents</div>
            <div className="text-lg font-black text-red-400">
              {String(activeIncidentsCount).padStart(2, '0')} <span className="text-[10px] font-normal text-slate-400">Pending</span>
            </div>
          </div>
        </div>

        {/* KPI 5: AI Actions Executed */}
        <div className="col-span-2 md:col-span-1 bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">AI Dispatches</div>
            <div className="text-lg font-black text-cyan-400">
              {aiActionsCount} <span className="text-[10px] font-normal text-cyan-300">Resolved</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
