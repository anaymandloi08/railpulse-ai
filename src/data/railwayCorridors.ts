import { Corridor } from '../types/railway';

export const RAILWAY_CORRIDORS: Corridor[] = [
  {
    id: 'CORR_DEL_BOM',
    name: 'Delhi – Mumbai Golden Corridor',
    code: 'NDLS-MMCT',
    color: '#3b82f6', // Blue
    congestion: 'CONGESTED',
    densityScore: 88,
    waypoints: [
      [28.6143, 77.2188], // NDLS
      [28.1400, 77.3200], // Palwal
      [27.4924, 77.6737], // Mathura Jn
      [26.8900, 77.0100], // Bharatpur
      [26.3000, 76.5400], // Gangapur City
      [25.9900, 76.3800], // Sawai Madhopur
      [25.1825, 75.8390], // Kota Jn
      [24.5300, 75.8100], // Ramganj Mandi
      [24.1600, 75.7400], // Shamgarh
      [23.4700, 75.4100], // Nagda Jn
      [23.3315, 75.0367], // Ratlam Jn
      [22.8400, 74.2500], // Dahod
      [22.7500, 73.6100], // Godhra Jn
      [22.3106, 73.1812], // Vadodara Jn
      [21.6900, 73.0100], // Bharuch Jn
      [21.2049, 72.8406], // Surat
      [20.9000, 72.9300], // Navsari
      [20.6100, 72.9300], // Valsad
      [20.3800, 72.9100], // Vapi
      [19.8200, 72.7600], // Palghar
      [19.3800, 72.8200], // Vasai Road
      [19.1800, 72.8400], // Borivali
      [18.9696, 72.8193]  // Mumbai Central
    ]
  },
  {
    id: 'CORR_DEL_HWH',
    name: 'Delhi – Howrah Main Trunk',
    code: 'NDLS-HWH',
    color: '#8b5cf6', // Purple
    congestion: 'CONGESTED',
    densityScore: 92,
    waypoints: [
      [28.6143, 77.2188], // NDLS
      [28.6700, 77.4400], // Ghaziabad
      [27.8800, 78.0700], // Aligarh
      [27.1800, 78.3900], // Tundla
      [26.7800, 79.0200], // Etawah
      [26.4539, 80.3512], // Kanpur Central
      [25.9200, 80.8100], // Fatehpur
      [25.4497, 81.8282], // Prayagraj Jn
      [25.2787, 83.1167], // Pt Deen Dayal Upadhyaya
      [25.5600, 83.9800], // Buxar
      [25.5600, 84.6600], // Ara
      [25.6022, 85.1376], // Patna Jn
      [25.2400, 85.9900], // Mokama
      [25.1300, 86.3000], // Kiul
      [24.5000, 86.8400], // Jasidih
      [23.7900, 86.4300], // Dhanbad / Asansol
      [23.5200, 87.3100], // Durgapur
      [23.2400, 87.8600], // Barddhaman
      [22.5838, 88.3426]  // Howrah Jn
    ]
  },
  {
    id: 'CORR_DEL_MAS',
    name: 'Grand Trunk Corridor (Delhi – Chennai)',
    code: 'NDLS-MAS',
    color: '#10b981', // Emerald
    congestion: 'MODERATE',
    densityScore: 74,
    waypoints: [
      [28.6143, 77.2188], // NDLS
      [27.4924, 77.6737], // Mathura
      [27.1584, 77.9904], // Agra Cantt
      [26.2167, 78.1828], // Gwalior
      [25.4484, 78.5685], // Jhansi
      [24.1800, 78.1900], // Bina
      [23.2685, 77.4126], // Bhopal
      [22.7500, 77.7200], // Itarsi
      [21.1528, 79.0888], // Nagpur
      [19.9500, 79.3000], // Chandrapur
      [18.7700, 79.5200], // Ramagundam
      [17.9700, 79.6000], // Kazipet / Warangal
      [16.5100, 80.6400], // Vijayawada
      [14.4400, 79.9800], // Nellore
      [13.0827, 80.2755]  // Chennai Central
    ]
  },
  {
    id: 'CORR_BOM_SBC',
    name: 'Mumbai – Pune – Bengaluru Corridor',
    code: 'CSMT-SBC',
    color: '#f59e0b', // Amber
    congestion: 'MODERATE',
    densityScore: 68,
    waypoints: [
      [18.9402, 72.8356], // CSMT
      [19.0400, 73.0700], // Kalyan / Panvel
      [18.7500, 73.4000], // Lonavala
      [18.5284, 73.8744], // Pune Jn
      [18.1800, 74.5800], // Daund
      [17.6800, 75.9100], // Solapur
      [17.3300, 76.8300], // Gulbarga
      [15.1500, 76.9200], // Ballari
      [14.2300, 76.4000], // Chitradurga
      [12.9781, 77.5695]  // Bengaluru
    ]
  },
  {
    id: 'CORR_DFC_WEST',
    name: 'Western Dedicated Freight Corridor (DFC)',
    code: 'DFC-WEST',
    color: '#06b6d4', // Cyan
    congestion: 'CLEAR',
    densityScore: 52,
    waypoints: [
      [28.5400, 77.5500], // Dadri DFC
      [28.2000, 76.6200], // Rewari
      [27.6000, 75.8000], // Phulera
      [25.8000, 73.8000], // Marwar
      [24.2000, 72.4000], // Palanpur
      [23.1000, 72.2000], // Sanand
      [22.3106, 73.1812], // Vadodara
      [21.2049, 72.8406], // Surat
      [18.9500, 72.9500]  // JNPT Mumbai
    ]
  }
];
