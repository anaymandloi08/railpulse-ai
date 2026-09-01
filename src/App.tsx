import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Train, Alert } from './types/railway';
import { INITIAL_TRAINS, INITIAL_ALERTS } from './data/mockTrains';
import { 
  INITIAL_SECTORS, 
  INITIAL_STATION_INCIDENTS, 
  INITIAL_LIVE_EVENTS, 
  INITIAL_STATION_HEALTH 
} from './data/mockStationData';
import { StationSector, StationIncident, LiveActivityEvent, StationHealthData } from './types/stationCommand';
import { advanceSimulationStep } from './services/simulationEngine';
import { Navbar } from './components/Navbar';
import { StationCommandCockpit } from './components/Station/StationCommandCockpit';
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
  // Primary View Switcher: Station Command Cockpit vs National Fleet Corridor
  const [primaryView, setPrimaryView] = useState<'STATION_COMMAND' | 'NATIONAL_FLEET'>('STATION_COMMAND');

  // Station State
  const [sectors, setSectors] = useState<StationSector[]>(INITIAL_SECTORS);
  const [incidents, setIncidents] = useState<StationIncident[]>(INITIAL_STATION_INCIDENTS);
  const [stationHealth, setStationHealth] = useState<StationHealthData>(INITIAL_STATION_HEALTH);
  const [events, setEvents] = useState<LiveActivityEvent[]>(INITIAL_LIVE_EVENTS);

  // Train Corridor State
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(INITIAL_TRAINS[0]);
  const [drawerTrain, setDrawerTrain] = useState<Train | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'analytics' | 'sandbox' | 'heatmap' | 'alerts'>('map');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Web Audio Synthesizer
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

  // Real-time tick for train coordinate animation
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

  // Handler: OTP Incident Resolution
  const handleResolveWithOtp = (incidentId: string) => {
    playAlertChime();
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return { ...inc, status: 'RESOLVED', progressStep: 5 };
      }
      return inc;
    }));

    // Update Station Health (+6 score boost)
    setStationHealth(prev => ({
      ...prev,
      overallScore: Math.min(99, prev.overallScore + 6),
      safetyIndex: Math.min(100, prev.safetyIndex + 4),
      incidentResolution: Math.min(100, prev.incidentResolution + 12)
    }));

    // Append to live activity stream
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setEvents(prev => [
      { id: `EVT-${Date.now()}`, time: timeStr, type: 'NORMAL', message: `Incident ${incidentId} successfully resolved via Passenger OTP verification` },
      ...prev.slice(0, 7)
    ]);
  };

  // Handler: Crowd Divert Action
  const handleTriggerCrowdDivert = (fromSectorId: string, toSectorId: string) => {
    playAlertChime();
    setSectors(prev => prev.map(sec => {
      if (sec.id === fromSectorId) {
        return {
          ...sec,
          crowdDensity: Math.max(48, sec.crowdDensity - 35),
          passengerCount: Math.max(280, sec.passengerCount - 220),
          status: 'NORMAL',
          aiRecommendation: 'Crowd diversion active. Passenger density dropping rapidly.'
        };
      }
      if (sec.id === toSectorId) {
        return {
          ...sec,
          crowdDensity: Math.min(72, sec.crowdDensity + 25),
          passengerCount: sec.passengerCount + 180
        };
      }
      return sec;
    }));

    // Station Health boost
    setStationHealth(prev => ({
      ...prev,
      overallScore: Math.min(96, prev.overallScore + 8),
      crowdHealth: Math.min(95, prev.crowdHealth + 12)
    }));

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setEvents(prev => [
      { id: `EVT-${Date.now()}`, time: timeStr, type: 'AI_ACTION', message: `AI crowd diversion executed from ${fromSectorId} to ${toSectorId} (-35% density)` },
      ...prev.slice(0, 7)
    ]);
  };

  // Handlers for Fleet mode
  const handleSelectTrain = (train: Train) => setSelectedTrain(train);
  const handleOpenDetails = (train: Train) => {
    setSelectedTrain(train);
    setDrawerTrain(train);
  };
  const handleSimulateFix = (train: Train) => {
    setSelectedTrain(train);
    setActiveTab('sandbox');
  };

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
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const unresolvedAlertsCount = alerts.filter(a => !a.resolved).length;

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
        
        {/* Top Navbar */}
        <Navbar
          primaryView={primaryView}
          setPrimaryView={setPrimaryView}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          simSpeed={simSpeed}
          setSimSpeed={setSimSpeed}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          unresolvedAlertsCount={unresolvedAlertsCount}
        />

        {/* PRIMARY VIEW 1: STATION COMMAND COCKPIT */}
        {primaryView === 'STATION_COMMAND' && (
          <StationCommandCockpit
            sectors={sectors}
            incidents={incidents}
            health={stationHealth}
            events={events}
            onResolveWithOtp={handleResolveWithOtp}
            onTriggerCrowdDivert={handleTriggerCrowdDivert}
          />
        )}

        {/* PRIMARY VIEW 2: NATIONAL CORRIDOR FLEET TRACKING */}
        {primaryView === 'NATIONAL_FLEET' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <TopKpiMetrics
              trains={trains}
              activeAlertsCount={unresolvedAlertsCount}
            />

            <main className="flex-1 relative overflow-hidden">
              {activeTab === 'map' && (
                <div className="w-full h-full flex flex-col md:flex-row">
                  <div className="w-full md:w-[420px] lg:w-[460px] h-1/2 md:h-full z-10">
                    <TrainListPanel
                      trains={trains}
                      selectedTrain={selectedTrain}
                      onSelectTrain={handleSelectTrain}
                      onOpenDetails={handleOpenDetails}
                      onSimulateFix={handleSimulateFix}
                    />
                  </div>
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

              {activeTab === 'analytics' && (
                <div className="w-full h-full overflow-y-auto">
                  <DelayPredictionEngine trains={trains} />
                </div>
              )}

              {activeTab === 'sandbox' && (
                <div className="w-full h-full overflow-y-auto">
                  <DecisionSupportSandbox
                    trains={trains}
                    onApplyScenarioToLiveState={handleApplyScenarioToLiveState}
                  />
                </div>
              )}

              {activeTab === 'heatmap' && (
                <div className="w-full h-full overflow-y-auto">
                  <CongestionHeatmap />
                </div>
              )}

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

              <TrainDetailDrawer
                train={drawerTrain}
                onClose={() => setDrawerTrain(null)}
                onSimulateFix={handleSimulateFix}
              />
            </main>
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
};

export default App;
