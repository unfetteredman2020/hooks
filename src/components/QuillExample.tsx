import React, { useRef, useState } from 'react';
import axios from 'axios';
import Quill, { Props } from './Quill';

const QuillExample: React.FC = () => {
  const editorRef = useRef<{ clear: () => void; getHtml: () => string | undefined; getText: () => string | undefined }>(null);
  const [content, setContent] = useState<string>('');

  // Create an axios instance for file uploads
  const axiosInstance = axios.create({
    baseURL: 'https://your-api-base-url.com', // Replace with your actual API base URL
    timeout: 10000,
  });

  const handleContentChange = (val?: string) => {
    setContent(val || '');
  };

  const handleClear = () => {
    editorRef.current?.clear();
  };

  const handleGetContent = () => {
    const html = editorRef.current?.getHtml();
    const text = editorRef.current?.getText();
    console.log('HTML Content:', html);
    console.log('Text Content:', text);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>WangEditor Example</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleClear} style={{ marginRight: '10px', padding: '8px 16px' }}>
          Clear Editor
        </button>
        <button onClick={handleGetContent} style={{ padding: '8px 16px' }}>
          Get Content
        </button>
      </div>

      <Quill
        ref={editorRef}
        request={axiosInstance}
        uploadUrl="/api/upload" // Replace with your actual upload endpoint
        value={content}
        onChange={handleContentChange}
        showToolbar={true}
      />

      <div style={{ marginTop: '20px' }}>
        <h3>Current Content:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {content || 'No content'}
        </pre>
      </div>
    </div>
  );
};

export default QuillExample;