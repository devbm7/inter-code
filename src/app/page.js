'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';

// Dynamically import components that require client-side rendering
const CodeEditor = dynamic(() => import('./components/CodeEditor'), { 
  ssr: false,
  loading: () => <div className="loading">Loading Editor...</div>
});

const OutputDisplay = dynamic(() => import('./components/OutputDisplay'), { 
  ssr: false,
  loading: () => <div className="loading">Loading Output...</div>
});

export default function Home() {
  const [code, setCode] = useState('# Write your Python code here\nprint("Hello, World!")');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setError('');
    
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOutput(data.output);
        if (data.error) {
          setError(data.error);
        }
      } else {
        setError(data.error || 'An error occurred while executing the code.');
      }
    } catch (err) {
      setError('Network error: Could not connect to the server.');
      console.error('Error executing code:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="main-container">
      <Navbar onRunCode={handleRunCode} isRunning={isRunning} />
      
      <div className="code-environment">
        <div className="editor-pane">
          <CodeEditor onCodeChange={setCode} />
        </div>
        <div className="output-pane">
          <OutputDisplay 
            output={output} 
            error={error} 
            isRunning={isRunning} 
          />
        </div>
      </div>
      
      <style jsx>{`
        .main-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
        }
        
        .code-environment {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        
        .editor-pane {
          flex: 1;
          padding: 1rem;
          height: calc(100vh - 60px);
        }
        
        .output-pane {
          width: 35%;
          padding: 1rem;
          height: calc(100vh - 60px);
        }
        
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #a0aec0;
        }
        
        @media (max-width: 1024px) {
          .code-environment {
            flex-direction: column;
          }
          
          .editor-pane,
          .output-pane {
            width: 100%;
            height: auto;
          }
          
          .editor-pane {
            flex: 2;
          }
          
          .output-pane {
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}