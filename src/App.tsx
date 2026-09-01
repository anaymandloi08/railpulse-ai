import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Train, TrainStop } from './types/railway';
import { INITIAL_TRAINS } from './data/mockTrains';
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
  X,
  ShieldCheck,
  Check
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
  const [activeTab, setActiveTab] = useState<'tracking' | 'prediction' | 'whatif'>('tracking');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [selectedStopModal, setSelectedStopModal] = useState<TrainStop | null>(null);

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
                  DYNAMIC ETA PREDICTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Indian Railways Real-Time Train Tracking & Dynamic Arrival Forecast
              </p>
            </div>
          </div>

          {/* Clean 3-Tab Navigation */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'tracking'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrainIcon className="w-3.5 h-3.5" />
              <span>Live Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab('prediction')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'prediction'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ETA Prediction</span>
            </button>

            <button
              onClick={() => setActiveTab('whatif')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === 'whatif'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>What-If</span>
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

        {/* 2. TOP KPI BAR: TECHNICALLY DEFENSIBLE METRICS */}
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
            <span className="text-slate-400 uppercase font-bold text-[10px]">Avg Network Delay:</span>
            <span className="font-mono font-black text-amber-400 text-sm">+{avgDelay} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Validation MAE:</span>
            <span className="font-mono font-black text-cyan-400 text-sm">&plusmn;1.4 min <span className="text-[10px] text-slate-400 font-normal">(91% Conf)</span></span>
          </div>
        </div>

        {/* 3. MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {activeTab === 'tracking' && (
            <>
              {/* LEFT: TRAIN FLEET SELECTOR (Delay-Prioritized) */}
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
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                            isHeavy ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : train.delayMinutes > 5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {train.delayMinutes > 0 ? `+${train.delayMinutes} min` : 'ON TIME'}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-200 truncate mt-0.5">{train.name}</div>
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

              {/* RIGHT: THE PROMINENT DYNAMIC ETA CARD (1-Second Recognition) */}
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
                    <div className="text-xs font-semibold text-slate-300 mt-0.5">
                      {selectedTrain.name}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-right">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">Speed</div>
                    <div className="font-mono font-black text-xs text-blue-400">{selectedTrain.speed} km/h</div>
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

                {/* VISUAL CENTERPIECE: BOLD DYNAMIC ETA SHOWCASE */}
                <div className="bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 p-4 rounded-2xl shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Scheduled Arrival:</span>
                    <span className="font-mono font-bold text-slate-300 text-sm">{selectedTrain.scheduledETA}</span>
                  </div>

                  <div className="pt-2 pb-1 border-t border-slate-800/80 text-center">
                    <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-black flex items-center justify-center gap-1">
                      <Cpu className="w-3.5 h-3.5" />
                      AI Predicted Dynamic Arrival
                    </div>
                    <div className="font-mono text-4xl font-black text-white tracking-tight my-1">
                      {selectedTrain.aiPredictedETA}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className={`font-mono font-black ${selectedTrain.delayMinutes > 30 ? 'text-rose-400' : selectedTrain.delayMinutes > 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        +{selectedTrain.delayMinutes} min from schedule
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-cyan-300 font-mono font-bold bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.2 rounded">
                        {selectedTrain.aiInsights.confidence}% Confidence
                      </span>
                    </div>
                  </div>

                  {/* Delay Risk Visual Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Delay Risk:</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className={
                        selectedTrain.delayRisk === 'HIGH' || selectedTrain.delayRisk === 'CRITICAL' ? 'text-rose-500' :
                        selectedTrain.delayRisk === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                      }>
                        {selectedTrain.delayRisk === 'HIGH' || selectedTrain.delayRisk === 'CRITICAL' ? '████████░░' :
                         selectedTrain.delayRisk === 'MEDIUM' ? '█████░░░░░' : '██░░░░░░░░'}
                      </span>
                      <span className={`font-black uppercase text-[10px] ${
                        selectedTrain.delayRisk === 'HIGH' || selectedTrain.delayRisk === 'CRITICAL' ? 'text-rose-400' :
                        selectedTrain.delayRisk === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {selectedTrain.delayRisk}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Root Cause Diagnostics (Why ETA Changed) */}
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Why ETA Changed? (Attribution)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">Real-time Factors</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {selectedTrain.aiInsights.breakdown.map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-slate-200 text-[11px]">{item.factor}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.description}</div>
                        </div>
                        <span className="text-amber-400 font-mono font-bold text-xs shrink-0">
                          +{item.impactMinutes}m
                        </span>
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

          {activeTab === 'prediction' && (
            <div className="w-full h-full overflow-y-auto">
              <DelayPredictionEngine trains={trains} />
            </div>
          )}

          {activeTab === 'whatif' && (
            <div className="w-full h-full overflow-y-auto">
              <DecisionSupportSandbox trains={trains} />
            </div>
          )}

          {/* Diagnostics Drawer */}
          <TrainDetailDrawer
            train={drawerTrain}
            onClose={() => setDrawerTrain(null)}
            onSimulateFix={() => setActiveTab('whatif')}
          />

        </main>

        {/* 4. BOTTOM TIMETABLE: INTERACTIVE DYNAMIC ETA PROPAGATION */}
        <footer className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center gap-3 overflow-x-auto text-xs whitespace-nowrap z-20">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] uppercase tracking-wider shrink-0">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>TRAIN {selectedTrain.number} ROUTE ETA PROPAGATION:</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {selectedTrain.routeStops.map((stop, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setSelectedStopModal(stop)}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition text-xs cursor-pointer shadow-sm"
                  title="Click to view station ETA propagation breakdown"
                >
                  <span className="text-slate-300 font-bold">{stop.stationName}</span>
                  <span className="text-blue-400 font-bold">({stop.predictedArrival || stop.scheduledArrival})</span>
                  {stop.delayAtStop > 0 && (
                    <span className="text-rose-400 font-bold text-[10px]">+{stop.delayAtStop}m</span>
                  )}
                </button>
                {idx < selectedTrain.routeStops.length - 1 && <span className="text-slate-700">&rarr;</span>}
              </React.Fragment>
            ))}
          </div>
        </footer>

        {/* 5. INTERACTIVE STATION STOP INSPECTION MODAL */}
        {selectedStopModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-sm text-white">{selectedStopModal.stationName} ({selectedStopModal.stationCode})</span>
                </div>
                <button
                  onClick={() => setSelectedStopModal(null)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div className="text-slate-400">
                  Dynamic ETA Propagation for <b>Train {selectedTrain.number} ({selectedTrain.name})</b>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Scheduled Arrival:</div>
                    <div className="font-mono text-base font-bold text-slate-200 mt-0.5">{selectedStopModal.scheduledArrival}</div>
                  </div>
                  <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-500/40">
                    <div className="text-[10px] text-blue-300 font-bold">Dynamic Predicted ETA:</div>
                    <div className="font-mono text-base font-black text-cyan-300 mt-0.5">{selectedStopModal.predictedArrival || selectedStopModal.scheduledArrival}</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Accumulated Delay:</span>
                    <span className="text-rose-400 font-bold">+{selectedStopModal.delayAtStop} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scheduled Dwell:</span>
                    <span className="text-slate-200">{selectedStopModal.dwellMinutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Predicted Departure:</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedStopModal.actualDeparture || selectedStopModal.scheduledDeparture}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStopModal(null)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl transition"
                >
                  Close Stop Inspector
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
};

export default App;
