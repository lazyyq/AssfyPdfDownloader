// Background script runs in the background
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});
