import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Train, Alert } from './types/railway';
import { INITIAL_TRAINS, INITIAL_ALERTS } from './data/mockTrains';
import { advanceSimulationStep } from './services/simulationEngine';
import { Navbar } from './components/Navbar';
import { TopKpiMetrics } from './components/TopKpiMetrics';
import { RailwayMap } from './components/Map/RailwayMap';
import { TrainListPanel } from './components/Trains/TrainListPanel';
import { TrainDetailDrawer } from './components/Trains/TrainDetailDrawer';
import { DelayPredictionEngine } from './components/AIAnalytics/DelayPredictionEngine';
import { DecisionSupportSandbox } from './components/AIAnalytics/DecisionSupportSandbox';
import { CongestionHeatmap } from './components/AIAnalytics/CongestionHeatmap';
import { AlertCenter } from './components/Alerts/AlertCenter';

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
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(INITIAL_TRAINS[0]);
  const [drawerTrain, setDrawerTrain] = useState<Train | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'analytics' | 'sandbox' | 'heatmap' | 'alerts'>('map');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Audio chime function using Web Audio API
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio not allowed yet', e);
    }
  };

  // Real-time Simulation Engine Tick Loop
  useEffect(() => {
    if (simSpeed === 0) return;

    const interval = setInterval(() => {
      setTrains(prevTrains => {
        const updated = advanceSimulationStep(prevTrains, simSpeed);
        // Keep selectedTrain reference updated
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

  // Handler: Select a train from map or list
  const handleSelectTrain = (train: Train) => {
    setSelectedTrain(train);
  };

  // Handler: Open in-depth diagnostics drawer
  const handleOpenDetails = (train: Train) => {
    setSelectedTrain(train);
    setDrawerTrain(train);
  };

  // Handler: Quick trigger simulation for a train
  const handleSimulateFix = (train: Train) => {
    setSelectedTrain(train);
    setActiveTab('sandbox');
  };

  // Handler: Apply scenario delay reduction to live state
  const handleApplyScenarioToLiveState = (trainNumber: string, delayReduction: number) => {
    playAlertChime();
    setTrains(prev => prev.map(t => {
      if (t.number === trainNumber) {
        const newDelay = Math.max(0, t.delayMinutes - delayReduction);
        const [h, m] = t.aiPredictedETA.split(':').map(Number);
        let totMin = h * 60 + m - delayReduction;
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

    // Auto-resolve associated alert if present
    setAlerts(prev => prev.map(a => {
      if (a.trainNumber === trainNumber) {
        return { ...a, resolved: true };
      }
      return a;
    }));
  };

  // Handler: Resolve an alert
  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const unresolvedAlertsCount = alerts.filter(a => !a.resolved).length;

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
        
        {/* 1. Header & Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          simSpeed={simSpeed}
          setSimSpeed={setSimSpeed}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          unresolvedAlertsCount={unresolvedAlertsCount}
        />

        {/* 2. Top Tactical KPI Metrics Bar */}
        <TopKpiMetrics
          trains={trains}
          activeAlertsCount={unresolvedAlertsCount}
        />

        {/* 3. Main Operational View Area */}
        <main className="flex-1 relative overflow-hidden">
          
          {/* TAB 1: Live Tracking & GIS Map View */}
          {activeTab === 'map' && (
            <div className="w-full h-full flex flex-col md:flex-row">
              {/* Left: Train Fleet List */}
              <div className="w-full md:w-[420px] lg:w-[460px] h-1/2 md:h-full z-10">
                <TrainListPanel
                  trains={trains}
                  selectedTrain={selectedTrain}
                  onSelectTrain={handleSelectTrain}
                  onOpenDetails={handleOpenDetails}
                  onSimulateFix={handleSimulateFix}
                />
              </div>

              {/* Right: Leaflet Interactive Map */}
              <div className="flex-1 h-1/2 md:h-full relative">
                <RailwayMap
                  trains={trains}
                  selectedTrain={selectedTrain}
                  onSelectTrain={handleSelectTrain}
                  onOpenDetails={handleOpenDetails}
                />
              </div>
            </div>
          )}

          {/* TAB 2: AI Delay Prediction Engine */}
          {activeTab === 'analytics' && (
            <div className="w-full h-full overflow-y-auto">
              <DelayPredictionEngine trains={trains} />
            </div>
          )}

          {/* TAB 3: "What-If" Decision Support Sandbox */}
          {activeTab === 'sandbox' && (
            <div className="w-full h-full overflow-y-auto">
              <DecisionSupportSandbox
                trains={trains}
                onApplyScenarioToLiveState={handleApplyScenarioToLiveState}
              />
            </div>
          )}

          {/* TAB 4: Network Corridor & Platform Density Heatmap */}
          {activeTab === 'heatmap' && (
            <div className="w-full h-full overflow-y-auto">
              <CongestionHeatmap />
            </div>
          )}

          {/* TAB 5: Incident Alerts & Dispatch Advisories Log */}
          {activeTab === 'alerts' && (
            <div className="w-full h-full overflow-y-auto">
              <AlertCenter
                alerts={alerts}
                onResolveAlert={handleResolveAlert}
                trains={trains}
                onOpenDetails={handleOpenDetails}
              />
            </div>
          )}

          {/* Slide-Out Diagnostics Drawer */}
          <TrainDetailDrawer
            train={drawerTrain}
            onClose={() => setDrawerTrain(null)}
            onSimulateFix={handleSimulateFix}
          />

        </main>

      </div>
    </ErrorBoundary>
  );
};

export default App;
