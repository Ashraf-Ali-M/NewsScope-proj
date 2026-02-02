// Background Service Worker

// 1. Context Menu Setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkBias",
    title: "Check News Bias",
    contexts: ["selection"]
  });
});

// 2. Context Menu Click Handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "checkBias" && info.selectionText) {
    handleAnalysis(info.selectionText)
      .then(result => {
         // Show result via alert (requires injecting script)
         chrome.scripting.executeScript({
           target: { tabId: tab.id },
           func: (text) => alert(text),
           args: [`Bias: ${result.bias}\nConfidence: ${result.confidence}`]
         });
      })
      .catch(error => {
         chrome.scripting.executeScript({
           target: { tabId: tab.id },
           func: (text) => alert(text),
           args: [`Error: ${error.message}`]
         });
      });
  }
});

// 3. Message Handler (for Popup and Content Scripts)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_TEXT") {
    // Keep the message channel open for async response
    handleFullAnalysis(request.text)
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
    return true; 
  }
});

// -- Helper Functions --

async function handleAnalysis(text) {
    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        if (!response.ok) throw new Error("Server error");
        return await response.json();
    } catch (err) {
        console.error("Predict Error:", err);
        throw err; // Re-throw to be caught by caller
    }
}

async function handleFullAnalysis(text) {
  try {
     const [predictRes, summaryRes, emotionRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        }),
        fetch("http://127.0.0.1:8000/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        }),
        fetch("http://127.0.0.1:8000/emotion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        })
     ]);

     if (!predictRes.ok || !summaryRes.ok || !emotionRes.ok) throw new Error("Failed to contact server");

     const predictData = await predictRes.json();
     const summaryData = await summaryRes.json();
     const emotionData = await emotionRes.json();

     return {
        analysis: predictData,
        summary: summaryData.summary,
        emotion: emotionData
     };

  } catch (err) {
    console.error("Full Analysis Error:", err);
    throw err;
  }
}


