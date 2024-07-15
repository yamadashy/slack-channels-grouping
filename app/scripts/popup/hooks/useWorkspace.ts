import { useState, useEffect } from 'react';

export const useWorkspace = () => {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWorkspaceId = () => {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const currentTab = tabs[0];
        if (!currentTab || !currentTab.url) {
          setError('Unable to access current tab');
          setIsLoading(false);
          return;
        }

        const match = currentTab.url.match(/https:\/\/app\.slack\.com\/client\/([^/]+)/);
        if (match && match[1]) {
          setWorkspaceId(match[1]);
        } else {
          setError('Not a valid Slack workspace page');
        }
        setIsLoading(false);
      });
    };

    getWorkspaceId();
  }, []);

  return { workspaceId, isLoading, error };
};
