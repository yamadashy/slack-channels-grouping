// Update extension content for slack tabs
chrome.tabs.query({}, async (tabs) => {
  for (const tabKey in tabs) {
    const tab = tabs[tabKey];

    // Do not have permission
    if (tab.url === undefined) {
      continue;
    }

    // Skip execute on discarded tab
    if (tab.discarded) {
      continue;
    }

    // Under some circumstances a Tab may not be assigned an ID
    if (tab.id === undefined) {
      continue;
    }

    await chrome.scripting.insertCSS({
      target: {
        tabId: tab.id,
        allFrames: true,
      },
      files: ['styles/content.css'],
    });
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
        allFrames: true,
      },
      files: ['scripts/content.js'],
    });
  }
});
