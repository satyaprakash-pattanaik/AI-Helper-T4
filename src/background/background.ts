/// <reference types="chrome"/>

console.log("🚀 Background service worker starting...");

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("📨 Message received:", message);
  
  if (message.type === "analyze") {
    console.log("🔄 Processing analyze request...");
    
    // Handle async operation
    handleAnalyze(message.payload)
      .then(result => {
        console.log("✅ Sending response:", result);
        sendResponse(result);
      })
      .catch(error => {
        console.error("❌ Error in handleAnalyze:", error);
        sendResponse({ error: error.message });
      });
    
    return true; // Keep the message channel open for async response
  }
  
  return false;
});

async function handleAnalyze(payload: any) {
  console.log("🔍 Fetching from API...", payload);
  
  try {
    const res = await fetch("https://satya45.app.n8n.cloud/webhook-test/cca2828d-4f3e-4d9f-ad14-b63cfb84774f", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    console.log("📥 API response:", data);
    return data;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  }
}

console.log("✅ Background service worker loaded successfully");

// Keep service worker alive
chrome.runtime.onInstalled.addListener(() => {
  console.log("🎉 Extension installed/updated");
});