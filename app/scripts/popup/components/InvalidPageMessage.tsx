import React from 'react';

const InvalidPageMessage: React.FC = () => (
  <div className="bg-gray-100 border-l-4 border-gray-300 p-4 rounded-md" role="alert">
    <p className="text-gray-800">This extension works only for Slack.</p>
    <a
      href="https://app.slack.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline mt-2 inline-block"
    >
      app.slack.com
    </a>
  </div>
);

export default InvalidPageMessage;
