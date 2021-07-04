// Update extension content for slack tabs
chrome.tabs.query({}, (tabs) => {
  for (const tabKey in tabs) {
    const tab = tabs[tabKey];

    // Do not have permission
    if (tab.url === undefined) {
      continue;
    }

    // Skip execute on discarded tab
    if (tab.discarded) {
      return;
    }

    chrome.tabs.insertCSS(
      tab.id,
      {
        file: 'styles/content.css',
        runAt: 'document_start',
        allFrames: true,
      },
      () => {
        chrome.tabs.executeScript(tab.id, {
          file: 'scripts/content.js',
          runAt: 'document_start',
          allFrames: true,
        });
      },
    );
  }
});
