import React, { useState } from 'react';
import { Train, DispatchScenario } from '../../types/railway';
import { AVAILABLE_DISPATCH_SCENARIOS, calculateSimulatedOutcome, SimulationOutcome } from '../../services/aiPredictor';
import { 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  TrendingDown, 
  RotateCcw, 
  Train as TrainIcon,
  Sliders,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DecisionSupportSandboxProps {
  trains: Train[];
  onApplyScenarioToLiveState?: (trainNumber: string, delayReduction: number) => void;
}

export const DecisionSupportSandbox: React.FC<DecisionSupportSandboxProps> = ({
  trains,
  onApplyScenarioToLiveState
}) => {
  // Target train selection for simulation (Default to 12951 Mumbai Rajdhani)
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('12951');
  const [activeScenarioIds, setActiveScenarioIds] = useState<string[]>(['SCENARIO_HOLD_FREIGHT']);
  const [appliedLive, setAppliedLive] = useState<boolean>(false);

  const currentTrain = trains.find(t => t.number === selectedTrainNumber) || trains[0];
  const outcome: SimulationOutcome = calculateSimulatedOutcome(currentTrain, activeScenarioIds);

  const toggleScenario = (id: string) => {
    setActiveScenarioIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setAppliedLive(false);
  };

  const handleExecuteDispatchOrder = () => {
    setAppliedLive(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.65 }
    });
    if (onApplyScenarioToLiveState) {
      onApplyScenarioToLiveState(currentTrain.number, outcome.delaySaved);
    }
  };

  return (
    <div className="p-4 space-y-5 max-w-7xl mx-auto">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border border-indigo-500/30 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>CONTROLLER DECISION SUPPORT SYSTEM (CDSS)</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            "What-If" Dispatch Simulation Sandbox
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate real-time track precedence, platform diversion, and speed recovery to compute projected corridor delay reduction.
          </p>
        </div>

        {/* Train Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
          <TrainIcon className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-300">Target Train:</span>
          <select
            value={selectedTrainNumber}
            onChange={(e) => {
              setSelectedTrainNumber(e.target.value);
              setAppliedLive(false);
            }}
            className="bg-slate-800 text-white font-mono text-xs rounded-lg px-2.5 py-1 border border-slate-700 font-bold focus:outline-none focus:border-indigo-500"
          >
            {trains.map(t => (
              <option key={t.id} value={t.number}>
                Train {t.number} - {t.name} (+{t.delayMinutes}m)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Intervention Toggles (Left) vs Real-Time Impact Projection (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Col: Scenarios List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Available Dispatch Interventions
            </h3>
            <span className="text-[11px] text-slate-400">
              {activeScenarioIds.length} Selected
            </span>
          </div>

          <div className="space-y-2.5">
            {AVAILABLE_DISPATCH_SCENARIOS.map(scenario => {
              const isSelected = activeScenarioIds.includes(scenario.id);
              const isRelevant = scenario.affectedTrainNumbers.includes(currentTrain.number);

              return (
                <div
                  key={scenario.id}
                  onClick={() => toggleScenario(scenario.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                      : isRelevant
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      : 'bg-slate-950/40 border-slate-850 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            {scenario.title}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-semibold">
                            {scenario.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {scenario.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap">
                      <span className="font-mono font-black text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        {scenario.impactDelay} min
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setActiveScenarioIds([]);
              setAppliedLive(false);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 pt-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all simulation interventions
          </button>
        </div>

        {/* Right Col: Before vs After Impact Workbench (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Simulation Outcome Projection
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400">
                Confidence: {outcome.confidenceScore}%
              </span>
            </div>

            {/* Before vs After Visual Comparison Cards */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Baseline Before */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Baseline (Before)</div>
                <div className="text-rose-400 font-mono text-xl font-black">
                  +{outcome.delayBefore} min
                </div>
                <div className="text-[10px] text-slate-400">
                  Predicted ETA: <span className="text-slate-200 font-mono font-semibold">{outcome.originalETA}</span>
                </div>
              </div>

              {/* Simulated After */}
              <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-500/50 text-center space-y-1 relative overflow-hidden">
                <div className="text-[10px] text-indigo-300 font-bold uppercase">Simulated (After)</div>
                <div className="text-emerald-400 font-mono text-xl font-black">
                  +{outcome.delayAfter} min
                </div>
                <div className="text-[10px] text-indigo-200">
                  New ETA: <span className="text-white font-mono font-bold">{outcome.newETA}</span>
                </div>
                {outcome.delaySaved > 0 && (
                  <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 rounded-full">
                    -{outcome.delaySaved}m
                  </div>
                )}
              </div>

            </div>

            {/* Summary Explanation */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="font-bold text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulation Diagnostic Report</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {outcome.explanation}
              </p>
            </div>

            {/* Total Net Benefit Badge */}
            <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Net Delay Saved</div>
                <div className="text-lg font-black text-white">
                  {outcome.delaySaved} Minutes <span className="text-xs text-emerald-400 font-semibold">(Recovered)</span>
                </div>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                {outcome.networkImpact}
              </div>
            </div>

            {/* 1-Click Dispatch Action Button */}
            <button
              onClick={handleExecuteDispatchOrder}
              disabled={outcome.delaySaved === 0 || appliedLive}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg ${
                appliedLive
                  ? 'bg-emerald-600 text-white cursor-default'
                  : outcome.delaySaved > 0
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {appliedLive ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Dispatch Order Executed to Section Controller!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Issue AI Dispatch Order to Section Controller
                </>
              )}
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
