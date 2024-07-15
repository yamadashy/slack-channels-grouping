const injectContentToTab = async (tab: chrome.tabs.Tab) => {
  // Do not have permission
  if (tab.url === undefined) {
    return;
  }

  // Skip execute on discarded tab
  if (tab.discarded) {
    return;
  }

  // Under some circumstances a Tab may not be assigned an ID
  if (tab.id === undefined) {
    return;
  }

  const manifest = chrome.runtime.getManifest();
  const cssFiles = manifest.content_scripts?.[0].css ?? [];
  const jsFiles = manifest.content_scripts?.[0].js ?? [];

  if (cssFiles.length > 0) {
    await chrome.scripting.insertCSS({
      target: {
        tabId: tab.id,
        allFrames: true,
      },
      files: cssFiles,
    });
  }
  if (jsFiles.length > 0) {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
        allFrames: true,
      },
      files: jsFiles,
    });
  }
};

// Update extension content for tabs
chrome.tabs.query({}, async (tabs) => {
  for (const tabKey in tabs) {
    const tab = tabs[tabKey];

    try {
      injectContentToTab(tab);
    } catch (e) {
      console.error(e);
    }
  }
});

let contentScriptReady = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getWorkspaceId') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      console.log(currentTab);
      console.log(currentTab.url);
      if (currentTab && currentTab.url) {
        const match = currentTab.url.match(/https:\/\/app\.slack\.com\/client\/([^/]+)/);
        const workspaceId = match ? match[1] : null;
        sendResponse({ workspaceId: workspaceId });
      } else {
        sendResponse({ workspaceId: null });
      }
    });
    return true;
  }

  if (request.action === 'contentScriptReady') {
    contentScriptReady = true;
    console.log('Content script is ready');
    sendResponse({ received: true });
    return false;
  }

  if (request.action === 'settingsUpdated') {
    if (!contentScriptReady) {
      console.log('Content script not ready');
      sendResponse({ success: false, error: 'Content script not ready' });
      return false;
    }

    console.log('Notifying content script about settings update');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'settingsUpdated' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError);
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log('Settings update notification sent successfully, response:', response);
            sendResponse(response);
          }
        });
      } else {
        console.log('No active tab found');
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true; // Needed for asynchronous response
  }
});

console.log('Background script loaded');
