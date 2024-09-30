'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, EditorRef } from '../components/Tiptap/Editor';

export type Post = {
  content: string;
};

export default function Home() {
  const editorRef = useRef<EditorRef>();

  const [content, setContent] = useState('');

  const handleContentChange = useCallback((newContent: string) =>
  {
    setContent(newContent);
  
  }, []);
  return (
"pag de prueba"
  );
}
