import React from 'react';
import { RAILWAY_STATIONS } from '../../data/railwayStations';
import { RAILWAY_CORRIDORS } from '../../data/railwayCorridors';
import { Layers, Activity, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

export const CongestionHeatmap: React.FC = () => {
  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>NETWORK DENSITY & BOTTLENECK HEATMAP</span>
        </div>
        <h2 className="text-xl font-black text-white mt-1">
          Indian Railways Corridor Density Matrix
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Live sectional track occupancy, station platform saturation, and block headway clearance across major trunk corridors.
        </p>
      </div>

      {/* Corridors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {RAILWAY_CORRIDORS.map(corridor => {
          const isCongested = corridor.congestion === 'CONGESTED';
          const isModerate = corridor.congestion === 'MODERATE';

          return (
            <div
              key={corridor.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{corridor.name}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                  isCongested
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : isModerate
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {corridor.congestion}
                </span>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Code: <span className="text-slate-200">{corridor.code}</span>
              </div>

              {/* Density Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Track Saturation:</span>
                  <span className="font-mono font-bold text-slate-200">{corridor.densityScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCongested ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${corridor.densityScore}%` }}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span>Waypoints: {corridor.waypoints.length} nodes</span>
                <span className="text-blue-400 font-semibold">Active Monitoring</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Station Platforms Saturation Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Major Junction Platform Saturation Matrix
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {RAILWAY_STATIONS.length} Junctions Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {RAILWAY_STATIONS.map(station => {
            const occupancyPct = Math.round((station.occupiedPlatforms / station.platforms) * 100);
            const isHigh = station.congestionLevel === 'HIGH';

            return (
              <div
                key={station.id}
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  isHigh
                    ? 'bg-rose-950/20 border-rose-900/40'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white">{station.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{station.code} • {station.state}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {station.congestionLevel}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">PF Occupancy:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {station.occupiedPlatforms} / {station.platforms} ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occupancyPct > 80 ? 'bg-rose-500' : occupancyPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
