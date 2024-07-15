import React, { useState, useEffect } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface RegexSettingsProps {
  onApply: () => void;
}

const RegexSettings: React.FC<RegexSettingsProps> = ({ onApply }) => {
  const [inputRegex, setInputRegex] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRegexFromStorage();
  }, []);

  const loadRegexFromStorage = () => {
    chrome.storage.local.get(['regexPattern'], (result) => {
      if (result.regexPattern) {
        setInputRegex(result.regexPattern);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    chrome.storage.local.set({ regexPattern: inputRegex }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving regex:', chrome.runtime.lastError);
        setError('Failed to save changes. Please try again.');
      } else {
        chrome.runtime.sendMessage({ action: 'settingsUpdated' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error notifying content script:', chrome.runtime.lastError);
            setError('Failed to apply changes. Please try again.');
          } else {
            setIsApplied(true);
            setIsChanged(false);
            onApply();
            setTimeout(() => setIsApplied(false), 1000);
          }
        });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputRegex(newValue);
    setIsChanged(true);
  };

  const buttonText = isApplied ? 'Applied!' : 'Apply Changes';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-700">
          Channel Prefix Regex
        </label>
        <div className="text-xs text-gray-500 mb-1"><span className="text-xs text-gray-500">Default: <code className="bg-gray-100 p-1 rounded-sm text-xs text-purple-600 font-mono">^(.+?)[-_]</code></span></div>
        <input
          type="text"
          value={inputRegex}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter regex pattern"
        />
      </div>
      <button
        type="submit"
        disabled={!isChanged || isApplied}
        className={`w-full p-2 rounded-md flex items-center justify-center ${
          isChanged && !isApplied
            ? 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <CheckIcon className="h-5 w-5 mr-2" />
        <span>{buttonText}</span>
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default RegexSettings;
