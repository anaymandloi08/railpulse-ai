import React from 'react';
import { StationSector, StationIncident } from '../../types/stationCommand';
import { 
  X, 
  Users, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  Send, 
  Video 
} from 'lucide-react';

interface StationSectorDrawerProps {
  sector: StationSector | null;
  onClose: () => void;
  onOpenIncidentModal: (incident: StationIncident) => void;
  incidents: StationIncident[];
  onTriggerCrowdDivert: (fromSectorId: string, toSectorId: string) => void;
}

export const StationSectorDrawer: React.FC<StationSectorDrawerProps> = ({
  sector,
  onClose,
  onOpenIncidentModal,
  incidents,
  onTriggerCrowdDivert
}) => {
  if (!sector) return null;

  const sectorIncidents = incidents.filter(i => i.sectorId === sector.id && i.status !== 'RESOLVED');

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">{sector.name}</span>
            <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border uppercase ${
              sector.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
              sector.status === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
              'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {sector.status}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Zone: {sector.zoneType}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
        
        {/* Crowd Density Gauge */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Live Passenger Count:
            </span>
            <span className="font-mono font-bold text-base text-white">
              {sector.passengerCount} <span className="text-xs text-slate-400 font-normal">/ {sector.capacity}</span>
            </span>
          </div>
          
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                sector.crowdDensity > 80 ? 'bg-rose-500' : sector.crowdDensity > 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${sector.crowdDensity}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Density: <b className="text-white">{sector.crowdDensity}%</b></span>
            <span>Capacity Headroom: {Math.max(0, sector.capacity - sector.passengerCount)} pax</span>
          </div>
        </div>

        {/* AI Action Advisory */}
        <div className="bg-indigo-950/40 border border-indigo-500/40 p-3.5 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Sector Recommendation</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {sector.aiRecommendation}
          </p>

          {sector.status === 'CRITICAL' && (
            <button
              onClick={() => {
                onTriggerCrowdDivert(sector.id, 'P3-A');
                onClose();
              }}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              Execute Crowd Divert to Platform 3
            </button>
          )}
        </div>

        {/* Active Sector Incidents */}
        {sectorIncidents.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase">
              Active Sector Incidents ({sectorIncidents.length})
            </div>
            {sectorIncidents.map(inc => (
              <div key={inc.id} className="p-3 bg-slate-950 border border-rose-900/50 rounded-xl space-y-2">
                <div className="font-bold text-slate-200">{inc.title}</div>
                <div className="text-[10px] text-slate-400">Assigned: {inc.assignedOfficer.name}</div>
                <button
                  onClick={() => {
                    onOpenIncidentModal(inc);
                    onClose();
                  }}
                  className="w-full bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold py-1 px-2 rounded text-xs transition"
                >
                  Open OTP Verification 🔐
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
