'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import CodeMirror with no SSR to prevent hydration issues
const CodeMirror = dynamic(
  () => {
    import('codemirror/mode/python/python');
    import('codemirror/addon/edit/closebrackets');
    import('codemirror/addon/edit/matchbrackets');
    import('codemirror/addon/comment/comment');
    import('codemirror/addon/selection/active-line');
    import('codemirror/lib/codemirror.css');
    import('codemirror/theme/material-palenight.css');
    return import('react-codemirror2').then(mod => mod.Controlled);
  },
  { ssr: false }
);

const defaultCode = `# Write your Python code here
def hello_world():
    return "Hello, World!"

print(hello_world())
`;

const CodeEditor = ({ onCodeChange }) => {
  const [code, setCode] = useState(defaultCode);

  const handleChange = (editor, data, value) => {
    setCode(value);
    if (onCodeChange) {
      onCodeChange(value);
    }
  };

  const options = {
    mode: 'python',
    theme: 'material-palenight',
    lineNumbers: true,
    lineWrapping: true,
    smartIndent: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    tabSize: 4,
    indentWithTabs: false,
  };

  return (
    <div className="code-editor-container h-full">
      {typeof window !== 'undefined' && (
        <CodeMirror
          value={code}
          options={options}
          onBeforeChange={handleChange}
          className="h-full"
        />
      )}
      <style jsx>{`
        .code-editor-container {
          font-family: 'Fira Code', monospace;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #2d3748;
        }
        
        /* Override CodeMirror styles to match LeetCode/CodePad */
        :global(.CodeMirror) {
          height: 100%;
          font-size: 14px;
          font-family: 'Fira Code', monospace;
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;