'use client';

import React from 'react';

const OutputDisplay = ({ output, isRunning, error }) => {
  return (
    <div className="output-container">
      <div className="output-header">
        <h3>Output</h3>
        {isRunning && <span className="running-indicator">Running...</span>}
      </div>
      <div className="output-content">
        {error ? (
          <pre className="error">{error}</pre>
        ) : (
          <pre>{output || 'Run your code to see the output here.'}</pre>
        )}
      </div>
      <style jsx>{`
        .output-container {
          background-color: #1e1e2e;
          color: #f8f8f2;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          border: 1px solid #2d3748;
        }
        
        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background-color: #282a36;
          border-bottom: 1px solid #2d3748;
        }
        
        .output-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }
        
        .running-indicator {
          font-size: 12px;
          color: #8be9fd;
          animation: pulse 1.5s infinite;
        }
        
        .output-content {
          flex: 1;
          padding: 16px;
          overflow: auto;
          font-family: 'Fira Code', monospace;
          font-size: 14px;
          line-height: 1.5;
        }
        
        pre {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .error {
          color: #ff5555;
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default OutputDisplay;