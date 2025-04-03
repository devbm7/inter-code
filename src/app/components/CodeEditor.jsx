'use client';

import React, { useState, useEffect } from 'react';
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

const defaultCode = ``;

const CodeEditor = ({ onCodeChange, initialCode }) => {
  const [code, setCode] = useState(initialCode || defaultCode);
  const [editorInstance, setEditorInstance] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    // When component mounts, update the initialized state
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    // Only set initial code when it changes and after editor is initialized
    if (editorInstance && initialCode && !hasInitialized) {
      setCode(initialCode);
      editorInstance.setValue(initialCode);
      setHasInitialized(true);
    }
  }, [initialCode, editorInstance, hasInitialized]);
  
  const handleChange = (editor, data, value) => {
    setCode(value);
    if (onCodeChange) {
      onCodeChange(value);
    }
  };
  
  const handleEditorDidMount = (editor) => {
    setEditorInstance(editor);
    
    // Fix for cursor position issue after typing parentheses
    editor.on('keyHandled', (cm, name, event) => {
      // Ensure cursor position is correct after auto-pairing brackets
      if (name === ')' || name === '}' || name === ']' || name === '(' || name === '{' || name === '[') {
        const cursor = cm.getCursor();
        cm.setCursor(cursor+1);
      }
    });
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
    electricChars: true, // Enable auto-indentation
    autofocus: true, // Focus the editor on load
    extraKeys: {
      "Tab": (cm) => {
        if (cm.somethingSelected()) {
          cm.indentSelection("add");
        } else {
          cm.replaceSelection("    ", "end");
        }
      }
    }
  };

  return (
    <div className="code-editor-container h-full">
      {typeof window !== 'undefined' && (
        <CodeMirror
          value={code}
          options={options}
          onBeforeChange={handleChange}
          editorDidMount={handleEditorDidMount}
          className="h-full"
          // Add preserveScrollPosition to maintain cursor position
          preserveScrollPosition={true}
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
        
        /* Ensure cursor is visible */
        :global(.CodeMirror-cursor) {
          border-left: 2px solid white !important;
        }
        
        /* Fix focus issues */
        :global(.CodeMirror-focused) {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;