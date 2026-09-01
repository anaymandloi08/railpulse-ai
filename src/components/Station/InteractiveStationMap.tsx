import React from 'react';
import { StationSector, StationIncident, MapDisplayMode } from '../../types/stationCommand';
import { 
  Users, 
  AlertTriangle, 
  Train as TrainIcon, 
  ShieldAlert, 
  MapPin, 
  ArrowRight, 
  Zap, 
  UserCheck, 
  Sparkles,
  Layers,
  Clock
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

  const getSectorStatusColor = (status: string, density: number) => {
    if (status === 'CRITICAL' || density > 80) return 'bg-rose-950/70 border-rose-600 text-rose-300 ring-1 ring-rose-500/50 shadow-lg shadow-rose-950/40';
    if (status === 'WARNING' || density > 60) return 'bg-amber-950/60 border-amber-600 text-amber-300 ring-1 ring-amber-500/40';
    return 'bg-slate-900/90 border-slate-700 text-emerald-400 hover:border-slate-500';
  };

  const getDensityBarColor = (density: number) => {
    if (density > 80) return 'bg-rose-500';
    if (density > 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // Group sectors by Platform
  const p1Sectors = sectors.filter(s => s.platformNumber === '1');
  const p2Sectors = sectors.filter(s => s.platformNumber === '2');
  const p3Sectors = sectors.filter(s => s.platformNumber === '3');
  const p4Sectors = sectors.filter(s => s.platformNumber === '4');
  const concourse = sectors.find(s => s.id === 'CONCOURSE-MAIN');
  const fobNorth = sectors.find(s => s.id === 'FOB-NORTH');
  const fobSouth = sectors.find(s => s.id === 'FOB-SOUTH');
  const gate1 = sectors.find(s => s.id === 'GATE-1');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden">
      
      {/* Top Map Mode Switcher Bar */}
      <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Station Layout View:
          </span>
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMapMode('CROWD')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition ${
                mapMode === 'CROWD'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              ● Crowd Density
            </button>
            <button
              onClick={() => setMapMode('INCIDENTS')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition ${
                mapMode === 'INCIDENTS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              ⚠️ Incidents & Safety
            </button>
            <button
              onClick={() => setMapMode('OPERATIONS')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition ${
                mapMode === 'OPERATIONS'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrainIcon className="w-3.5 h-3.5" />
              🚆 Operations & Trains
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px]">Normal (&lt;60%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px]">Warning (60-80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-[11px]">Critical (&gt;80%)</span>
          </div>
        </div>
      </div>

      {/* Main Station Schematic Map Canvas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Foot Overbridge North (FOB-1) Connector */}
        {fobNorth && (
          <div 
            onClick={() => onSelectSector(fobNorth)}
            className={`cursor-pointer rounded-xl p-2.5 border transition-all flex items-center justify-between ${
              selectedSector?.id === fobNorth.id ? 'ring-2 ring-blue-500 bg-slate-850' : getSectorStatusColor(fobNorth.status, fobNorth.crowdDensity)
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                FOB-NORTH (F1)
              </span>
              <span className="text-xs font-bold text-white">{fobNorth.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="font-bold">{fobNorth.crowdDensity}% Density ({fobNorth.passengerCount}/{fobNorth.capacity} pax)</span>
              {fobNorth.status === 'CRITICAL' && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  BOTTLENECK
                </span>
              )}
            </div>
          </div>
        )}

        {/* PLATFORM 1 & 2 TRACK CORRIDOR (Island Platforms) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* PLATFORM 1 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono font-black text-sm text-white">PLATFORM 1</span>
                <span className="text-xs text-slate-400 font-semibold">(Up Main Line)</span>
              </div>
              
              {/* Operations Mode Train Docked */}
              {mapMode === 'OPERATIONS' && (
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                  <TrainIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-bold text-blue-300">22436 Vande Bharat</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">• Dwell: 3m</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {p1Sectors.map(sec => (
                <div
                  key={sec.id}
                  onClick={() => onSelectSector(sec)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedSector?.id === sec.id
                      ? 'ring-2 ring-blue-500 bg-slate-850'
                      : getSectorStatusColor(sec.status, sec.crowdDensity)
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white">{sec.name}</span>
                    <span className="font-mono text-xs font-bold">{sec.crowdDensity}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${getDensityBarColor(sec.crowdDensity)}`} style={{ width: `${sec.crowdDensity}%` }} />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>{sec.passengerCount} Pax</span>
                    <span>Cap: {sec.capacity}</span>
                  </div>

                  {/* Incidents Pin Overlay */}
                  {mapMode === 'INCIDENTS' && sec.activeIncidentsCount > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-500" />
                        {sec.activeIncidentsCount} Incident(s)
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const inc = incidents.find(i => i.sectorId === sec.id) || incidents[0];
                          onOpenIncidentModal(inc);
                        }}
                        className="text-[10px] bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/40 font-bold"
                      >
                        Verify OTP 🔐
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PLATFORM 2 (CRITICAL BOTTLENECK ZONE) */}
          <div className="bg-slate-900/60 border border-rose-900/50 rounded-2xl p-3.5 space-y-2.5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-mono font-black text-sm text-white">PLATFORM 2</span>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.2 rounded-full">
                  SURGE ALERT
                </span>
              </div>

              {mapMode === 'OPERATIONS' && (
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                  <TrainIcon className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-bold text-rose-300">12951 Rajdhani (+29m)</span>
                  <span className="text-[10px] text-rose-400 font-semibold">• Dwell: 6m</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {p2Sectors.map(sec => (
                <div
                  key={sec.id}
                  onClick={() => onSelectSector(sec)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    selectedSector?.id === sec.id
                      ? 'ring-2 ring-blue-500 bg-slate-850'
                      : getSectorStatusColor(sec.status, sec.crowdDensity)
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white">{sec.name}</span>
                    <span className={`font-mono text-xs font-black ${sec.status === 'CRITICAL' ? 'text-rose-400 animate-pulse' : ''}`}>
                      {sec.crowdDensity}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${getDensityBarColor(sec.crowdDensity)}`} style={{ width: `${sec.crowdDensity}%` }} />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>{sec.passengerCount} Pax</span>
                    <span>Cap: {sec.capacity}</span>
                  </div>

                  {sec.status === 'CRITICAL' && (
                    <div className="mt-2 pt-1.5 border-t border-rose-900/60 flex items-center justify-between">
                      <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        AI Reroute Ready
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerCrowdDivert('P2-B', 'P3-A');
                        }}
                        className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2 py-0.5 rounded shadow-sm transition"
                      >
                        Divert to P3 &rarr;
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* MAIN CONCOURSE & PASSENGER WAITING HUB */}
        {concourse && (
          <div
            onClick={() => onSelectSector(concourse)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              selectedSector?.id === concourse.id ? 'ring-2 ring-blue-500 bg-slate-850' : getSectorStatusColor(concourse.status, concourse.crowdDensity)
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  CENTRAL HUB
                </span>
                <span className="font-bold text-sm text-white">{concourse.name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span>Density: <b className="text-amber-400">{concourse.crowdDensity}%</b> ({concourse.passengerCount}/{concourse.capacity} pax)</span>
                <span className="text-slate-400">UTS Queues: Moderate</span>
              </div>
            </div>
          </div>
        )}

        {/* PLATFORM 3 & 4 TRACK CORRIDOR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* PLATFORM 3 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono font-black text-sm text-white">PLATFORM 3</span>
                <span className="text-xs text-slate-400 font-semibold">(Down Main Line)</span>
              </div>

              {mapMode === 'OPERATIONS' && (
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
                  <TrainIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-bold text-blue-300">12002 Shatabdi</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">• Dwell: 12m</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {p3Sectors.map(sec => (
                <div
                  key={sec.id}
                  onClick={() => onSelectSector(sec)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedSector?.id === sec.id
                      ? 'ring-2 ring-blue-500 bg-slate-850'
                      : getSectorStatusColor(sec.status, sec.crowdDensity)
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white">{sec.name}</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">{sec.crowdDensity}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${getDensityBarColor(sec.crowdDensity)}`} style={{ width: `${sec.crowdDensity}%` }} />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>{sec.passengerCount} Pax</span>
                    <span>Cap: {sec.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PLATFORM 4 */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="font-mono font-black text-sm text-white">PLATFORM 4</span>
                <span className="text-xs text-slate-400 font-semibold">(Loop / Branch Line)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {p4Sectors.map(sec => (
                <div
                  key={sec.id}
                  onClick={() => onSelectSector(sec)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedSector?.id === sec.id
                      ? 'ring-2 ring-blue-500 bg-slate-850'
                      : getSectorStatusColor(sec.status, sec.crowdDensity)
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white">{sec.name}</span>
                    <span className="font-mono text-xs font-bold">{sec.crowdDensity}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${getDensityBarColor(sec.crowdDensity)}`} style={{ width: `${sec.crowdDensity}%` }} />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                    <span>{sec.passengerCount} Pax</span>
                    <span>Cap: {sec.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Foot Overbridge South (FOB-2) & Gate 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fobSouth && (
            <div
              onClick={() => onSelectSector(fobSouth)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedSector?.id === fobSouth.id ? 'ring-2 ring-blue-500 bg-slate-850' : getSectorStatusColor(fobSouth.status, fobSouth.crowdDensity)
              }`}
            >
              <span className="text-xs font-bold text-white">{fobSouth.name}</span>
              <span className="text-xs font-mono text-emerald-400 font-bold">{fobSouth.crowdDensity}% (Clear)</span>
            </div>
          )}

          {gate1 && (
            <div
              onClick={() => onSelectSector(gate1)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedSector?.id === gate1.id ? 'ring-2 ring-blue-500 bg-slate-850' : getSectorStatusColor(gate1.status, gate1.crowdDensity)
              }`}
            >
              <span className="text-xs font-bold text-white">{gate1.name}</span>
              <span className="text-xs font-mono text-slate-300 font-bold">{gate1.crowdDensity}% (Smooth Entry)</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
