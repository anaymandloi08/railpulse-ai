import React, { useState } from 'react';
import { Train } from '../../types/railway';
import { TrainCard } from './TrainCard';
import { Search, Filter, SlidersHorizontal, Train as TrainIcon, AlertTriangle } from 'lucide-react';

interface TrainListPanelProps {
  trains: Train[];
  selectedTrain: Train | null;
  onSelectTrain: (train: Train) => void;
  onOpenDetails: (train: Train) => void;
  onSimulateFix: (train: Train) => void;
}

export const TrainListPanel: React.FC<TrainListPanelProps> = ({
  trains,
  selectedTrain,
  onSelectTrain,
  onOpenDetails,
  onSimulateFix
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RAJDHANI' | 'VANDE_BHARAT' | 'DELAYED' | 'FREIGHT'>('ALL');
  const [sortBy, setSortBy] = useState<'delay' | 'number' | 'speed'>('delay');

  const filteredTrains = trains
    .filter(train => {
      const matchesSearch =
        train.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.currentStation.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'RAJDHANI') return train.category === 'RAJDHANI';
      if (activeFilter === 'VANDE_BHARAT') return train.category === 'VANDE_BHARAT';
      if (activeFilter === 'DELAYED') return train.delayMinutes > 15;
      if (activeFilter === 'FREIGHT') return train.category === 'FREIGHT';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'delay') return b.delayMinutes - a.delayMinutes;
      if (sortBy === 'speed') return b.speed - a.speed;
      return a.number.localeCompare(b.number);
    });

  return (
    <div className="flex flex-col h-full bg-slate-950/70 border-r border-slate-800/80">
      
      {/* Header & Search */}
      <div className="p-3.5 border-b border-slate-800/80 space-y-3 bg-slate-900/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrainIcon className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Fleet Telemetry ({filteredTrains.length})
            </h2>
          </div>
          
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 px-2 py-0.5 focus:outline-none focus:border-blue-500"
            >
              <option value="delay">Sort: Delay (High-Low)</option>
              <option value="speed">Sort: Speed</option>
              <option value="number">Sort: Train No.</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search train no, name, station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition ${
              activeFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Trains
          </button>
          <button
            onClick={() => setActiveFilter('DELAYED')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              activeFilter === 'DELAYED'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-900 text-rose-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Delayed (&gt;15m)
          </button>
          <button
            onClick={() => setActiveFilter('RAJDHANI')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition ${
              activeFilter === 'RAJDHANI'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Rajdhani
          </button>
          <button
            onClick={() => setActiveFilter('VANDE_BHARAT')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition ${
              activeFilter === 'VANDE_BHARAT'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Vande Bharat
          </button>
          <button
            onClick={() => setActiveFilter('FREIGHT')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition ${
              activeFilter === 'FREIGHT'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Freight
          </button>
        </div>

      </div>

      {/* Train Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredTrains.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No active trains match the selected criteria.
          </div>
        ) : (
          filteredTrains.map(train => (
            <TrainCard
              key={train.id}
              train={train}
              isSelected={selectedTrain?.id === train.id}
              onSelect={onSelectTrain}
              onOpenDetails={onOpenDetails}
              onSimulateFix={onSimulateFix}
            />
          ))
        )}
      </div>

    </div>
  );
};
