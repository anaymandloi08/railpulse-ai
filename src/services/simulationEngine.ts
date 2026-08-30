import { Train } from '../types/railway';

// Helper: Calculate distance between two coordinates in km (Haversine formula)
export function getCoordinatesDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Calculate bearing angle in degrees
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const y = Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Interpolate position along polyline based on progress percentage (0 - 100)
export function getPositionAlongPolyline(
  waypoints: [number, number][],
  progressPct: number
): { lat: number; lng: number; heading: number } {
  if (!waypoints || waypoints.length === 0) {
    return { lat: 28.6143, lng: 77.2188, heading: 0 };
  }
  if (waypoints.length === 1 || progressPct <= 0) {
    const nextPt = waypoints[1] || waypoints[0];
    return {
      lat: waypoints[0][0],
      lng: waypoints[0][1],
      heading: calculateBearing(waypoints[0][0], waypoints[0][1], nextPt[0], nextPt[1])
    };
  }
  if (progressPct >= 100) {
    const last = waypoints[waypoints.length - 1];
    const prev = waypoints[waypoints.length - 2] || last;
    return {
      lat: last[0],
      lng: last[1],
      heading: calculateBearing(prev[0], prev[1], last[0], last[1])
    };
  }

  // Calculate cumulative distances
  const distances: number[] = [0];
  let totalDist = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const d = getCoordinatesDistance(
      waypoints[i][0],
      waypoints[i][1],
      waypoints[i + 1][0],
      waypoints[i + 1][1]
    );
    totalDist += d;
    distances.push(totalDist);
  }

  const targetDist = (progressPct / 100) * totalDist;

  // Find segment
  for (let i = 0; i < distances.length - 1; i++) {
    if (targetDist >= distances[i] && targetDist <= distances[i + 1]) {
      const segmentDist = distances[i + 1] - distances[i];
      const segmentProgress = segmentDist > 0 ? (targetDist - distances[i]) / segmentDist : 0;
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
      const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;
      const heading = calculateBearing(p1[0], p1[1], p2[0], p2[1]);
      return { lat, lng, heading };
    }
  }

  const last = waypoints[waypoints.length - 1];
  return { lat: last[0], lng: last[1], heading: 0 };
}

// Step advance trains for live animation
export function advanceSimulationStep(trains: Train[], speedMultiplier: number): Train[] {
  if (speedMultiplier <= 0) return trains;

  return trains.map(train => {
    // Advance progress smoothly (e.g. 0.08% per tick at 1x)
    const speedFactor = (train.speed / 120) * 0.08 * speedMultiplier;
    let newProgress = train.progress + speedFactor;
    if (newProgress > 98) {
      newProgress = 12; // Loop back for continuous demo
    }

    const { lat, lng, heading } = getPositionAlongPolyline(
      train.fullRouteCoordinates,
      newProgress
    );

    // Slight realistic speed variation (+/- 2 km/h)
    const speedJitter = (Math.random() - 0.5) * 1.5;
    const newSpeed = Math.max(45, Math.min(train.maxSpeed, Math.round(train.speed + speedJitter)));

    return {
      ...train,
      progress: newProgress,
      currentLat: lat,
      currentLng: lng,
      heading: Math.round(heading),
      speed: newSpeed
    };
  });
}
