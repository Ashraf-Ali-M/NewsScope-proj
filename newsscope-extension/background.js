chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "checkBias",
    title: "Check News Bias",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "checkBias") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getSelectedTextAndSend
    });
  }
});

function getSelectedTextAndSend() {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText })
    })
      .then(response => response.json())
      .then(data => {
        alert(`Bias: ${data.bias}\nConfidence: ${data.confidence}`);
      })
      .catch(error => {
        alert("Error contacting server.");
        console.error(error);
      });
  } else {
    alert("Please select some text first.");
  }
}
