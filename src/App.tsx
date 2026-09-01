import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Train, Alert } from './types/railway';
import { INITIAL_TRAINS, INITIAL_ALERTS } from './data/mockTrains';
import { advanceSimulationStep } from './services/simulationEngine';
import { RailwayMap } from './components/Map/RailwayMap';
import { TrainDetailDrawer } from './components/Trains/TrainDetailDrawer';
import { DelayPredictionEngine } from './components/AIAnalytics/DelayPredictionEngine';
import { DecisionSupportSandbox } from './components/AIAnalytics/DecisionSupportSandbox';
import { 
  Train as TrainIcon, 
  MapPin, 
  ArrowRight, 
  Clock, 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  Gauge, 
  CheckCircle2, 
  Send,
  Zap,
  TrendingDown,
  Layers,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Activity,
  SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-900 border border-rose-800 text-rose-200 rounded-xl m-4">
          <h2 className="text-lg font-bold text-rose-400">View encountered an issue</h2>
          <pre className="text-xs mt-2 bg-slate-950 p-3 rounded font-mono overflow-auto">
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState<Train>(INITIAL_TRAINS[0]);
  const [drawerTrain, setDrawerTrain] = useState<Train | null>(null);
  const [activeTab, setActiveTab] = useState<'tracker' | 'predictor' | 'sandbox'>('tracker');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio Synthesizer for alerts
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio not allowed', e);
    }
  };

  // Real-time train coordinate animation ticker
  useEffect(() => {
    if (simSpeed === 0) return;

    const interval = setInterval(() => {
      setTrains(prevTrains => {
        const updated = advanceSimulationStep(prevTrains, simSpeed);
        if (selectedTrain) {
          const match = updated.find(t => t.id === selectedTrain.id);
          if (match) setSelectedTrain(match);
        }
        if (drawerTrain) {
          const match = updated.find(t => t.id === drawerTrain.id);
          if (match) setDrawerTrain(match);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simSpeed, selectedTrain?.id, drawerTrain?.id]);

  // Handler: Apply 1-click Dispatch Fix to dynamic ETA
  const handleQuickFixETA = () => {
    playAlertChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTrains(prev => prev.map(t => {
      if (t.id === selectedTrain.id) {
        const newDelay = Math.max(0, t.delayMinutes - 18);
        const [h, m] = t.aiPredictedETA.split(':').map(Number);
        let totMin = h * 60 + m - 18;
        if (totMin < 0) totMin += 24 * 60;
        const newH = Math.floor(totMin / 60) % 24;
        const newM = totMin % 60;
        const newETA = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;

        return {
          ...t,
          delayMinutes: newDelay,
          aiPredictedETA: newETA,
          delayRisk: newDelay > 30 ? 'HIGH' : newDelay > 5 ? 'MEDIUM' : 'LOW',
          status: newDelay > 30 ? 'HEAVY_DELAY' : newDelay > 5 ? 'SLIGHT_DELAY' : 'ON_TIME'
        };
      }
      return t;
    }));
  };

  const filteredTrains = trains.filter(t => 
    t.number.includes(searchTerm) || 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTrains = trains.length;
  const delayedCount = trains.filter(t => t.delayMinutes > 15).length;
  const avgDelay = Math.round(trains.reduce((acc, t) => acc + t.delayMinutes, 0) / trains.length);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
        
        {/* 1. TOP HEADER: DYNAMIC ETA COMMAND BAR */}
        <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 z-30 shadow-xl">
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <TrainIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black tracking-wider text-base md:text-lg bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent">
                  RAILPULSE AI
                </h1>
                <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-black px-2 py-0.2 rounded-full">
                  DYNAMIC ETA ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Indian Railways Real-Time Train Tracking & AI-Predicted Arrival Time
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'tracker'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrainIcon className="w-3.5 h-3.5" />
              <span>Live Train Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('predictor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'predictor'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Delay Diagnostics</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'sandbox'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>"What-If" Dispatch Fix</span>
            </button>
          </div>

          {/* Controls & Clock */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSimSpeed(simSpeed === 0 ? 1 : 0)}
                className="p-1 text-slate-400 hover:text-white"
              >
                {simSpeed === 0 ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              {[1, 2, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setSimSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    simSpeed === s ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border text-xs ${
                soundEnabled ? 'bg-blue-900/40 border-blue-500/40 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <div className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentTime || '--:--:--'}</span>
            </div>
          </div>

        </header>

        {/* 2. TOP KPI BAR */}
        <div className="bg-slate-900/70 border-b border-slate-800 px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Active Fleet:</span>
            <span className="font-mono font-black text-white text-sm">{totalTrains} Trains</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Delayed (&gt;15m):</span>
            <span className="font-mono font-black text-rose-400 text-sm">{delayedCount} Trains</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Average Network Delay:</span>
            <span className="font-mono font-black text-amber-400 text-sm">+{avgDelay} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase font-bold text-[10px]">AI Prediction Accuracy:</span>
            <span className="font-mono font-black text-cyan-400 text-sm">96.4% (&plusmn;1.4m MAE)</span>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {activeTab === 'tracker' && (
            <>
              {/* LEFT: TRAIN FLEET SELECTOR */}
              <div className="w-full lg:w-[320px] bg-slate-950 border-r border-slate-800 flex flex-col h-full z-10">
                <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-900/60">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>Select Train ({filteredTrains.length})</span>
                    <span className="text-[10px] text-blue-400 font-mono">Live GPS</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search train no, name, station..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                  {filteredTrains.map(train => {
                    const isSelected = selectedTrain?.id === train.id;
                    const isHeavy = train.delayMinutes > 30;

                    return (
                      <div
                        key={train.id}
                        onClick={() => setSelectedTrain(train)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/20 ring-1 ring-blue-500'
                            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-xs text-white">TRAIN {train.number}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded font-mono ${
                            isHeavy ? 'bg-rose-500/20 text-rose-300' : train.delayMinutes > 5 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {train.delayMinutes > 0 ? `+${train.delayMinutes}m` : 'ON TIME'}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-300 truncate mt-0.5">{train.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                          <span>{train.originCode} &rarr; {train.destinationCode}</span>
                          <span className="font-mono font-bold text-blue-300">{train.speed} km/h</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CENTER: LIVE RAILWAY MAP (55% Hero) */}
              <div className="flex-1 h-full relative bg-slate-950">
                <RailwayMap
                  trains={trains}
                  selectedTrain={selectedTrain}
                  onSelectTrain={(t) => setSelectedTrain(t)}
                  onOpenDetails={(t) => setDrawerTrain(t)}
                />
              </div>

              {/* RIGHT: THE PROMINENT DYNAMIC ETA CARD (User's Exact Specification) */}
              <div className="w-full lg:w-[440px] bg-slate-950 border-l border-slate-800 p-4 flex flex-col h-full overflow-y-auto space-y-3.5 z-10">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-lg text-white">TRAIN {selectedTrain.number}</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                        {selectedTrain.category}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <span>{selectedTrain.origin}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span>{selectedTrain.destination}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-right">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Speed</div>
                    <div className="font-mono font-black text-xs text-white">{selectedTrain.speed} km/h</div>
                  </div>
                </div>

                {/* Location Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      Current Location:
                    </div>
                    <div className="font-bold text-white mt-0.5 truncate">{selectedTrain.currentStation}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                      Next Station:
                    </div>
                    <div className="font-bold text-white mt-0.5 truncate">{selectedTrain.nextStation}</div>
                  </div>
                </div>

                {/* Scheduled vs AI Dynamic ETA (THE HERO SPECIFICATION) */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold">Scheduled Arrival:</div>
                    <div className="font-mono text-lg font-black text-slate-300 mt-1">
                      {selectedTrain.scheduledETA}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-950/80 to-indigo-950/80 p-3 rounded-xl border border-blue-500/50 shadow-md">
                    <div className="text-[10px] text-blue-300 font-bold flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      AI Predicted Arrival:
                    </div>
                    <div className="font-mono text-lg font-black text-cyan-300 mt-1">
                      {selectedTrain.aiPredictedETA}
                    </div>
                  </div>
                </div>

                {/* Delay & Confidence */}
                <div className="flex items-center justify-between px-1 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold">Delay: </span>
                    <span className={`font-mono font-black text-base ${
                      selectedTrain.delayMinutes > 30 ? 'text-rose-400' : selectedTrain.delayMinutes > 5 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedTrain.delayMinutes > 0 ? `+${selectedTrain.delayMinutes} min` : 'ON TIME'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold">Confidence: </span>
                    <span className="font-mono font-bold text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                      {selectedTrain.aiInsights.confidence}%
                    </span>
                  </div>
                </div>

                {/* Delay Risk Visual Bar */}
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Delay Risk:</span>
                    <span className={`font-black text-xs uppercase ${
                      selectedTrain.delayRisk === 'HIGH' || selectedTrain.delayRisk === 'CRITICAL' ? 'text-rose-400' :
                      selectedTrain.delayRisk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedTrain.delayRisk}
                    </span>
                  </div>
                  <div className="font-mono text-base tracking-tighter flex items-center justify-between">
                    <span className={
                      selectedTrain.delayRisk === 'HIGH' || selectedTrain.delayRisk === 'CRITICAL' ? 'text-rose-500' :
                      selectedTrain.delayRisk === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                    }>
                      {selectedTrain.delayRisk === 'HIGH' || selectedTrain.delayRisk === 'CRITICAL' ? '████████░░' :
                       selectedTrain.delayRisk === 'MEDIUM' ? '█████░░░░░' : '██░░░░░░░░'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{selectedTrain.aiInsights.riskScore} / 10</span>
                  </div>
                </div>

                {/* AI Root Cause Diagnostics (Why the ETA changed) */}
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Why ETA Changed (Feature Attribution):</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    {selectedTrain.aiInsights.breakdown.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                        <div className="flex justify-between text-slate-300 font-semibold">
                          <span>{item.factor}</span>
                          <span className="text-amber-400 font-mono font-bold">+{item.impactMinutes}m</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click Dispatch Action Button */}
                {selectedTrain.delayMinutes > 5 && (
                  <button
                    onClick={handleQuickFixETA}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
                  >
                    <TrendingDown className="w-4 h-4 text-emerald-300" />
                    Simulate Dispatch Fix & Recover ETA (-18 min)
                  </button>
                )}

              </div>
            </>
          )}

          {activeTab === 'predictor' && (
            <div className="w-full h-full overflow-y-auto">
              <DelayPredictionEngine trains={trains} />
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="w-full h-full overflow-y-auto">
              <DecisionSupportSandbox trains={trains} />
            </div>
          )}

          {/* Diagnostics Drawer */}
          <TrainDetailDrawer
            train={drawerTrain}
            onClose={() => setDrawerTrain(null)}
            onSimulateFix={() => setActiveTab('sandbox')}
          />

        </main>

        {/* 4. BOTTOM TIMETABLE DYNAMIC ETA STRIP */}
        <footer className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center gap-3 overflow-x-auto text-xs whitespace-nowrap z-20">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] uppercase tracking-wider shrink-0">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>TRAIN {selectedTrain.number} UPCOMING STOPS DYNAMIC ETA:</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {selectedTrain.routeStops.map((stop, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold">{stop.stationName}:</span>
                <span className="text-blue-300 font-bold">{stop.predictedArrival || stop.scheduledArrival}</span>
                {stop.delayAtStop > 0 && (
                  <span className="text-rose-400 font-bold text-[10px]">(+{stop.delayAtStop}m)</span>
                )}
                {idx < selectedTrain.routeStops.length - 1 && <span className="text-slate-700 ml-2">&rarr;</span>}
              </div>
            ))}
          </div>
        </footer>

      </div>
    </ErrorBoundary>
  );
};

export default App;
