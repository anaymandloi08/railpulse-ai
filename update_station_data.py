station_data_code = """import { StationSector, StationIncident, LiveActivityEvent, StationHealthData } from '../types/stationCommand';

export const INITIAL_STATION_HEALTH: StationHealthData = {
  overallScore: 78,
  crowdHealth: 82,
  safetyIndex: 91,
  incidentResolution: 74,
  operationsEfficiency: 86
};

// Mathematically consistent passenger count & capacity data
export const INITIAL_SECTORS: StationSector[] = [
  {
    id: 'FOB-NORTH',
    platformNumber: 'F1',
    name: 'North Foot Overbridge (FOB-1)',
    zoneType: 'FOOTBRIDGE',
    crowdDensity: 85,
    passengerCount: 340,
    capacity: 400,
    status: 'CRITICAL',
    activeIncidentsCount: 0,
    aiRecommendation: 'High footfall on stairs. Enforce one-way passenger flow from Platform 2.'
  },
  {
    id: 'P1-A',
    platformNumber: '1',
    name: 'Platform 1',
    zoneType: 'PLATFORM',
    crowdDensity: 38,
    passengerCount: 247,
    capacity: 650,
    status: 'NORMAL',
    activeIncidentsCount: 1,
    aiRecommendation: 'Platform 1 is operating with ample spare capacity.',
    trainDocked: {
      trainNumber: '22436',
      trainName: 'Vande Bharat Express',
      dwellRemaining: '3 min',
      status: 'ON_TIME'
    }
  },
  {
    id: 'P2-A',
    platformNumber: '2',
    name: 'Platform 2',
    zoneType: 'PLATFORM',
    crowdDensity: 87,
    passengerCount: 565,
    capacity: 650,
    status: 'CRITICAL',
    activeIncidentsCount: 1,
    aiRecommendation: 'Critical crowd surge! Redirect inbound passengers to Platform 3.',
    trainDocked: {
      trainNumber: '12951',
      trainName: 'Mumbai Rajdhani Express',
      dwellRemaining: '6 min',
      status: 'DELAYED (+29m)'
    }
  },
  {
    id: 'CONCOURSE-MAIN',
    platformNumber: 'C',
    name: 'Central Hub & Booking Hall',
    zoneType: 'CONCOURSE',
    crowdDensity: 74,
    passengerCount: 888,
    capacity: 1200,
    status: 'WARNING',
    activeIncidentsCount: 1,
    aiRecommendation: 'Concourse density elevated. Auxiliary UTS counters 5-8 active.'
  },
  {
    id: 'P3-A',
    platformNumber: '3',
    name: 'Platform 3',
    zoneType: 'PLATFORM',
    crowdDensity: 36,
    passengerCount: 216,
    capacity: 600,
    status: 'NORMAL',
    activeIncidentsCount: 0,
    aiRecommendation: 'Ample capacity available for crowd diversion from Platform 2.',
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
    name: 'Platform 4',
    zoneType: 'PLATFORM',
    crowdDensity: 61,
    passengerCount: 366,
    capacity: 600,
    status: 'WARNING',
    activeIncidentsCount: 1,
    aiRecommendation: 'Platform 4 density rising ahead of inbound Malwa Express.'
  }
];

// Clean, grouped non-duplicate incident list
export const INITIAL_STATION_INCIDENTS: StationIncident[] = [
  {
    id: 'INC-1045',
    ticketCode: '#RP-1045',
    title: 'Platform 2: Critical Crowd Surge (87% Capacity)',
    category: 'CROWD_SURGE',
    severity: 'CRITICAL',
    location: 'Platform 2 · Main Boarding Area',
    sectorId: 'P2-A',
    reportedTime: '2 min ago',
    reportedBy: 'Automated CCTV AI Density Monitor',
    assignedOfficer: {
      name: 'Sub-Inspector Anjali Sharma',
      badge: 'RPF-208',
      phone: '+91 98260 67890',
      role: 'Crowd Marshal Lead'
    },
    status: 'IN_PROGRESS',
    verificationOtp: '7193',
    passengerPhone: 'CCTV AI Camera 04',
    description: 'Inbound delayed Rajdhani passenger load creating bottleneck at platform stairs.',
    aiMitigation: 'Execute crowd diversion to Platform 3 via North FOB.',
    progressStep: 3
  },
  {
    id: 'INC-1042',
    ticketCode: '#RP-1042',
    title: 'Platform 1: Baggage Obstruction Near Escalator',
    category: 'SAFETY',
    severity: 'CRITICAL',
    location: 'Platform 1 · Sector B Stairs',
    sectorId: 'P1-A',
    reportedTime: '5 min ago',
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
    description: 'Unattended parcels dumped near escalator entry causing passenger obstruction.',
    aiMitigation: 'Clear walkway and complete passenger OTP verification.',
    progressStep: 4
  },
  {
    id: 'INC-1048',
    ticketCode: '#RP-1048',
    title: 'Central Hub: Passenger Medical Assistance',
    category: 'MEDICAL',
    severity: 'WARNING',
    location: 'Central Concourse · UTS Counter 4',
    sectorId: 'CONCOURSE-MAIN',
    reportedTime: '12 min ago',
    reportedBy: 'Helpdesk Staff',
    assignedOfficer: {
      name: 'Dr. V. Mehra',
      badge: 'MED-09',
      phone: '+91 98260 99881',
      role: 'Railway Emergency Medical Team'
    },
    status: 'IN_PROGRESS',
    verificationOtp: '3310',
    passengerPhone: '+91 91234 56789',
    description: 'Wheelchair assistance required for elderly passenger.',
    aiMitigation: 'Medical attendant on site with first-aid kit.',
    progressStep: 3
  }
];

export const INITIAL_LIVE_EVENTS: LiveActivityEvent[] = [
  { id: 'EVT-1', time: '19:42', type: 'CRITICAL', message: 'Platform 2 reached critical crowd capacity (87%)' },
  { id: 'EVT-2', time: '19:40', type: 'AI_ACTION', message: 'AI recommended crowd diversion to Platform 3' },
  { id: 'EVT-3', time: '19:38', type: 'WARNING', message: 'Passenger reported baggage obstruction on Platform 1' },
  { id: 'EVT-4', time: '19:35', type: 'OFFICER', message: 'RPF Officer Kumar assigned to Platform 1 safety ticket' },
  { id: 'EVT-5', time: '19:31', type: 'NORMAL', message: 'Platform 4 returned to normal occupancy (61%)' }
];
"""

with open("src/data/mockStationData.ts", "w", encoding="utf-8") as f:
    f.write(station_data_code)
print("mockStationData.ts updated with consistent math and non-duplicate alerts")
