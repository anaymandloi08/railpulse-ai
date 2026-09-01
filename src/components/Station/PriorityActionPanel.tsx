import React from 'react';
import { StationSector, StationIncident } from '../../types/stationCommand';
import { 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  ShieldAlert, 
  Users, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PriorityActionPanelProps {
  sectors: StationSector[];
  incidents: StationIncident[];
  onOpenIncidentModal: (incident: StationIncident) => void;
  onSelectSector: (sector: StationSector) => void;
  onTriggerCrowdDivert: (fromSectorId: string, toSectorId: string) => void;
}

export const PriorityActionPanel: React.FC<PriorityActionPanelProps> = ({
  sectors,
  incidents,
  onOpenIncidentModal,
  onSelectSector,
  onTriggerCrowdDivert
}) => {
  const criticalSectors = sectors.filter(s => s.status === 'CRITICAL' || s.crowdDensity > 80);
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  const handleExecuteAiRecommendation = () => {
    onTriggerCrowdDivert('P2-B', 'P3-A');
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="w-full lg:w-[380px] bg-slate-950/90 border-l border-slate-800/80 p-3.5 flex flex-col h-full overflow-y-auto space-y-4">
      
      {/* 1. PRIORITY ALERTS QUEUE */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Priority Alerts ({activeIncidents.length + criticalSectors.length})
            </h3>
          </div>
          <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.2 rounded">
            Immediate Action
          </span>
        </div>

        <div className="space-y-2">
          {/* Critical Crowd Alert */}
          {criticalSectors.map(sec => (
            <div
              key={sec.id}
              onClick={() => onSelectSector(sec)}
              className="p-3 bg-rose-950/30 border border-rose-800/60 rounded-xl space-y-2 cursor-pointer hover:border-rose-600 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-black px-1.5 py-0.2 rounded uppercase">
                    CROWD OVERRUN
                  </span>
                  <div className="font-bold text-xs text-white mt-1">{sec.name}</div>
                  <div className="text-[11px] text-rose-300 font-mono mt-0.5">
                    Density: <b>{sec.crowdDensity}%</b> ({sec.passengerCount} Passengers)
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-rose-900/40 text-xs">
                <span className="text-[10px] text-slate-400">Bottleneck Escalation</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerCrowdDivert(sec.id, 'P3-A');
                  }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Divert Crowd &rarr;
                </button>
              </div>
            </div>
          ))}

          {/* Active Incidents */}
          {activeIncidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => onOpenIncidentModal(inc)}
              className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 cursor-pointer hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{inc.ticketCode}</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase">
                      {inc.category}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-200 mt-1">{inc.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">📍 {inc.location} • {inc.reportedTime}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-xs">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  👮 {inc.assignedOfficer.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenIncidentModal(inc);
                  }}
                  className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition"
                >
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  Verify OTP 🔐
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ACTIVE AI RECOMMENDATION BOX (Crisp & Actionable) */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/40 p-3.5 rounded-2xl space-y-2.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Station Dispatcher Advisory</span>
          </div>
          <span className="text-cyan-400 font-mono text-[10px] font-bold">92% Confidence</span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          Critical crowd accumulation on <b>Platform 2 (87%)</b>. Open auxiliary Gate 3 and divert incoming passenger flow via North FOB to <b>Platform 3</b>.
        </p>

        <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Projected Relief:</span>
            <span className="text-emerald-400 font-bold">-35% Density in 4 min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">RPF Required:</span>
            <span className="text-white font-bold">2 Marshals at FOB-1</span>
          </div>
        </div>

        <button
          onClick={handleExecuteAiRecommendation}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 transition"
        >
          <Send className="w-3.5 h-3.5" />
          Acknowledge & Execute AI Crowd Divert
        </button>
      </div>

    </div>
  );
};
