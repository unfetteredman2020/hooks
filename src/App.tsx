import React, { useState, useRef } from 'react';
import axios from 'axios';
import Quill from './components/Quill';
import './App.css';

// Create a mock axios instance for testing
const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
});

function App() {
  const [content, setContent] = useState<string | undefined>('');
  const editorRef = useRef<any>(null);

  const handleChange = (value?: string) => {
    setContent(value);
    console.log('Editor content changed:', value);
  };

  const handleGetContent = () => {
    if (editorRef.current) {
      console.log('HTML:', editorRef.current.getHtml());
      console.log('Text:', editorRef.current.getText());
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.clear();
    }
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>WangEditor Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleGetContent} style={{ marginRight: '10px' }}>
          Get Content
        </button>
        <button onClick={handleClear}>
          Clear Editor
        </button>
      </div>

      <Quill
        ref={editorRef}
        request={axiosInstance}
        uploadUrl="/upload"
        value={content}
        onChange={handleChange}
        showToolbar={true}
      />

      <div style={{ marginTop: '20px' }}>
        <h3>Preview:</h3>
        <div 
          style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            minHeight: '100px',
            backgroundColor: '#f5f5f5'
          }}
          dangerouslySetInnerHTML={{ __html: content || '<p>No content yet...</p>' }}
        />
      </div>
    </div>
  );
}

export default App;