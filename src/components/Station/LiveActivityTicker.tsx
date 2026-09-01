import React from 'react';
import { LiveActivityEvent, StationSector } from '../../types/stationCommand';
import { Activity } from 'lucide-react';

interface LiveActivityTickerProps {
  events: LiveActivityEvent[];
  sectors?: StationSector[];
  onSelectSector?: (sector: StationSector) => void;
}

export const LiveActivityTicker: React.FC<LiveActivityTickerProps> = ({ 
  events,
  sectors = [],
  onSelectSector
}) => {
  const handleEventClick = (message: string) => {
    if (!onSelectSector || sectors.length === 0) return;
    if (message.includes('Platform 2') || message.includes('P2')) {
      const sec = sectors.find(s => s.id === 'P2-A');
      if (sec) onSelectSector(sec);
    } else if (message.includes('Platform 1') || message.includes('P1')) {
      const sec = sectors.find(s => s.id === 'P1-A');
      if (sec) onSelectSector(sec);
    } else if (message.includes('Platform 3') || message.includes('P3')) {
      const sec = sectors.find(s => s.id === 'P3-A');
      if (sec) onSelectSector(sec);
    } else if (message.includes('Platform 4') || message.includes('P4')) {
      const sec = sectors.find(s => s.id === 'P4-A');
      if (sec) onSelectSector(sec);
    }
  };

  return (
    <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center gap-3 overflow-x-auto text-xs whitespace-nowrap z-10">
      <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] uppercase tracking-wider shrink-0">
        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>● LIVE ACTIVITY:</span>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        {events.map((evt, idx) => (
          <div 
            key={evt.id || idx} 
            onClick={() => handleEventClick(evt.message)}
            className="flex items-center gap-1.5 cursor-pointer hover:underline"
            title="Click to focus on station map"
          >
            <span className="text-slate-500 font-semibold">{evt.time}</span>
            <span className={
              evt.type === 'CRITICAL' ? 'text-rose-400 font-bold' :
              evt.type === 'AI_ACTION' ? 'text-cyan-300 font-bold' :
              evt.type === 'WARNING' ? 'text-amber-400 font-bold' :
              'text-slate-300'
            }>
              {evt.message}
            </span>
            {idx < events.length - 1 && <span className="text-slate-700 ml-3">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
