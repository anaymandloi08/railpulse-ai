import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TRAIN_12951_DELAY_SERIES, 
  CORRIDOR_BOTTLENECK_DATA, 
  CATEGORY_DELAY_DISTRIBUTION, 
  HOURLY_NETWORK_DELAY_TREND 
} from '../../data/historicalData';
import { Cpu, TrendingUp, AlertTriangle, Layers } from 'lucide-react';

export const DelayCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* 1. Train 12951 Station Dwell vs Cumulative Delay Curve */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Train 12951: Dwell Overrun vs Predicted Delay
            </h3>
          </div>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
            Rajdhani Corridor
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TRAIN_12951_DELAY_SERIES}>
              <defs>
                <linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="station" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="m" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="cumulativeDelay" name="Actual Delay (min)" stroke="#ef4444" fillOpacity={1} fill="url(#delayGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="predictedDelay" name="AI Model Prediction" stroke="#38bdf8" strokeDasharray="4 4" fillOpacity={1} fill="url(#aiGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="actualDwell" name="Station Dwell (min)" stroke="#f59e0b" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="text-[11px] text-slate-400">
          Sharp escalation identified after <span className="text-white font-semibold">Ratlam (RTM)</span> where dwell exceeded scheduled stop by 9 minutes due to parcel loading + freight congestion.
        </div>
      </div>

      {/* 2. Critical Junction Bottleneck Congestion Ranking */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Network Junction Congestion Index
            </h3>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
            Bottleneck Heat
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CORRIDOR_BOTTLENECK_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
              <YAxis dataKey="junction" type="category" stroke="#64748b" tick={{ fontSize: 9 }} width={120} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
              />
              <Bar dataKey="congestionScore" name="Congestion Index (%)" radius={[0, 4, 4, 0]}>
                {CORRIDOR_BOTTLENECK_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.congestionScore > 90 ? '#ef4444' : entry.congestionScore > 75 ? '#f59e0b' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-[11px] text-slate-400">
          <span className="text-rose-400 font-semibold">Pt. Deen Dayal Upadhyaya (95%)</span> and <span className="text-rose-400 font-semibold">Kota Junction (92%)</span> represent the primary network bottlenecks.
        </div>
      </div>

      {/* 3. Category Delay Distribution */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              On-Time Performance by Train Category
            </h3>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CATEGORY_DELAY_DISTRIBUTION}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="onTimePct" name="On-Time % (OTP)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avgDelayMin" name="Avg Delay (min)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. 24h Hourly Network Delay Surge Trend */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Diurnal Delay Trend & Congestion Wave
            </h3>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HOURLY_NETWORK_DELAY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="avgDelay" name="Network Avg Delay (min)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="congestedSections" name="Congested Corridors" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="trainsActive" name="Trains Active" stroke="#38bdf8" strokeWidth={1.5} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
