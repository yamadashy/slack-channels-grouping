import React from 'react';

interface MultiLevelGroupingToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const MultiLevelGroupingToggle: React.FC<MultiLevelGroupingToggleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <span className="text-sm font-medium text-gray-900">Multi-level Grouping</span>
        <span className="text-sm text-gray-500">
          Enable grouping for multiple levels of channel prefixes
        </span>
      </span>
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`${
          isEnabled ? 'bg-indigo-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        <span
          className={`${
            isEnabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

export default MultiLevelGroupingToggle;
