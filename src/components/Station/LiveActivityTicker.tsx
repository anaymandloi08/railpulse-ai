import React from 'react';
import { LiveActivityEvent } from '../../types/stationCommand';
import { Activity, Clock } from 'lucide-react';

interface LiveActivityTickerProps {
  events: LiveActivityEvent[];
}

export const LiveActivityTicker: React.FC<LiveActivityTickerProps> = ({ events }) => {
  return (
    <div className="bg-slate-950 border-t border-slate-800 px-3 py-2 flex items-center gap-3 overflow-x-auto text-xs whitespace-nowrap">
      <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px] uppercase tracking-wider shrink-0">
        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>LIVE ACTIVITY:</span>
      </div>

      <div className="flex items-center gap-4 text-xs font-mono">
        {events.map((evt, idx) => (
          <div key={evt.id || idx} className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">{evt.time}</span>
            <span className={
              evt.type === 'CRITICAL' ? 'text-rose-400 font-bold' :
              evt.type === 'AI_ACTION' ? 'text-cyan-300 font-bold' :
              evt.type === 'WARNING' ? 'text-amber-400 font-bold' :
              'text-slate-300'
            }>
              {evt.message}
            </span>
            {idx < events.length - 1 && <span className="text-slate-700">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
