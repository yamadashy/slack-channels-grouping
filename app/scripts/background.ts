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
