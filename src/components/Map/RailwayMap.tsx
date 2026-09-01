import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Train } from '../../types/railway';
import { RAILWAY_STATIONS } from '../../data/railwayStations';
import { RAILWAY_CORRIDORS } from '../../data/railwayCorridors';

interface RailwayMapProps {
  trains: Train[];
  selectedTrain: Train | null;
  onSelectTrain: (train: Train) => void;
  onOpenDetails: (train: Train) => void;
}

export const RailwayMap: React.FC<RailwayMapProps> = ({
  trains,
  selectedTrain,
  onSelectTrain,
  onOpenDetails
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const selectedRoutePolylineRef = useRef<L.Polyline | null>(null);

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [22.9734, 78.6569],
      zoom: 5.4,
      minZoom: 4,
      maxZoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    // Watermark-Free High Contrast Dark Map Tiles (ArcGIS Dark Gray)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Esri, DeLorme, NAVTEQ'
    }).addTo(map);

    // Draw Corridors
    RAILWAY_CORRIDORS.forEach(corridor => {
      // Glow line
      L.polyline(corridor.waypoints, {
        color: corridor.color,
        weight: 6,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // High contrast track
      const track = L.polyline(corridor.waypoints, {
        color: corridor.congestion === 'CONGESTED' ? '#f43f5e' : corridor.color,
        weight: 3,
        opacity: 0.85,
        dashArray: corridor.congestion === 'CONGESTED' ? '6, 6' : undefined
      }).addTo(map);

      track.bindTooltip(
        `<div style="font-size: 11px; font-weight: bold; color: #fff;">
          ${corridor.name} (${corridor.code})
          <div style="font-size: 10px; color: #94a3b8; font-weight: normal;">
            Density: ${corridor.densityScore}% • Status: ${corridor.congestion}
          </div>
        </div>`,
        { sticky: true }
      );
    });

    // Draw Stations
    RAILWAY_STATIONS.forEach(station => {
      const isHigh = station.congestionLevel === 'HIGH';
      const circle = L.circleMarker([station.lat, station.lng], {
        radius: station.platforms > 12 ? 5.5 : 4,
        fillColor: isHigh ? '#f43f5e' : '#38bdf8',
        fillOpacity: 0.9,
        color: '#ffffff',
        weight: 1.2
      }).addTo(map);

      circle.bindTooltip(
        `<div style="font-size: 11px; font-weight: bold; color: #fff; font-family: sans-serif;">
          ${station.name} (${station.code})
          <div style="font-size: 10px; color: #94a3b8; font-weight: normal;">
            Platforms: ${station.occupiedPlatforms}/${station.platforms} (${station.congestionLevel} Congestion)
          </div>
        </div>`,
        { direction: 'top', offset: [0, -6] }
      );
    });

    mapInstanceRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Update Train Markers on live simulation tick (Clean, no obstructive duplicate popup)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    trains.forEach(train => {
      const isSelected = selectedTrain?.id === train.id;
      const isHighDelay = train.delayMinutes > 30;
      const isModerateDelay = train.delayMinutes > 5 && train.delayMinutes <= 30;

      let bgColor = '#10b981';
      let borderColor = '#34d399';
      if (isHighDelay) {
        bgColor = '#ef4444';
        borderColor = '#f87171';
      } else if (isModerateDelay) {
        bgColor = '#f59e0b';
        borderColor = '#fbbf24';
      }
      if (train.category === 'FREIGHT') {
        bgColor = '#64748b';
        borderColor = '#94a3b8';
      }

      // Dominant styling for selected train with train number chip
      const iconHtml = `
        <div style="position: relative; width: ${isSelected ? '44px' : '30px'}; height: ${isSelected ? '44px' : '30px'}; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: ${isSelected ? '1' : '0.75'}; transition: all 0.3s ease;">
          ${isSelected ? '<div class="pulse-ring" style="position: absolute; width: 54px; height: 54px; border-radius: 50%; background-color: rgba(56, 189, 248, 0.35); border: 2px solid #38bdf8;"></div>' : ''}
          ${isHighDelay && !isSelected ? '<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(239, 68, 68, 0.35); border: 1px solid #ef4444;"></div>' : ''}
          
          <div style="
            width: ${isSelected ? '36px' : '24px'}; 
            height: ${isSelected ? '36px' : '24px'}; 
            border-radius: 50%; 
            background: ${bgColor}; 
            border: ${isSelected ? '2.5px solid #ffffff' : '1.5px solid ' + borderColor}; 
            box-shadow: ${isSelected ? '0 0 16px rgba(56, 189, 248, 0.8)' : '0 2px 6px rgba(0,0,0,0.6)'};
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(${train.heading}deg);
            transition: transform 0.4s ease;
          ">
            <svg width="${isSelected ? '20' : '12'}" height="${isSelected ? '20' : '12'}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 2 8 8-8 8-8-8z"/>
              <path d="M12 2v20"/>
            </svg>
          </div>

          <div style="
            position: absolute; 
            bottom: ${isSelected ? '-10px' : '-7px'}; 
            background: ${isSelected ? '#0284c7' : '#0f172a'}; 
            color: #ffffff; 
            font-size: ${isSelected ? '10px' : '8px'}; 
            font-family: monospace; 
            font-weight: 900; 
            padding: 0 4px; 
            border-radius: 4px; 
            border: 1px solid ${isSelected ? '#38bdf8' : '#334155'};
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.7);
          ">
            ${train.number}
          </div>
        </div>
      `;

      const trainIcon = L.divIcon({
        html: iconHtml,
        className: 'train-marker-icon',
        iconSize: isSelected ? [44, 44] : [30, 30],
        iconAnchor: isSelected ? [22, 22] : [15, 15]
      });

      let marker = markersRef.current.get(train.id);
      if (!marker) {
        marker = L.marker([train.currentLat, train.currentLng], { icon: trainIcon }).addTo(map);
        marker.on('click', () => {
          onSelectTrain(train);
        });
        markersRef.current.set(train.id, marker);
      } else {
        marker.setLatLng([train.currentLat, train.currentLng]);
        marker.setIcon(trainIcon);
        if (isSelected) marker.setZIndexOffset(1000);
        else marker.setZIndexOffset(100);
      }
    });
  }, [trains, selectedTrain?.id, onSelectTrain]);

  // 3. Highlight full route & pan smoothly when train is selected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedRoutePolylineRef.current) {
      selectedRoutePolylineRef.current.remove();
      selectedRoutePolylineRef.current = null;
    }

    if (selectedTrain) {
      const routeLine = L.polyline(selectedTrain.fullRouteCoordinates, {
        color: '#38bdf8',
        weight: 5,
        opacity: 0.95,
        dashArray: '8, 6'
      }).addTo(map);

      selectedRoutePolylineRef.current = routeLine;

      map.flyTo([selectedTrain.currentLat, selectedTrain.currentLng], Math.max(map.getZoom(), 7), {
        animate: true,
        duration: 1.0
      });
    }
  }, [selectedTrain?.id]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ background: '#0a0e1a' }} />

      {/* Clean Map Legend with "LIVE TRAIN POSITION" */}
      <div className="absolute bottom-4 right-4 z-[400] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs text-slate-300 shadow-2xl space-y-2 hidden md:block max-w-xs pointer-events-auto">
        <div className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-1">
          <span>Corridor Track Legend</span>
          <span className="text-[10px] text-blue-400 font-mono">LIVE TRAIN POSITION</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>On-Time (&le;5m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Minor (6-30m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>Heavy Delay (&gt;30m)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>DFC Freight</span>
          </div>
        </div>
      </div>

    </div>
  );
};
