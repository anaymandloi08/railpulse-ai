import React from 'react';
import { Train } from '../../types/railway';
import { 
  X, 
  Cpu, 
  MapPin, 
  Clock, 
  ArrowRight, 
  TrendingDown, 
  Gauge, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  CornerDownRight
} from 'lucide-react';

interface TrainDetailDrawerProps {
  train: Train | null;
  onClose: () => void;
  onSimulateFix: (train: Train) => void;
}

export const TrainDetailDrawer: React.FC<TrainDetailDrawerProps> = ({
  train,
  onClose,
  onSimulateFix
}) => {
  if (!train) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-black text-white">
              TRAIN {train.number}
            </span>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-bold">
              {train.category}
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {train.name}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Route Summary */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>{train.origin}</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
            <span>{train.destination}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Speed</div>
              <div className="text-sm font-bold text-white mt-0.5">{train.speed} <span className="text-[10px] text-slate-400">km/h</span></div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Delay</div>
              <div className={`text-sm font-bold mt-0.5 ${
                train.delayMinutes > 30 ? 'text-rose-400' : train.delayMinutes > 5 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {train.delayMinutes > 0 ? `+${train.delayMinutes}m` : '0m'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">AI Confidence</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">{train.aiInsights.confidence}%</div>
            </div>
          </div>
        </div>

        {/* AI Root Cause Diagnostics */}
        <div className="bg-gradient-to-br from-slate-950 to-blue-950/40 p-3.5 rounded-xl border border-blue-900/50 space-y-3">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>AI ROOT CAUSE DIAGNOSTICS</span>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-slate-200">
            <div className="text-[11px] font-semibold text-amber-300">Primary Bottleneck:</div>
            <div className="text-xs font-bold mt-0.5">{train.aiInsights.primaryCause}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Critical Junction: <span className="text-white font-semibold">{train.aiInsights.bottleneckStation}</span>
            </div>
          </div>

          {/* Factor Breakdown Bars */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Delay Attribution Factors:
            </div>
            {train.aiInsights.breakdown.map((factor, idx) => (
              <div key={idx} className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-300">{factor.factor}</span>
                  <span className="font-mono font-bold text-amber-400">+{factor.impactMinutes} min ({factor.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-amber-500 h-full rounded-full"
                    style={{ width: `${factor.percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {factor.description}
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommended Mitigation */}
          <div className="bg-indigo-950/60 border border-indigo-500/30 p-3 rounded-lg space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>AI Dispatcher Recommendation</span>
            </div>
            <p className="text-slate-200 text-xs">
              {train.aiInsights.suggestedAction}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-indigo-800/40">
              <span className="text-emerald-400 font-bold text-xs">
                Projected Recovery: ~{train.aiInsights.projectedRecoveryMinutes} min
              </span>
              <button
                onClick={() => {
                  onClose();
                  onSimulateFix(train);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-1 rounded-md transition flex items-center gap-1 shadow-md shadow-indigo-600/30"
              >
                <TrendingDown className="w-3 h-3" />
                Apply Fix in Sandbox
              </button>
            </div>
          </div>

        </div>

        {/* Station-by-Station Timetable Checklist */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase">
            <span>Route Schedule Checklist</span>
            <span className="text-slate-500 font-normal">Actual vs Sched</span>
          </div>

          <div className="space-y-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {train.routeStops.map((stop, idx) => (
              <div key={idx} className="relative pl-6 flex items-start justify-between text-xs">
                {/* Status Dot */}
                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  stop.status === 'PASSED'
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : stop.status === 'CURRENT'
                    ? 'bg-blue-600 border-blue-400 text-white animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-600'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div>
                  <div className="font-bold text-slate-200">
                    {stop.stationName} ({stop.stationCode})
                  </div>
                  <div className="text-[10px] text-slate-400">
                    PF-{stop.platform || 1} • Sched: {stop.scheduledArrival}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-300">
                    {stop.actualArrival || stop.predictedArrival || stop.scheduledArrival}
                  </div>
                  {stop.delayAtStop > 0 && (
                    <span className="text-[10px] font-bold text-rose-400">
                      +{stop.delayAtStop}m
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
