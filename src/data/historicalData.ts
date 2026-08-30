export interface DelayTrendPoint {
  station: string;
  scheduledDwell: number;
  actualDwell: number;
  cumulativeDelay: number;
  predictedDelay: number;
}

export const TRAIN_12951_DELAY_SERIES: DelayTrendPoint[] = [
  { station: 'MMCT (Mumbai)', scheduledDwell: 0, actualDwell: 0, cumulativeDelay: 0, predictedDelay: 0 },
  { station: 'ST (Surat)', scheduledDwell: 5, actualDwell: 6, cumulativeDelay: 6, predictedDelay: 5 },
  { station: 'BRC (Vadodara)', scheduledDwell: 10, actualDwell: 14, cumulativeDelay: 14, predictedDelay: 13 },
  { station: 'RTM (Ratlam)', scheduledDwell: 3, actualDwell: 12, cumulativeDelay: 26, predictedDelay: 25 },
  { station: 'KOTA (Kota)', scheduledDwell: 5, actualDwell: 11, cumulativeDelay: 29, predictedDelay: 29 },
  { station: 'SWM (Sawai Madhopur)', scheduledDwell: 2, actualDwell: 4, cumulativeDelay: 28, predictedDelay: 27 },
  { station: 'MTJ (Mathura)', scheduledDwell: 2, actualDwell: 3, cumulativeDelay: 25, predictedDelay: 24 },
  { station: 'NDLS (Delhi)', scheduledDwell: 0, actualDwell: 0, cumulativeDelay: 29, predictedDelay: 29 }
];

export const CORRIDOR_BOTTLENECK_DATA = [
  { junction: 'Kota Jn (KOTA)', congestionScore: 92, avgDelayMin: 28.4, activeTrains: 14, risk: 'HIGH' },
  { junction: 'Pt Deen Dayal Upadhyaya (DDU)', congestionScore: 95, avgDelayMin: 34.2, activeTrains: 18, risk: 'CRITICAL' },
  { junction: 'Kanpur Central (CNB)', congestionScore: 89, avgDelayMin: 22.1, activeTrains: 16, risk: 'HIGH' },
  { junction: 'Ratlam Jn (RTM)', congestionScore: 84, avgDelayMin: 19.5, activeTrains: 11, risk: 'HIGH' },
  { junction: 'Mathura Jn (MTJ)', congestionScore: 78, avgDelayMin: 14.8, activeTrains: 13, risk: 'MEDIUM' },
  { junction: 'Itarsi Jn (ET)', congestionScore: 75, avgDelayMin: 16.2, activeTrains: 9, risk: 'MEDIUM' },
  { junction: 'Vadodara Jn (BRC)', congestionScore: 68, avgDelayMin: 9.4, activeTrains: 12, risk: 'LOW' },
  { junction: 'Surat (ST)', congestionScore: 71, avgDelayMin: 11.2, activeTrains: 10, risk: 'MEDIUM' }
];

export const CATEGORY_DELAY_DISTRIBUTION = [
  { category: 'Vande Bharat', onTimePct: 94.2, avgDelayMin: 3.8, count: 12, fill: '#10b981' },
  { category: 'Rajdhani / Shatabdi', onTimePct: 82.5, avgDelayMin: 16.4, count: 18, fill: '#3b82f6' },
  { category: 'Superfast Express', onTimePct: 71.8, avgDelayMin: 28.5, count: 32, fill: '#f59e0b' },
  { category: 'Mail / Express', onTimePct: 62.1, avgDelayMin: 44.2, count: 24, fill: '#ef4444' },
  { category: 'Freight (DFC/Main)', onTimePct: 48.6, avgDelayMin: 68.0, count: 20, fill: '#64748b' }
];

export const HOURLY_NETWORK_DELAY_TREND = [
  { hour: '00:00', avgDelay: 12, congestedSections: 3, trainsActive: 28 },
  { hour: '03:00', avgDelay: 9, congestedSections: 2, trainsActive: 22 },
  { hour: '06:00', avgDelay: 18, congestedSections: 6, trainsActive: 44 },
  { hour: '09:00', avgDelay: 29, congestedSections: 11, trainsActive: 58 },
  { hour: '12:00', avgDelay: 24, congestedSections: 8, trainsActive: 51 },
  { hour: '15:00', avgDelay: 22, congestedSections: 7, trainsActive: 49 },
  { hour: '18:00', avgDelay: 35, congestedSections: 14, trainsActive: 64 },
  { hour: '21:00', avgDelay: 31, congestedSections: 12, trainsActive: 56 }
];

export const AI_PREDICTION_ACCURACY_POINTS = [
  { trainNo: '12951', actual: 29, predicted: 28.8, error: -0.2, confidence: 91 },
  { trainNo: '22436', actual: 4, predicted: 4.1, error: 0.1, confidence: 96 },
  { trainNo: '12301', actual: 42, predicted: 40.5, error: -1.5, confidence: 94 },
  { trainNo: '12002', actual: 12, predicted: 12.6, error: 0.6, confidence: 88 },
  { trainNo: '12626', actual: 35, predicted: 36.2, error: 1.2, confidence: 89 },
  { trainNo: '20901', actual: 0, predicted: 0.2, error: 0.2, confidence: 98 },
  { trainNo: '12952', actual: 8, predicted: 7.6, error: -0.4, confidence: 92 },
  { trainNo: '12138', actual: 64, predicted: 62.4, error: -1.6, confidence: 94 }
];
