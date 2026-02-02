import React from 'react';
import type { EmotionResult } from '../types';

interface EmotionCardProps {
  emotion: EmotionResult;
}

const emotionColors: { [key: string]: string } = {
  joy: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  sadness: 'bg-blue-100 text-blue-700 border-blue-200',
  anger: 'bg-red-100 text-red-700 border-red-200',
  fear: 'bg-purple-100 text-purple-700 border-purple-200',
  disgust: 'bg-green-100 text-green-700 border-green-200',
  surprise: 'bg-pink-100 text-pink-700 border-pink-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
};

const emotionEmojis: { [key: string]: string } = {
  joy: '😊',
  sadness: '😢',
  anger: '😠',
  fear: '😨',
  disgust: '🤢',
  surprise: '😲',
  neutral: '😐',
};

export const EmotionCard: React.FC<EmotionCardProps> = ({ emotion }) => {
  const dominantColor = emotionColors[emotion.dominant_emotion] || emotionColors.neutral;
  const emoji = emotionEmojis[emotion.dominant_emotion] || '😐';

  return (
    <div className="w-full p-4 bg-white rounded-lg border border-gray-200 mt-3">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-700">Emotional Tone</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${dominantColor}`}>
          <span className="text-xs mr-1">{emoji}</span>
          {emotion.dominant_emotion.charAt(0).toUpperCase() + emotion.dominant_emotion.slice(1)} · {Math.round(emotion.confidence * 100)}%
        </span>
      </div>
      
      {/* Emotion Breakdown */}
      <div className="space-y-2">
        {Object.entries(emotion.all_emotions)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([emotionName, score]) => (
            <div key={emotionName} className="flex items-center gap-2">
              <span className="text-xs w-16 text-gray-600 capitalize text-xs">{emotionEmojis[emotionName]} {emotionName}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                <div 
                  className={`h-full ${emotionColors[emotionName]?.split(' ')[0] || 'bg-gray-400'}`}
                  style={{ width: `${score * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-10 text-right">{Math.round(score * 100)}%</span>
            </div>
          ))}
      </div>
    </div>
  );
};
