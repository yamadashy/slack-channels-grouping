const injectContentToTab = async (tab: chrome.tabs.Tab) => {
  // Do not have permission
  if (tab.url === undefined) {
    return;
  }

  // Skip execute on discarded tab
  if (tab.discarded) {
    return;
  }

  // Skip tabs whose page is not loaded (e.g. restored but never
  // activated); the declared content script covers them on load
  if (tab.status === 'unloaded') {
    return;
  }

  // Under some circumstances a Tab may not be assigned an ID
  if (tab.id === undefined) {
    return;
  }

  const manifest = chrome.runtime.getManifest();
  const cssFiles = manifest.content_scripts?.[0].css ?? [];
  const jsFiles = manifest.content_scripts?.[0].js ?? [];

  // Slack renders parts of its UI (e.g. workspace switching) inside
  // iframes, so unlike the plain top-frame case we keep allFrames here
  // to match the declared content_scripts' all_frames: true.
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

// Update extension content for tabs the extension has host permission for
chrome.tabs.query({ url: ['http://app.slack.com/*', 'https://app.slack.com/*'] }, async (tabs) => {
  for (const tab of tabs) {
    try {
      await injectContentToTab(tab);
    } catch (e) {
      // Failures here are non-fatal: the declared content script
      // still runs when the page (re)loads
      console.warn('Slack Channels Grouping: skipped applying to tab:', tab.status, tab.url, e);
    }
  }
});
