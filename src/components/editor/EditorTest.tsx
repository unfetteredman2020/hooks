import React, { useRef, useState } from 'react';
import axios from 'axios';
import Quill from './Quill';

// 创建一个 axios 实例用于测试
const request = axios.create({
  baseURL: 'https://httpbin.org', // 使用 httpbin 作为测试端点
  timeout: 10000,
});

const EditorTest: React.FC = () => {
  const editorRef = useRef<any>(null);
  const [content, setContent] = useState<string>('');

  const handleContentChange = (value?: string) => {
    setContent(value || '');
    console.log('Editor content changed:', value);
  };

  const handleGetContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml();
      const text = editorRef.current.getText();
      console.log('HTML Content:', html);
      console.log('Text Content:', text);
      alert(`HTML: ${html}\nText: ${text}`);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.clear();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>WangEditor Test Component</h1>
      
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
        request={request}
        uploadUrl="/post" // httpbin endpoint for testing
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

export default EditorTest;