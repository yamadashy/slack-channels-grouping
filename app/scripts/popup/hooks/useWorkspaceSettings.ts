import { useState, useEffect } from 'react';

interface WorkspaceSettings {
  multiLevelGrouping: boolean;
}

export const useWorkspaceSettings = (workspaceId: string) => {
  const [settings, setSettings] = useState<WorkspaceSettings>({
    multiLevelGrouping: false,
  });

  useEffect(() => {
    // Load settings from storage
    chrome.storage.local.get([workspaceId], (result) => {
      if (result[workspaceId]) {
        setSettings(result[workspaceId]);
      }
    });
  }, [workspaceId]);

  const updateSettings = (newSettings: Partial<WorkspaceSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    chrome.storage.local.set({ [workspaceId]: updatedSettings }, () => {
      chrome.runtime.sendMessage({ action: 'settingsUpdated' });
    });
  };

  return { settings, updateSettings };
};
