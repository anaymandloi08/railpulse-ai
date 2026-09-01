import { StationSector, StationIncident, LiveActivityEvent, StationHealthData } from '../types/stationCommand';

export const INITIAL_STATION_HEALTH: StationHealthData = {
  overallScore: 78,
  crowdHealth: 82,
  safetyIndex: 91,
  incidentResolution: 74,
  operationsEfficiency: 86
};

export const INITIAL_SECTORS: StationSector[] = [
  {
    id: 'P1-A',
    platformNumber: '1',
    name: 'Platform 1 — Sector A (North)',
    zoneType: 'PLATFORM',
    crowdDensity: 38,
    passengerCount: 220,
    capacity: 650,
    status: 'NORMAL',
    activeIncidentsCount: 0,
    aiRecommendation: 'Crowd density is optimal. Standard platform boarding protocol active.',
    trainDocked: {
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      dwellRemaining: '3 min',
      status: 'ON_TIME'
    }
  },
  {
    id: 'P1-B',
    platformNumber: '1',
    name: 'Platform 1 — Sector B (South)',
    zoneType: 'PLATFORM',
    crowdDensity: 46,
    passengerCount: 295,
    capacity: 650,
    status: 'NORMAL',
    activeIncidentsCount: 1,
    aiRecommendation: 'Clear baggage obstruction near Escalator 1 entry point.'
  },
  {
    id: 'P2-A',
    platformNumber: '2',
    name: 'Platform 2 — Sector A (North)',
    zoneType: 'PLATFORM',
    crowdDensity: 69,
    passengerCount: 448,
    capacity: 650,
    status: 'WARNING',
    activeIncidentsCount: 0,
    aiRecommendation: 'High passenger queue buildup. Activate secondary queue barriers.'
  },
  {
    id: 'P2-B',
    platformNumber: '2',
    name: 'Platform 2 — Sector B (South)',
    zoneType: 'PLATFORM',
    crowdDensity: 87,
    passengerCount: 565,
    capacity: 650,
    status: 'CRITICAL',
    activeIncidentsCount: 2,
    aiRecommendation: 'Critical crowd surge! Divert incoming passenger flow via North FOB to Platform 3.',
    trainDocked: {
      trainNumber: '12951',
      trainName: 'Mumbai Rajdhani Express',
      dwellRemaining: '6 min',
      status: 'DELAYED (+29m)'
    }
  },
  {
    id: 'P3-A',
    platformNumber: '3',
    name: 'Platform 3 — Sector A (North)',
    zoneType: 'PLATFORM',
    crowdDensity: 32,
    passengerCount: 190,
    capacity: 600,
    status: 'NORMAL',
    activeIncidentsCount: 0,
    aiRecommendation: 'Ample capacity available for crowd diversion from Platform 2.'
  },
  {
    id: 'P3-B',
    platformNumber: '3',
    name: 'Platform 3 — Sector B (South)',
    zoneType: 'PLATFORM',
    crowdDensity: 41,
    passengerCount: 245,
    capacity: 600,
    status: 'NORMAL',
    activeIncidentsCount: 0,
    aiRecommendation: 'Platform clear. Inbound passenger clearance normal.',
    trainDocked: {
      trainNumber: '12002',
      trainName: 'Bhopal Shatabdi Express',
      dwellRemaining: '12 min',
      status: 'ON_TIME'
    }
  },
  {
    id: 'P4-A',
    platformNumber: '4',
    name: 'Platform 4 — Sector A (North)',
    zoneType: 'PLATFORM',
    crowdDensity: 64,
    passengerCount: 384,
    capacity: 600,
    status: 'WARNING',
    activeIncidentsCount: 1,
    aiRecommendation: 'Crowd density increasing ahead of inbound Malwa Express.'
  },
  {
    id: 'P4-B',
    platformNumber: '4',
    name: 'Platform 4 — Sector B (South)',
    zoneType: 'PLATFORM',
    crowdDensity: 52,
    passengerCount: 312,
    capacity: 600,
    status: 'NORMAL',
    activeIncidentsCount: 0,
    aiRecommendation: 'Routine operations maintained on south concourse ramp.'
  },
  {
    id: 'CONCOURSE-MAIN',
    platformNumber: 'C',
    name: 'Main Concourse & Booking Hall',
    zoneType: 'CONCOURSE',
    crowdDensity: 74,
    passengerCount: 890,
    capacity: 1200,
    status: 'WARNING',
    activeIncidentsCount: 1,
    aiRecommendation: 'Open Auxiliary UTS counters 5-8 to relieve queue pressure.'
  },
  {
    id: 'FOB-NORTH',
    platformNumber: 'F1',
    name: 'North Foot Overbridge (FOB-1)',
    zoneType: 'FOOTBRIDGE',
    crowdDensity: 82,
    passengerCount: 330,
    capacity: 400,
    status: 'CRITICAL',
    activeIncidentsCount: 1,
    aiRecommendation: 'Implement one-way movement on FOB-1 stairs to avoid bottleneck.'
  },
  {
    id: 'FOB-SOUTH',
    platformNumber: 'F2',
    name: 'South Foot Overbridge (FOB-2)',
    zoneType: 'FOOTBRIDGE',
    crowdDensity: 38,
    passengerCount: 152,
    capacity: 400,
    status: 'NORMAL',
    activeIncidentsCount: 0,
    aiRecommendation: 'Direct passengers exiting from P1/P2 toward South FOB.'
  },
  {
    id: 'GATE-1',
    platformNumber: 'G1',
    name: 'Main Station Portico Gate 1',
    zoneType: 'ENTRY_GATE',
    crowdDensity: 58,
    passengerCount: 350,
    capacity: 600,
    status: 'NORMAL',
    activeIncidentsCount: 0,
    aiRecommendation: 'Baggage scanner lines moving at 42 pax/min.'
  }
];

export const INITIAL_STATION_INCIDENTS: StationIncident[] = [
  {
    id: 'INC-1042',
    ticketCode: '#RP-1042',
    title: 'Safety Hazard: Heavy Baggage Obstruction Near Staircase',
    category: 'SAFETY',
    severity: 'CRITICAL',
    location: 'Platform 1 · Sector B (Escalator Base)',
    sectorId: 'P1-B',
    reportedTime: '4 min ago',
    reportedBy: 'Passenger (P-8821) via RailMadad QR',
    assignedOfficer: {
      name: 'Inspector Rajesh Kumar',
      badge: 'RPF-412',
      phone: '+91 98260 12345',
      role: 'RPF Station Duty Officer'
    },
    status: 'AWAITING_OTP',
    verificationOtp: '4829',
    passengerPhone: '+91 98765 43210',
    description: 'Commercial parcel cartons dumped near escalator entrance obstructing passenger movement for arriving Vande Bharat.',
    aiMitigation: 'Direct RPF Officer Kumar to clear passage and verify resolution with Passenger OTP.',
    progressStep: 4
  },
  {
    id: 'INC-1045',
    ticketCode: '#RP-1045',
    title: 'Critical Crowd Surge at Platform 2 Sector B (87% Density)',
    category: 'CROWD_SURGE',
    severity: 'CRITICAL',
    location: 'Platform 2 · Sector B (Coach S3-S7 area)',
    sectorId: 'P2-B',
    reportedTime: '8 min ago',
    reportedBy: 'Automated AI CCTV Density Monitor (Cam-04)',
    assignedOfficer: {
      name: 'Sub-Inspector Anjali Sharma',
      badge: 'RPF-208',
      phone: '+91 98260 67890',
      role: 'Crowd Management Lead'
    },
    status: 'IN_PROGRESS',
    verificationOtp: '7193',
    passengerPhone: 'Automated CCTV Sensor',
    description: 'Simultaneous arrival of delayed Rajdhani and boarding passengers created acute platform bottleneck.',
    aiMitigation: 'Deploy 2 RPF personnel to channel crowd towards North FOB and announce alternate exit.',
    progressStep: 3
  },
  {
    id: 'INC-1048',
    ticketCode: '#RP-1048',
    title: 'Medical Assistance Required: Elderly Passenger Feeling Dizzy',
    category: 'MEDICAL',
    severity: 'WARNING',
    location: 'Main Concourse · Near UTS Counter 4',
    sectorId: 'CONCOURSE-MAIN',
    reportedTime: '14 min ago',
    reportedBy: 'Station Master Sahay via Help Desk',
    assignedOfficer: {
      name: 'Dr. V. Mehra / Staff Nurse Sunita',
      badge: 'MED-09',
      phone: '+91 98260 99881',
      role: 'Railway Emergency Medical Unit'
    },
    status: 'IN_PROGRESS',
    verificationOtp: '3310',
    passengerPhone: '+91 91234 56789',
    description: 'Elderly passenger requires blood pressure check and wheelchair assistance to Platform 3.',
    aiMitigation: 'Wheelchair team dispatched from First Aid post. Water and medical kit provided.',
    progressStep: 3
  },
  {
    id: 'INC-1051',
    ticketCode: '#RP-1051',
    title: 'Cleanliness Required: Spill on Platform 4 Track Edge',
    category: 'CLEANLINESS',
    severity: 'INFO',
    location: 'Platform 4 · Sector A',
    sectorId: 'P4-A',
    reportedTime: '22 min ago',
    reportedBy: 'Coach Attendant (Train 12952)',
    assignedOfficer: {
      name: 'Supervisor Mohan Lal',
      badge: 'SAN-104',
      phone: '+91 98260 33445',
      role: 'Sanitation Lead'
    },
    status: 'ASSIGNED',
    verificationOtp: '8520',
    passengerPhone: '+91 99887 66554',
    description: 'Beverage spillage near water booth creating slip hazard.',
    aiMitigation: 'Sanitation team notified with mop machine.',
    progressStep: 2
  }
];

export const INITIAL_LIVE_EVENTS: LiveActivityEvent[] = [
  { id: 'EVT-1', time: '19:42', type: 'CRITICAL', message: 'Platform 2 Sector B reached critical density (87%)' },
  { id: 'EVT-2', time: '19:40', type: 'AI_ACTION', message: 'AI recommended crowd diversion to Platform 3 via North FOB' },
  { id: 'EVT-3', time: '19:38', type: 'WARNING', message: 'Passenger reported baggage obstruction on Platform 1 stairs' },
  { id: 'EVT-4', time: '19:35', type: 'OFFICER', message: 'RPF Officer Kumar dispatched to incident #RP-1042' },
  { id: 'EVT-5', time: '19:31', type: 'NORMAL', message: 'Platform 4 Sector B returned to normal density (52%)' },
  { id: 'EVT-6', time: '19:26', type: 'NORMAL', message: 'Train 22436 Vande Bharat docked at Platform 1 (PF-1)' }
];
