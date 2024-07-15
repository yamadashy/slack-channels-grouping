import React from 'react';
import MultiLevelGroupingToggle from './MultiLevelGroupingToggle';
import { useWorkspaceSettings } from '../hooks/useWorkspaceSettings';

interface WorkspaceSettingsProps {
  workspaceId: string;
}

const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({ workspaceId }) => {
  const { settings, updateSettings } = useWorkspaceSettings(workspaceId);

  return (
    <div>
      <h2 className="text-base font-semibold mb-2 text-gray-700 border-l-4 border-gray-300 pl-2 py-1">Workspace Settings</h2>
      <div className="mb-2">
        <div className="bg-gray-100 p-2 rounded-md text-gray-700">
          {`app.slack.com/${workspaceId}`}
        </div>
      </div>
      <MultiLevelGroupingToggle
        isEnabled={settings.multiLevelGrouping}
        onToggle={(enabled) => updateSettings({ multiLevelGrouping: enabled })}
      />
    </div>
  );
};

export default WorkspaceSettings;
