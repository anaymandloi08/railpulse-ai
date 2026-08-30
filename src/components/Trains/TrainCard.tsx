import React from 'react';
import { Train, DelayRiskLevel } from '../../types/railway';
import { 
  ArrowRight, 
  MapPin, 
  Clock, 
  Cpu, 
  Sparkles, 
  AlertCircle, 
  Gauge, 
  CheckCircle2, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface TrainCardProps {
  train: Train;
  isSelected: boolean;
  onSelect: (train: Train) => void;
  onOpenDetails: (train: Train) => void;
  onSimulateFix: (train: Train) => void;
}

export const TrainCard: React.FC<TrainCardProps> = ({
  train,
  isSelected,
  onSelect,
  onOpenDetails,
  onSimulateFix
}) => {
  
  // Render ASCII/Visual progress bar for Delay Risk
  const renderRiskBar = (risk: DelayRiskLevel, score: number) => {
    // 10 blocks: filled vs empty
    const filledCount = Math.min(10, Math.max(1, Math.round(score)));
    const emptyCount = 10 - filledCount;
    const filledStr = '█'.repeat(filledCount);
    const emptyStr = '░'.repeat(emptyCount);

    let colorClass = 'text-emerald-400';
    let bgBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (risk === 'MEDIUM') {
      colorClass = 'text-amber-400';
      bgBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    } else if (risk === 'HIGH' || risk === 'CRITICAL') {
      colorClass = 'text-rose-400';
      bgBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }

    return (
      <div className="mt-2.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[11px] font-semibold text-slate-400">Delay Risk:</span>
          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${bgBadge}`}>
            {risk}
          </span>
        </div>
        <div className="font-mono text-sm tracking-tighter flex items-center justify-between">
          <span className={colorClass}>{filledStr}{emptyStr}</span>
          <span className={`font-bold text-xs ${colorClass}`}>{risk}</span>
        </div>
      </div>
    );
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'VANDE_BHARAT':
        return <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">Vande Bharat</span>;
      case 'RAJDHANI':
        return <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">Rajdhani</span>;
      case 'SHATABDI':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">Shatabdi</span>;
      case 'FREIGHT':
        return <span className="bg-slate-500/20 text-slate-300 border border-slate-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">DFC Freight</span>;
      default:
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">Superfast</span>;
    }
  };

  const isHighRisk = train.delayRisk === 'HIGH' || train.delayRisk === 'CRITICAL';

  return (
    <div
      onClick={() => onSelect(train)}
      className={`relative rounded-xl p-3.5 transition-all cursor-pointer border ${
        isSelected
          ? 'bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
          : isHighRisk
          ? 'bg-slate-900/90 border-rose-900/60 hover:border-rose-700/80 hover:bg-slate-850'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
      }`}
    >
      {/* Header: Train Number & Route */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-base tracking-wider text-white">
              TRAIN {train.number}
            </span>
            {getCategoryBadge(train.category)}
          </div>
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
            <span>{train.origin}</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>{train.destination}</span>
          </div>
        </div>

        {/* Speed / Live Status */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
            <Gauge className="w-3 h-3 text-blue-400" />
            <span>{train.speed} km/h</span>
          </div>
        </div>
      </div>

      {/* Current Location & Next Station */}
      <div className="grid grid-cols-2 gap-2 mt-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-blue-400" />
            Current Location:
          </div>
          <div className="font-bold text-slate-200 mt-0.5 truncate">{train.currentStation}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
            Next Station:
          </div>
          <div className="font-bold text-slate-200 mt-0.5 truncate">{train.nextStation}</div>
        </div>
      </div>

      {/* Scheduled vs AI Predicted Arrival */}
      <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs">
        <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
          <div className="text-[10px] text-slate-400 font-medium">Scheduled Arrival:</div>
          <div className="font-mono text-sm font-bold text-slate-300 mt-0.5">
            {train.scheduledETA}
          </div>
        </div>
        <div className="bg-blue-950/30 p-2 rounded-lg border border-blue-800/40">
          <div className="text-[10px] text-blue-300 font-medium flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5 text-blue-400" />
            AI Predicted Arrival:
          </div>
          <div className="font-mono text-sm font-bold text-blue-300 mt-0.5">
            {train.aiPredictedETA}
          </div>
        </div>
      </div>

      {/* Delay & Confidence */}
      <div className="flex items-center justify-between mt-2.5 px-1 text-xs">
        <div>
          <span className="text-[11px] text-slate-400">Delay: </span>
          <span className={`font-mono font-bold text-sm ${
            train.delayMinutes > 30 ? 'text-rose-400' : train.delayMinutes > 5 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {train.delayMinutes > 0 ? `+${train.delayMinutes} min` : 'ON TIME'}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400">Confidence: </span>
          <span className="font-mono font-bold text-xs text-cyan-400">
            {train.aiInsights.confidence}%
          </span>
        </div>
      </div>

      {/* Visual Delay Risk Gauge */}
      {renderRiskBar(train.delayRisk, train.aiInsights.riskScore)}

      {/* Action Buttons */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(train);
          }}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold px-2 py-1 rounded hover:bg-blue-950/40 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Diagnostics
        </button>

        {train.delayMinutes > 5 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSimulateFix(train);
            }}
            className="text-xs bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition"
          >
            <TrendingDown className="w-3 h-3 text-amber-400" />
            Simulate Fix
          </button>
        )}
      </div>

    </div>
  );
};
