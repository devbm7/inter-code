import React from 'react';

const Navbar = ({ onRunCode, isRunning }) => {
  return (
    <nav className="navbar">
      <div className="logo">CodeEnv</div>
      <div className="actions">
        <button 
          className="run-button" 
          onClick={onRunCode} 
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>
      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
          height: 60px;
          background-color: #1a202c;
          color: white;
          border-bottom: 1px solid #2d3748;
        }
        
        .logo {
          font-size: 1.25rem;
          font-weight: bold;
          color: #63b3ed;
        }
        
        .actions {
          display: flex;
          gap: 1rem;
        }
        
        .run-button {
          background-color: #38a169;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .run-button:hover:not(:disabled) {
          background-color: #2f855a;
        }
        
        .run-button:disabled {
          background-color: #4a5568;
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;