document.getElementById("analyze").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => window.getSelection().toString()
      },
      async (results) => {
        const selectedText = results[0].result;

        if (!selectedText || selectedText.trim() === "") {
          document.getElementById("output").innerText = "! Please select some text first.";
          return;
        }

        try {
          const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText })
          });

          const result = await response.json();
          document.getElementById("output").innerText = `Bias: ${result.bias}\nConfidence: ${result.confidence}`;
        } catch (err) {
          document.getElementById("output").innerText = "Error contacting server.";
          console.error(err);
        }
      }
    );
  });
});

document.getElementById("summarize").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => window.getSelection().toString()
      },
      async (results) => {
        const selectedText = results[0].result;

        if (!selectedText || selectedText.trim() === "") {
          document.getElementById("output").innerText = "❗ Please select some text first.";
          return;
        }

        try {
          const response = await fetch("http://127.0.0.1:8000/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText })
          });

          const result = await response.json();
          document.getElementById("output").innerText = `📝 Neutral Summary:\n${result.summary}`;
        } catch (err) {
          document.getElementById("output").innerText = "Error contacting summarization server.";
          console.error(err);
        }
      }
    );
  });
});

