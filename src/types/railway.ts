// Railway System Types for RailPulse AI

export type TrainCategory = 'VANDE_BHARAT' | 'RAJDHANI' | 'SHATABDI' | 'SUPERFAST' | 'EXPRESS' | 'FREIGHT';

export type TrainStatus = 'ON_TIME' | 'SLIGHT_DELAY' | 'HEAVY_DELAY' | 'STOPPED' | 'DIVERTED';

export type DelayRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  platforms: number;
  occupiedPlatforms: number;
  congestionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  zone: string;
  state: string;
}

export interface Corridor {
  id: string;
  name: string;
  code: string;
  color: string;
  waypoints: [number, number][];
  congestion: 'CLEAR' | 'MODERATE' | 'CONGESTED';
  densityScore: number; // 0 - 100
}

export interface TrainStop {
  stationCode: string;
  stationName: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival?: string;
  actualDeparture?: string;
  predictedArrival?: string;
  platform: number;
  dwellMinutes: number;
  status: 'PASSED' | 'CURRENT' | 'UPCOMING';
  delayAtStop: number;
}

export interface AIDelayFactor {
  factor: string;
  impactMinutes: number;
  percentage: number;
  description: string;
}

export interface AIInsights {
  primaryCause: string;
  confidence: number;
  bottleneckStation: string;
  breakdown: AIDelayFactor[];
  suggestedAction: string;
  projectedRecoveryMinutes: number;
  riskScore: number; // 0 to 10
}

export interface Train {
  id: string;
  number: string;
  name: string;
  category: TrainCategory;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  currentStation: string;
  nextStation: string;
  scheduledETA: string;
  aiPredictedETA: string;
  delayMinutes: number;
  delayProbability: number;
  delayRisk: DelayRiskLevel;
  speed: number;
  maxSpeed: number;
  currentLat: number;
  currentLng: number;
  heading: number;
  corridorId: string;
  progress: number; // 0 to 100%
  status: TrainStatus;
  routeStops: TrainStop[];
  fullRouteCoordinates: [number, number][];
  aiInsights: AIInsights;
}

export interface Alert {
  id: string;
  trainNumber: string;
  trainName: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  stationCode?: string;
  actionRequired: string;
  resolved: boolean;
  autoMitigation: string;
}

export interface DispatchScenario {
  id: string;
  title: string;
  description: string;
  impactDelay: number;
  affectedTrainNumbers: string[];
  applied: boolean;
  category: 'PRECEDENCE' | 'REROUTE' | 'PLATFORM' | 'SPEED_PROFILE';
}

export interface NetworkKPIs {
  totalActiveTrains: number;
  onTimePercentage: number;
  severeDelaysCount: number;
  networkCongestionIndex: number;
  activeAlertsCount: number;
  avgNetworkDelay: number;
  aiPredictionAccuracy: number;
}
