import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const CodeEditor = ({ code, language, onLanguageChange }) => {
//   const [code, setCode] = useState('');
//   const [language, setLanguage] = useState('javascript');

//   const handleLanguageChange = (event) => {
//     setLanguage(event.target.value);
//   };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="language-select" style={{ marginRight: '10px' }}>Select Language:</label>
        <select
          id="language-select"
          value={language}
          onChange={onLanguageChange}
          style={{ padding: '5px' }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="cpp">C++</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="go">Go</option>
          <option value="typescript">TypeScript</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
        </select>
      </div>
      {/* <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here..."
        style={{ width: '100%', height: '150px', fontFamily: 'monospace', fontSize: '14px' }}
      /> */}
      <h3>Structured Code:</h3>
      <SyntaxHighlighter language={language} style={docco}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeEditor;
