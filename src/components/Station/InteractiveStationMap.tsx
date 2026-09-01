import React from 'react';
import { StationSector, StationIncident, MapDisplayMode } from '../../types/stationCommand';
import { 
  Users, 
  AlertTriangle, 
  Train as TrainIcon, 
  Sparkles, 
  ArrowRight, 
  Send,
  UserCheck,
  ShieldAlert,
  Clock,
  Radio
} from 'lucide-react';

interface InteractiveStationMapProps {
  sectors: StationSector[];
  incidents: StationIncident[];
  selectedSector: StationSector | null;
  onSelectSector: (sector: StationSector) => void;
  mapMode: MapDisplayMode;
  setMapMode: (mode: MapDisplayMode) => void;
  onOpenIncidentModal: (incident: StationIncident) => void;
  onTriggerCrowdDivert: (fromSectorId: string, toSectorId: string) => void;
}

export const InteractiveStationMap: React.FC<InteractiveStationMapProps> = ({
  sectors,
  incidents,
  selectedSector,
  onSelectSector,
  mapMode,
  setMapMode,
  onOpenIncidentModal,
  onTriggerCrowdDivert
}) => {

  const getSectorStyle = (status: string, density: number, isSelected: boolean) => {
    let base = "p-3 rounded-2xl border transition-all cursor-pointer relative shadow-md flex flex-col justify-between ";
    if (isSelected) {
      base += "ring-2 ring-blue-400 bg-slate-850 ";
    }
    if (status === 'CRITICAL' || density > 80) {
      return base + "bg-rose-950/40 border-rose-600/80 hover:border-rose-500";
    }
    if (status === 'WARNING' || density > 60) {
      return base + "bg-amber-950/30 border-amber-600/70 hover:border-amber-500";
    }
    return base + "bg-slate-900/80 border-slate-700/80 hover:border-slate-500";
  };

  const getStatusBadge = (status: string, density: number) => {
    if (status === 'CRITICAL' || density > 80) {
      return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black px-2 py-0.2 rounded-full uppercase animate-pulse">🔴 Critical</span>;
    }
    if (status === 'WARNING' || density > 60) {
      return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">🟠 Warning</span>;
    }
    return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full uppercase">🟢 Normal</span>;
  };

  const fobNorth = sectors.find(s => s.id === 'FOB-NORTH') || sectors[0];
  const p1 = sectors.find(s => s.id === 'P1-A') || sectors[1];
  const p2 = sectors.find(s => s.id === 'P2-A') || sectors[2];
  const concourse = sectors.find(s => s.id === 'CONCOURSE-MAIN') || sectors[3];
  const p3 = sectors.find(s => s.id === 'P3-A') || sectors[4];
  const p4 = sectors.find(s => s.id === 'P4-A') || sectors[5];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
      
      {/* Top Map Mode Switcher & Prominent Legend */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Station Mode:
          </span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setMapMode('CROWD')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                mapMode === 'CROWD'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              ● Crowd
            </button>
            <button
              onClick={() => setMapMode('INCIDENTS')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                mapMode === 'INCIDENTS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              ⚠ Incidents
            </button>
            <button
              onClick={() => setMapMode('OPERATIONS')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                mapMode === 'OPERATIONS'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrainIcon className="w-3.5 h-3.5" />
              🚆 Operations
            </button>
          </div>
        </div>

        {/* Clear, properly spaced Legend */}
        <div className="bg-slate-950 border border-slate-800 px-3.5 py-1 rounded-xl flex items-center gap-3.5 text-xs text-slate-300 font-mono shadow-sm">
          <span className="text-slate-400 font-bold uppercase text-[11px]">LIVE MAP:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Normal</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Warning</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Critical</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <span>🚆</span> Train
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <span>⚠</span> Incident
          </span>
        </div>
      </div>

      {/* Main Visual Station Physical Schematic */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-3">
        
        {/* TOP LEVEL: NORTH FOOT OVERBRIDGE */}
        <div 
          onClick={() => onSelectSector(fobNorth)}
          className={getSectorStyle(fobNorth.status, fobNorth.crowdDensity, selectedSector?.id === fobNorth.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-blue-400">
                FOB-1
              </span>
              <span className="text-xs font-bold text-white">{fobNorth.name}</span>
            </div>
            {getStatusBadge(fobNorth.status, fobNorth.crowdDensity)}
          </div>

          <div className="flex items-center justify-between text-xs font-mono mt-2">
            {mapMode === 'CROWD' && (
              <>
                <span className="text-slate-300 font-bold">{fobNorth.crowdDensity}% Occupancy ({fobNorth.passengerCount}/{fobNorth.capacity} pax)</span>
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  Stairway Bottleneck
                </span>
              </>
            )}
            {mapMode === 'INCIDENTS' && (
              <span className="text-slate-400 text-[11px]">Footbridge clear of physical obstructions. High footfall active.</span>
            )}
            {mapMode === 'OPERATIONS' && (
              <span className="text-cyan-400 font-bold">Connects Platform 1 ↔ Platform 2 ↔ Platform 3</span>
            )}
          </div>
        </div>

        {/* MIDDLE LEVEL 1: PLATFORM 1 <---> FLOW <---> PLATFORM 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
          
          {/* PLATFORM 1 (LEFT) */}
          <div 
            onClick={() => onSelectSector(p1)}
            className={`md:col-span-5 ${getSectorStyle(p1.status, p1.crowdDensity, selectedSector?.id === p1.id)}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-white">PLATFORM 1</span>
                  <span className="text-[11px] text-slate-400">(Up Main)</span>
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {p1.passengerCount} Pax ({p1.crowdDensity}% Load)
                </div>
              </div>
              {getStatusBadge(p1.status, p1.crowdDensity)}
            </div>

            {/* Mode-specific content */}
            <div className="mt-2 pt-2 border-t border-slate-800/80">
              {mapMode === 'CROWD' && (
                <div className="space-y-1 text-[11px]">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${p1.crowdDensity}%` }} />
                  </div>
                  <div className="text-emerald-400 font-bold text-[10px]">Spare Capacity: +403 Passengers</div>
                </div>
              )}

              {mapMode === 'INCIDENTS' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    ⚠ Safety: Baggage Hazard
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const inc = incidents.find(i => i.sectorId === 'P1-A') || incidents[1];
                      onOpenIncidentModal(inc);
                    }}
                    className="text-[11px] bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40 font-bold"
                  >
                    Verify OTP 🔐
                  </button>
                </div>
              )}

              {mapMode === 'OPERATIONS' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-300 font-bold flex items-center gap-1">
                    🚆 22436 Vande Bharat
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">Dwell: 3m</span>
                </div>
              )}
            </div>
          </div>

          {/* CONNECTOR / PASSENGER FLOW INDICATOR */}
          <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center bg-slate-900/40 border border-slate-800/60 rounded-2xl p-2 text-center text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Passage</span>
            <div className="flex items-center gap-1 text-cyan-400 my-1 font-mono font-bold animate-pulse">
              <span>&larr;</span>
              <span>Divert</span>
              <span>&rarr;</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">FOB-1 Track Flow</span>
          </div>

          {/* PLATFORM 2 (RIGHT - CRITICAL STAR) */}
          <div 
            onClick={() => onSelectSector(p2)}
            className={`md:col-span-5 ${getSectorStyle(p2.status, p2.crowdDensity, selectedSector?.id === p2.id)}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-mono font-black text-sm text-white">PLATFORM 2</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-black px-1.5 py-0.2 rounded">
                    SURGE
                  </span>
                </div>
                <div className="text-xs font-black text-rose-300 mt-1">
                  {p2.passengerCount} Pax ({p2.crowdDensity}% Capacity)
                </div>
              </div>
              {getStatusBadge(p2.status, p2.crowdDensity)}
            </div>

            {/* Mode-specific content */}
            <div className="mt-2 pt-2 border-t border-rose-900/60">
              {mapMode === 'CROWD' && (
                <div className="space-y-1.5 text-[11px]">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${p2.crowdDensity}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-bold text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Critical in 8m
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerCrowdDivert('P2-A', 'P3-A');
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[10px] px-2.5 py-1 rounded-md shadow-md transition flex items-center gap-1"
                    >
                      Divert to P3 &rarr;
                    </button>
                  </div>
                </div>
              )}

              {mapMode === 'INCIDENTS' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    🔴 Crowd Surge Alert
                  </span>
                  <span className="text-[10px] text-slate-400">Marshal Dispatched</span>
                </div>
              )}

              {mapMode === 'OPERATIONS' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-300 font-bold flex items-center gap-1">
                    🚆 12951 Rajdhani (+29m)
                  </span>
                  <span className="text-rose-400 font-mono text-[11px]">Dwell: 6m</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* CENTRAL CONCOURSE & BOOKING HUB */}
        <div 
          onClick={() => onSelectSector(concourse)}
          className={getSectorStyle(concourse.status, concourse.crowdDensity, selectedSector?.id === concourse.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-amber-400">
                HUB
              </span>
              <span className="text-xs font-bold text-white">{concourse.name}</span>
            </div>
            {getStatusBadge(concourse.status, concourse.crowdDensity)}
          </div>

          <div className="flex items-center justify-between text-xs font-mono mt-2">
            <span className="text-slate-300 font-bold">{concourse.crowdDensity}% Load ({concourse.passengerCount}/{concourse.capacity} pax)</span>
            <span className="text-slate-400 text-[11px]">UTS Booking Queues: Moderate</span>
          </div>
        </div>

        {/* BOTTOM LEVEL: PLATFORM 3 & PLATFORM 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* PLATFORM 3 */}
          <div 
            onClick={() => onSelectSector(p3)}
            className={getSectorStyle(p3.status, p3.crowdDensity, selectedSector?.id === p3.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-white">PLATFORM 3</span>
                  <span className="text-[11px] text-slate-400">(Down Main)</span>
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {p3.passengerCount} Pax ({p3.crowdDensity}% Load)
                </div>
              </div>
              {getStatusBadge(p3.status, p3.crowdDensity)}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-emerald-400 text-[11px] font-bold">Ample Spare Capacity for P2 Divert</span>
              {mapMode === 'OPERATIONS' && (
                <span className="text-blue-300 font-bold font-mono text-[11px]">🚆 12002 Shatabdi (12m)</span>
              )}
            </div>
          </div>

          {/* PLATFORM 4 */}
          <div 
            onClick={() => onSelectSector(p4)}
            className={getSectorStyle(p4.status, p4.crowdDensity, selectedSector?.id === p4.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-white">PLATFORM 4</span>
                  <span className="text-[11px] text-slate-400">(Loop Line)</span>
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {p4.passengerCount} Pax ({p4.crowdDensity}% Load)
                </div>
              </div>
              {getStatusBadge(p4.status, p4.crowdDensity)}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-amber-400 text-[11px] font-medium">Density rising ahead of Malwa Express</span>
              {mapMode === 'OPERATIONS' && (
                <span className="text-slate-400 text-[11px]">Track Clear</span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
