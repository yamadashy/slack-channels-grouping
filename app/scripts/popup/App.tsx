import React from 'react';
import { useWorkspace } from './hooks/useWorkspace';
import WorkspaceSettings from './components/WorkspaceSettings';
import InvalidPageMessage from './components/InvalidPageMessage';

const App: React.FC = () => {
  const { workspaceId, isLoading, error } = useWorkspace();

  if (isLoading) {
    return <div className="bg-white text-gray-800 p-4 w-100">Loading...</div>;
  }

  return (
    <div className="bg-white text-gray-800 p-3 w-100">
      <div className="text-lg font-bold mb-3 text-gray-900 flex items-center justify-center">
        <img src="../../images/icon-19.png" alt="slack-icon" className="mr-2" />
        <h1 className="inline-block">Slack Channel Grouping</h1>
      </div>

      {(error || !workspaceId) ? (
        <InvalidPageMessage />
      ) : (
        <WorkspaceSettings workspaceId={workspaceId} />
      )}
    </div>
  );
};

export default App;
