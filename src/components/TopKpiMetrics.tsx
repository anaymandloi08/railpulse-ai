import React from 'react';
import { Train, NetworkKPIs } from '../types/railway';
import { Activity, Clock, AlertTriangle, ShieldCheck, TrendingUp, Radio } from 'lucide-react';

interface TopKpiMetricsProps {
  trains: Train[];
  activeAlertsCount: number;
}

export const TopKpiMetrics: React.FC<TopKpiMetricsProps> = ({ trains, activeAlertsCount }) => {
  const totalTrains = trains.length;
  const onTimeCount = trains.filter(t => t.delayMinutes <= 10).length;
  const onTimePct = totalTrains > 0 ? Math.round((onTimeCount / totalTrains) * 100) : 0;
  const severeDelaysCount = trains.filter(t => t.delayMinutes > 30).length;
  const avgDelay = totalTrains > 0 ? Math.round(trains.reduce((acc, t) => acc + t.delayMinutes, 0) / totalTrains) : 0;
  const avgConfidence = totalTrains > 0 ? Math.round(trains.reduce((acc, t) => acc + t.aiInsights.confidence, 0) / totalTrains) : 92;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 p-3 bg-slate-950/60 border-b border-slate-800/80">
      
      {/* 1. Active Fleet */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Trains</div>
          <div className="text-lg font-black text-white">{totalTrains} <span className="text-[10px] text-emerald-400 font-normal">Fleet Live</span></div>
        </div>
      </div>

      {/* 2. On-Time Performance */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">On-Time OTP</div>
          <div className="text-lg font-black text-emerald-400">{onTimePct}% <span className="text-[10px] text-slate-400 font-normal">(&le;10m)</span></div>
        </div>
      </div>

      {/* 3. Severe Delays */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Severe Delays</div>
          <div className="text-lg font-black text-rose-400">{severeDelaysCount} <span className="text-[10px] text-slate-400 font-normal">(&gt;30m)</span></div>
        </div>
      </div>

      {/* 4. Average Network Delay */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Avg Network Delay</div>
          <div className="text-lg font-black text-amber-400">+{avgDelay} <span className="text-xs font-medium">min</span></div>
        </div>
      </div>

      {/* 5. AI Confidence Index */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">AI Confidence</div>
          <div className="text-lg font-black text-cyan-400">{avgConfidence}% <span className="text-[10px] text-slate-400 font-normal">Precision</span></div>
        </div>
      </div>

      {/* 6. Active Alerts */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
          <Activity className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Critical Alerts</div>
          <div className="text-lg font-black text-red-400">{activeAlertsCount} <span className="text-[10px] text-slate-400 font-normal">Pending</span></div>
        </div>
      </div>

    </div>
  );
};
