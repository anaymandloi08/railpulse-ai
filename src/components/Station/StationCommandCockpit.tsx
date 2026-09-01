import React, { useState } from 'react';
import { StationSector, StationIncident, LiveActivityEvent, StationHealthData, MapDisplayMode } from '../../types/stationCommand';
import { Train } from '../../types/railway';
import { StationCommandHeader } from './StationCommandHeader';
import { InteractiveStationMap } from './InteractiveStationMap';
import { PriorityActionPanel } from './PriorityActionPanel';
import { LiveActivityTicker } from './LiveActivityTicker';
import { IncidentOtpModal } from './IncidentOtpModal';
import { StationSectorDrawer } from './StationSectorDrawer';

interface StationCommandCockpitProps {
  sectors: StationSector[];
  incidents: StationIncident[];
  trains: Train[];
  health: StationHealthData;
  events: LiveActivityEvent[];
  onResolveWithOtp: (incidentId: string) => void;
  onTriggerCrowdDivert: (fromSectorId: string, toSectorId: string) => void;
}

export const StationCommandCockpit: React.FC<StationCommandCockpitProps> = ({
  sectors,
  incidents,
  trains,
  health,
  events,
  onResolveWithOtp,
  onTriggerCrowdDivert
}) => {
  const [selectedStation, setSelectedStation] = useState<string>('Indore Junction (INDB)');
  const [mapMode, setMapMode] = useState<MapDisplayMode>('CROWD');
  const [selectedSector, setSelectedSector] = useState<StationSector | null>(null);
  const [selectedIncidentForOtp, setSelectedIncidentForOtp] = useState<StationIncident | null>(null);

  const criticalAlertsCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 relative overflow-hidden">
      
      {/* 1. Top Bar: 4 Clean KPIs + Station Selector */}
      <StationCommandHeader
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
        criticalAlertsCount={criticalAlertsCount}
        avgDelayMinutes={8}
        crowdLevelPct={health.crowdHealth}
        activeTrainsCount={24}
      />

      {/* 2. Visual Hierarchy: 55-60% Map on Left + Priority/Prediction on Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Main Station Map (Hero) */}
        <InteractiveStationMap
          sectors={sectors}
          incidents={incidents}
          selectedSector={selectedSector}
          onSelectSector={(sec) => setSelectedSector(sec)}
          mapMode={mapMode}
          setMapMode={setMapMode}
          onOpenIncidentModal={(inc) => setSelectedIncidentForOtp(inc)}
          onTriggerCrowdDivert={onTriggerCrowdDivert}
        />

        {/* Right Flank: Priority Alerts Queue + Delay Prediction Card + AI Insight Box */}
        <PriorityActionPanel
          sectors={sectors}
          incidents={incidents}
          trains={trains}
          onOpenIncidentModal={(inc) => setSelectedIncidentForOtp(inc)}
          onSelectSector={(sec) => setSelectedSector(sec)}
          onTriggerCrowdDivert={onTriggerCrowdDivert}
        />

      </div>

      {/* 3. Bottom Live Activity Timeline (Clickable to focus map) */}
      <LiveActivityTicker 
        events={events} 
        sectors={sectors}
        onSelectSector={(sec) => setSelectedSector(sec)}
      />

      {/* OTP Verification Modal */}
      <IncidentOtpModal
        incident={selectedIncidentForOtp}
        onClose={() => setSelectedIncidentForOtp(null)}
        onResolveWithOtp={onResolveWithOtp}
      />

      {/* Contextual Sector Inspector Drawer */}
      <StationSectorDrawer
        sector={selectedSector}
        onClose={() => setSelectedSector(null)}
        onOpenIncidentModal={(inc) => setSelectedIncidentForOtp(inc)}
        incidents={incidents}
        onTriggerCrowdDivert={onTriggerCrowdDivert}
      />

    </div>
  );
};
