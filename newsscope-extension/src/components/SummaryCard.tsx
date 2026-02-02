import React from 'react';
import { FileText, Quote } from 'lucide-react';

interface SummaryCardProps {
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div className="w-full mt-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-2.5 border-b border-blue-200 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded">
          <FileText size={14} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-800">Article Summary</span>
      </div>
      
      {/* Summary Content */}
      <div className="p-4 relative">
        {/* Quote Icon */}
        <div className="absolute top-3 left-3 opacity-10">
          <Quote size={32} className="text-blue-600" />
        </div>
        
        {/* Summary Text */}
        <p className="text-sm text-gray-700 leading-relaxed relative z-10 pl-6">
          {summary}
        </p>
      </div>
    </div>
  );
};
