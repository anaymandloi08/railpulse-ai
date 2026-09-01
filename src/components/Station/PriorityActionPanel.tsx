import React from 'react';
import { StationSector, StationIncident } from '../../types/stationCommand';
import { Train } from '../../types/railway';
import { 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  KeyRound, 
  ShieldAlert, 
  Clock, 
  Train as TrainIcon, 
  Cpu, 
  Check, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PriorityActionPanelProps {
  sectors: StationSector[];
  incidents: StationIncident[];
  trains: Train[];
  onOpenIncidentModal: (incident: StationIncident) => void;
  onSelectSector: (sector: StationSector) => void;
  onTriggerCrowdDivert: (fromSectorId: string, toSectorId: string) => void;
  onSelectTrain?: (train: Train) => void;
}

export const PriorityActionPanel: React.FC<PriorityActionPanelProps> = ({
  sectors,
  incidents,
  trains,
  onOpenIncidentModal,
  onSelectSector,
  onTriggerCrowdDivert,
  onSelectTrain
}) => {
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalSectors = sectors.filter(s => s.status === 'CRITICAL' || s.crowdDensity > 80);

  // Target showcase train for delay prediction panel (Train 12952 / 12951)
  const targetTrain = trains.find(t => t.number === '12952') || trains[0];

  const handleExecuteAiDivert = () => {
    onTriggerCrowdDivert('P2-B', 'P3-A');
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.65 }
    });
  };

  return (
    <div className="w-full lg:w-[420px] bg-slate-950 border-l border-slate-800 p-3.5 flex flex-col h-full overflow-y-auto space-y-4">
      
      {/* 1. PRIORITY ALERTS PANEL */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Priority Alerts
            </h3>
          </div>
          <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.2 rounded border border-rose-500/30">
            Immediate Action
          </span>
        </div>

        <div className="space-y-2">
          {/* Critical Platform 2 Alert */}
          {criticalSectors.map(sec => (
            <div
              key={sec.id}
              onClick={() => onSelectSector(sec)}
              className="p-3 bg-rose-950/30 border border-rose-800/60 rounded-xl space-y-1.5 cursor-pointer hover:border-rose-600 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-rose-400 font-black text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>🔴 CRITICAL — {sec.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Crowd density (87%) exceeded safe threshold. Predicted overflow in 8 min.
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">2 min ago</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-rose-900/40 text-xs">
                <span className="text-[10px] text-rose-300 font-mono font-bold">565 Pax (87%)</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSector(sec);
                  }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                >
                  View Zone &rarr;
                </button>
              </div>
            </div>
          ))}

          {/* Safety Incidents with OTP */}
          {activeIncidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => onOpenIncidentModal(inc)}
              className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5 cursor-pointer hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <span className="text-rose-400 font-black">
                      {inc.severity === 'CRITICAL' ? '🔴' : '🟠'} {inc.category} —
                    </span>
                    <span className="text-white font-mono">{inc.location}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{inc.title}</p>
                  <span className="text-[10px] text-slate-500 font-mono">{inc.reportedTime}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-xs">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
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

      {/* 2. DELAY PREDICTION CARD (PROMINENT & ACTIONABLE) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <TrainIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Train {targetTrain.number} — Delay Prediction
            </span>
          </div>
          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.2 rounded font-bold">
            Live Inference
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Expected Delay:</div>
            <div className="font-mono text-xl font-black text-amber-400 mt-0.5">
              +{targetTrain.delayMinutes} min
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Prediction Confidence:</div>
            <div className="font-mono text-base font-bold text-cyan-400 mt-0.5">
              {targetTrain.aiInsights.confidence}%
            </div>
          </div>
        </div>

        {/* Primary Factors */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1 text-xs">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Primary Contributing Factors:</div>
          <div className="space-y-1 text-[11px] text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Platform 2 crowd dwell overrun (+5m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Preceding freight rake block occupancy (+4m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Speed restriction on Chambal curve (+3m)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-slate-400">Predicted Arrival: <b className="text-blue-300 font-mono">{targetTrain.aiPredictedETA}</b></span>
          <span className="text-[10px] text-slate-500">Sched: {targetTrain.scheduledETA}</span>
        </div>
      </div>

      {/* 3. 🤖 AI RECOMMENDATION BOX */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-indigo-500/40 p-3.5 rounded-2xl space-y-2.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs">
            <span className="text-base">🤖</span>
            <span>AI Operational Insight</span>
          </div>
          <span className="text-cyan-400 font-mono text-[10px] font-bold">Recommended Action</span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          Platform 2 congestion is increasing rapidly (87%). Expected to reach critical bottleneck in <b>8 minutes</b>.
        </p>

        <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
          <span className="text-slate-400">Action:</span>
          <span className="text-emerald-400 font-bold">Redirect passenger flow to Platform 3</span>
        </div>

        <button
          onClick={handleExecuteAiDivert}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 transition"
        >
          <Send className="w-3.5 h-3.5" />
          Acknowledge & Divert Crowd
        </button>
      </div>

    </div>
  );
};
