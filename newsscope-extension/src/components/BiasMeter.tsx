import React from 'react';
import clsx from 'clsx';
import type { AnalysisResult } from '../types';

interface BiasMeterProps {
  result: AnalysisResult;
}

export const BiasMeter: React.FC<BiasMeterProps> = ({ result }) => {
  const { bias, confidence } = result;
  
  // Normalize bias to position (0 = Left, 50 = Center, 100 = Right)
  let position = 50;
  let colorClass = 'bg-gray-400';
  
  if (bias === 'Left') {
    position = 15; // Left side
    colorClass = 'bg-bias-left';
  } else if (bias === 'Right') {
    position = 85; // Right side
    colorClass = 'bg-bias-right';
  } else {
    position = 50;
    colorClass = 'bg-bias-center';
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 mt-3">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-700">Political Bias</span>
        <span className={clsx("text-xs font-semibold px-2.5 py-1 rounded text-white", colorClass)}>
          {bias} · {Math.round(confidence * 100)}%
        </span>
      </div>
      
      {/* Spectrum Bar */}
      <div className="relative h-3 w-full bg-gradient-to-r from-bias-left via-bias-center to-bias-right rounded-md">
        <div 
          className="absolute top-0 w-0.5 h-5 -mt-1 bg-gray-900 shadow-sm"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      
      <div className="flex justify-between text-[10px] text-gray-500 mt-1.5 font-medium">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </div>
    </div>
  );
};
