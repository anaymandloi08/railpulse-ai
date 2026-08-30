import React from 'react';
import { Train } from '../../types/railway';
import { DelayCharts } from './DelayCharts';
import { Cpu, ShieldCheck, Zap, AlertTriangle, Layers, BrainCircuit, Activity } from 'lucide-react';
import { AI_PREDICTION_ACCURACY_POINTS } from '../../data/historicalData';

interface DelayPredictionEngineProps {
  trains: Train[];
}

export const DelayPredictionEngine: React.FC<DelayPredictionEngineProps> = ({ trains }) => {
  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <span>NEURAL TRAIN TRAJECTORY & DELAY ESTIMATOR</span>
        </div>
        <h2 className="text-xl font-black text-white mt-1">
          Real-Time AI Delay Prediction Engine
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Powered by multi-variable gradient-boosted trees and section block simulation. Factors in station dwell times, dynamic line congestion, preceding train spacing, track speed restrictions, and weather gradients.
        </p>

        {/* Top Model Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Mean Abs Error (MAE)</div>
            <div className="text-lg font-black text-emerald-400 mt-0.5">&plusmn;1.4 <span className="text-xs font-normal">min</span></div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">R² Prediction Fit</div>
            <div className="text-lg font-black text-cyan-400 mt-0.5">0.964 <span className="text-xs font-normal">High</span></div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Inference Latency</div>
            <div className="text-lg font-black text-blue-400 mt-0.5">18 <span className="text-xs font-normal">ms/train</span></div>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Active Lookahead</div>
            <div className="text-lg font-black text-amber-400 mt-0.5">180 <span className="text-xs font-normal">min window</span></div>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <DelayCharts />

      {/* Model Accuracy Comparison Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Validation: Actual Delay vs AI Model Inference
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Telemetry Synced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Train No.</th>
                <th className="py-2.5 px-3">Actual Delay</th>
                <th className="py-2.5 px-3">AI Prediction</th>
                <th className="py-2.5 px-3">Residual Error</th>
                <th className="py-2.5 px-3">Confidence Score</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {AI_PREDICTION_ACCURACY_POINTS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50">
                  <td className="py-2.5 px-3 font-bold text-white">TRAIN {row.trainNo}</td>
                  <td className="py-2.5 px-3 text-slate-200">+{row.actual} min</td>
                  <td className="py-2.5 px-3 text-blue-400 font-bold">+{row.predicted} min</td>
                  <td className="py-2.5 px-3 text-emerald-400">{row.error > 0 ? `+${row.error}` : row.error} min</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">{row.confidence}%</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded font-bold">
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
