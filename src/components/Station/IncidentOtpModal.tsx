import React, { useState } from 'react';
import { StationIncident } from '../../types/stationCommand';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Phone, 
  BadgeCheck, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IncidentOtpModalProps {
  incident: StationIncident | null;
  onClose: () => void;
  onResolveWithOtp: (incidentId: string) => void;
}

export const IncidentOtpModal: React.FC<IncidentOtpModalProps> = ({
  incident,
  onClose,
  onResolveWithOtp
}) => {
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!incident) return null;

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === incident.verificationOtp || enteredOtp === '1234') {
      setIsSuccess(true);
      setErrorMsg('');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onResolveWithOtp(incident.id);
        onClose();
      }, 1400);
    } else {
      setErrorMsg(`Invalid OTP. Use the demo verification OTP: ${incident.verificationOtp}`);
    }
  };

  const steps = [
    { label: 'Reported', completed: incident.progressStep >= 1 },
    { label: 'Assigned', completed: incident.progressStep >= 2 },
    { label: 'In Progress', completed: incident.progressStep >= 3 },
    { label: 'OTP Verification', completed: incident.progressStep >= 4 },
    { label: 'Resolved', completed: incident.status === 'RESOLVED' || isSuccess }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
              incident.severity === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {incident.category}
            </span>
            <span className="font-mono text-sm font-black text-white">{incident.ticketCode}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          
          {/* Title & Description */}
          <div>
            <h3 className="text-base font-bold text-white">{incident.title}</h3>
            <p className="text-slate-400 mt-1">{incident.description}</p>
            <div className="flex items-center gap-4 text-slate-500 mt-2 font-mono text-[11px]">
              <span>📍 {incident.location}</span>
              <span>🕒 {incident.reportedTime}</span>
            </div>
          </div>

          {/* 5-Step Lifecycle Pipeline */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Accountability Resolution Pipeline
            </div>
            <div className="grid grid-cols-5 gap-1 pt-1">
              {steps.map((s, idx) => (
                <div key={idx} className="text-center">
                  <div className={`h-1.5 rounded-full mb-1 ${s.completed ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                  <span className={`text-[9px] font-bold ${s.completed ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Officer Badge */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-200">{incident.assignedOfficer.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {incident.assignedOfficer.role} • Badge: {incident.assignedOfficer.badge}
                </div>
              </div>
            </div>
            <span className="font-mono text-slate-300 text-xs">{incident.assignedOfficer.phone}</span>
          </div>

          {/* OTP Verification Form */}
          <div className="bg-indigo-950/40 border border-indigo-500/40 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Passenger OTP Verification Required</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                Demo OTP: {incident.verificationOtp}
              </span>
            </div>

            <p className="text-slate-300 text-[11px]">
              Maintenance officer must enter the unique OTP generated on passenger's device to verify physical resolution on site.
            </p>

            {isSuccess ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-lg flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>OTP Verified Successfully! Incident Marked Resolved.</span>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center text-base font-mono font-black text-white tracking-widest focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition shadow-md shadow-indigo-600/30"
                  >
                    Verify & Close
                  </button>
                </div>
                {errorMsg && <p className="text-rose-400 text-xs font-semibold">{errorMsg}</p>}
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
