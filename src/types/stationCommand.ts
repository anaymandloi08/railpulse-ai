export type ZoneType = 'PLATFORM' | 'CONCOURSE' | 'FOOTBRIDGE' | 'ENTRY_GATE' | 'WAITING_HALL';
export type SectorStatus = 'NORMAL' | 'WARNING' | 'CRITICAL';
export type IncidentSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type IncidentCategory = 'SAFETY' | 'CLEANLINESS' | 'MEDICAL' | 'SECURITY' | 'CROWD_SURGE';
export type IncidentStatus = 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'AWAITING_OTP' | 'RESOLVED';
export type MapDisplayMode = 'CROWD' | 'INCIDENTS' | 'OPERATIONS';

export interface StationSector {
  id: string;
  platformNumber: string;
  name: string;
  zoneType: ZoneType;
  crowdDensity: number; // percentage 0 - 100
  passengerCount: number;
  capacity: number;
  status: SectorStatus;
  activeIncidentsCount: number;
  aiRecommendation: string;
  trainDocked?: {
    trainNumber: string;
    trainName: string;
    dwellRemaining: string;
    status: string;
  };
}

export interface IncidentOfficer {
  name: string;
  badge: string;
  phone: string;
  role: string;
}

export interface StationIncident {
  id: string;
  ticketCode: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  location: string;
  sectorId: string;
  reportedTime: string;
  reportedBy: string;
  assignedOfficer: IncidentOfficer;
  status: IncidentStatus;
  verificationOtp: string;
  passengerPhone: string;
  description: string;
  aiMitigation: string;
  progressStep: number; // 1 to 5
}

export interface StationHealthData {
  overallScore: number;
  crowdHealth: number;
  safetyIndex: number;
  incidentResolution: number;
  operationsEfficiency: number;
}

export interface LiveActivityEvent {
  id: string;
  time: string;
  type: 'CRITICAL' | 'WARNING' | 'AI_ACTION' | 'OFFICER' | 'NORMAL';
  message: string;
}
