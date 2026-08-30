import React, { useState } from 'react';
import { Alert, Train } from '../../types/railway';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  ArrowRight, 
  Cpu, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AlertCenterProps {
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  trains: Train[];
  onOpenDetails: (train: Train) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onResolveAlert,
  trains,
  onOpenDetails
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  const handleResolve = (alert: Alert) => {
    onResolveAlert(alert.id);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="p-4 space-y-5 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>OPERATIONAL SAFETY & DISPATCH INCIDENT LOG</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Controller Real-Time Alerts & Advisories
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated conflict warnings, headway infractions, dwell violations, and AI-recommended mitigation commands.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                filterSeverity === sev
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/60 mb-2" />
            No active incidents matching the selected filter.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';
            const relatedTrain = trains.find(t => t.number === alert.trainNumber);

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.resolved
                    ? 'bg-slate-950/40 border-slate-850 opacity-60'
                    : isCritical
                    ? 'bg-rose-950/20 border-rose-800/50 shadow-lg shadow-rose-950/20'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-800/50 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-mono text-xs font-black text-white">
                        TRAIN {alert.trainNumber} ({alert.trainName})
                      </span>
                      <span className="text-[11px] text-slate-500">• {alert.timestamp}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-100">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-amber-400 font-semibold">Recommended Action:</span>
                      <span>{alert.actionRequired}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-row md:flex-col items-end gap-2 w-full md:w-auto justify-between md:justify-start pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    {relatedTrain && (
                      <button
                        onClick={() => onOpenDetails(relatedTrain)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1"
                      >
                        <Cpu className="w-3.5 h-3.5 text-blue-400" />
                        Train Diagnostics
                      </button>
                    )}

                    {!alert.resolved ? (
                      <button
                        onClick={() => handleResolve(alert)}
                        className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-md shadow-rose-600/30"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Acknowledge & Mitigate
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Mitigated
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
