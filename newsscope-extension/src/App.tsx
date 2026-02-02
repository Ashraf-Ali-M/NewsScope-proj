import { useState, useEffect } from 'react';
import { BiasMeter } from './components/BiasMeter';
import { SummaryCard } from './components/SummaryCard';
import { EmotionCard } from './components/EmotionCard';
import type { AnalysisResult, EmotionResult } from './types';
import { Newspaper, Search, FileText } from 'lucide-react';

function App() {
  const [selectedText, setSelectedText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);


  useEffect(() => {
    // Load saved state from localStorage
    const savedState = localStorage.getItem('newsscope_analysis');
    if (savedState) {
      try {
        const { analysis, summary, emotion, selectedText: savedText } = JSON.parse(savedState);
        if (analysis) setAnalysis(analysis);
        if (summary) setSummary(summary);
        if (emotion) setEmotion(emotion);
        if (savedText) setSelectedText(savedText);
      } catch (e) {
        console.error('Error loading saved state:', e);
      }
    }

    // Get selection on load (if running in extension)
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
            const tabId = tabs[0]?.id;
            if (tabId) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId },
                        func: () => window.getSelection()?.toString() || ''
                    },
                    (results: chrome.scripting.InjectionResult<string>[]) => {
                        if (results && results[0] && results[0].result) {
                            setSelectedText(results[0].result);
                        }
                    }
                );
            }
        });
    }
  }, []);

  const handleAnalyze = async () => {
    if (!selectedText.trim()) {
      setError("Please select some text first.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSummary(null);
    setEmotion(null);


    // Send message to background script
    chrome.runtime.sendMessage(
        { action: "ANALYZE_TEXT", text: selectedText },
        (response) => {
            setLoading(false);
            
            if (chrome.runtime.lastError) {
                setError("Extension connection failed. Try reloading the extension.");
                console.error(chrome.runtime.lastError);
                return;
            }

            console.log("Response from background:", response);

            if (response && response.success) {
                console.log("Analysis data:", response.data.analysis);
                console.log("Summary data:", response.data.summary);
                console.log("Emotion data:", response.data.emotion);
                setAnalysis(response.data.analysis);
                setSummary(response.data.summary);
                setEmotion(response.data.emotion);
                
                // Save to localStorage
                localStorage.setItem('newsscope_analysis', JSON.stringify({
                    analysis: response.data.analysis,
                    summary: response.data.summary,
                    emotion: response.data.emotion,
                    selectedText: selectedText
                }));
            } else {
                setError(response?.error || "Analysis failed. Check backend server.");
            }
        }
    );
  };

  return (
    <div className="w-[350px] max-h-[600px] min-h-[400px] p-0 bg-gray-50 text-gray-800 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2.5">
        <div className="bg-blue-600 p-1.5 rounded text-white">
          <Newspaper size={18} />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-none text-gray-900">NewsScope</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">News Analysis Tool</p>
        </div>
      </div>

      <div className="p-4">
        {/* Selection Preview */}
        {!analysis && !loading && (
            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                <div className="flex items-center gap-1.5 mb-1.5 text-gray-600 text-xs font-medium">
                    <FileText size={13} />
                    <span>Selected Text</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                    {selectedText ? `"${selectedText}"` : "No text selected. Highlight text on a webpage to analyze."}
                </p>
            </div>
        )}

        {/* Action Button */}
        {!analysis && (
            <button 
                onClick={handleAnalyze}
                disabled={loading || !selectedText}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                    <Search size={16} />
                )}
                {loading ? "Analyzing..." : "Analyze Selection"}
            </button>
        )}

        {/* Error */}
        {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                {error}
            </div>
        )}

        {/* Results */}
        {analysis && (
            <div>
                <BiasMeter result={analysis} />
                
                {emotion && <EmotionCard emotion={emotion} />}
                
                {summary && <SummaryCard summary={summary} />}
                
                <button 
                    onClick={() => {
                        setAnalysis(null);
                        setSummary(null);
                        setEmotion(null);
                        setSelectedText('');
                        localStorage.removeItem('newsscope_analysis');
                    }}
                    className="w-full mt-4 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium"
                >
                    Analyze New Text
                </button>
            </div>
        )}
      </div>
    </div>
  );
}

export default App;
