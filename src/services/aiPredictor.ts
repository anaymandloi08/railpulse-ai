import { Train, DispatchScenario } from '../types/railway';

export interface SimulationOutcome {
  scenarioId: string;
  title: string;
  originalETA: string;
  newETA: string;
  delayBefore: number;
  delayAfter: number;
  delaySaved: number;
  confidenceScore: number;
  networkImpact: string;
  explanation: string;
}

export const AVAILABLE_DISPATCH_SCENARIOS: DispatchScenario[] = [
  {
    id: 'SCENARIO_HOLD_FREIGHT',
    title: 'Hold Freight 70412 at Ramganj Mandi Loop-2',
    description: 'Direct Freight 70412 to wait 6 minutes at loop siding, giving 12951 Rajdhani uninterrupted high-speed block clearance.',
    impactDelay: -18,
    affectedTrainNumbers: ['12951', '70412'],
    applied: false,
    category: 'PRECEDENCE'
  },
  {
    id: 'SCENARIO_PLATFORM_SWAP_RTM',
    title: 'Platform Pre-Allocation at Kota Jn (PF-1 -> PF-3)',
    description: 'Switch arriving platform to clear throat interlocking and avoid waiting outside outer home signal.',
    impactDelay: -7,
    affectedTrainNumbers: ['12951'],
    applied: false,
    category: 'PLATFORM'
  },
  {
    id: 'SCENARIO_SPEED_RECOVERY_MPS',
    title: 'Dynamic Speed Recovery Authorization (MPS 130 km/h)',
    description: 'Temporarily authorize notch-9 maximum permissible speed on straight section between Kota and Sawai Madhopur.',
    impactDelay: -9,
    affectedTrainNumbers: ['12951', '12952'],
    applied: false,
    category: 'SPEED_PROFILE'
  },
  {
    id: 'SCENARIO_DDU_FLYOVER_BYPASS',
    title: 'Route 12301 via DDU East Flyover Bypass Line 3',
    description: 'Bypass congested Mughalsarai yard interlocking by taking the chord line flyover directly to Mirzapur track.',
    impactDelay: -21,
    affectedTrainNumbers: ['12301'],
    applied: false,
    category: 'REROUTE'
  }
];

export function calculateSimulatedOutcome(train: Train, scenarioIds: string[]): SimulationOutcome {
  let totalDelaySaved = 0;
  const appliedTitles: string[] = [];

  AVAILABLE_DISPATCH_SCENARIOS.forEach(sc => {
    if (scenarioIds.includes(sc.id) && sc.affectedTrainNumbers.includes(train.number)) {
      totalDelaySaved += Math.abs(sc.impactDelay);
      appliedTitles.push(sc.title);
    }
  });

  const originalDelay = train.delayMinutes;
  const newDelay = Math.max(0, originalDelay - totalDelaySaved);
  
  // Calculate new ETA time string
  const [hStr, mStr] = train.aiPredictedETA.split(':').map(Number);
  let totalMinutes = hStr * 60 + mStr - totalDelaySaved;
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  const newETAStr = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;

  return {
    scenarioId: scenarioIds.join('+'),
    title: appliedTitles.length > 0 ? appliedTitles.join(' + ') : 'Baseline Operation',
    originalETA: train.aiPredictedETA,
    newETA: newETAStr,
    delayBefore: originalDelay,
    delayAfter: newDelay,
    delaySaved: totalDelaySaved,
    confidenceScore: Math.min(99, train.aiInsights.confidence + (appliedTitles.length > 0 ? 3 : 0)),
    networkImpact: totalDelaySaved > 15 ? 'OPTIMAL' : totalDelaySaved > 5 ? 'MODERATE' : 'NEUTRAL',
    explanation: appliedTitles.length > 0 
      ? `Applied ${appliedTitles.length} dispatch intervention(s). Line cleared through automatic signal sequencing. Net delay reduced from +${originalDelay}m to +${newDelay}m (Saved ${totalDelaySaved} min).`
      : 'Standard baseline operations without active dispatcher interventions.'
  };
}
