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
  console.log('content', content);
  return (
    <div className='h-screen flex p-4'>
      <div className='max-w-screen-md w-full mx-auto relative'>
        <div className='flex flex-col h-full space-y-4'>
          <div className='flex flex-col flex-1 space-y-2 h-full overflow-hidden'>
            <label className='text-base font-bold text-muted-foreground'>
              Content
            </label>
            <div className='border bg-background shadow-md rounded-lg flex flex-1 h-full overflow-auto'>
              <Editor
                ref={editorRef}
                wrapperClassName='flex flex-col h-full overflow-hidden'
                contentClassName='h-full overflow-auto'
                fixedMenuClassName='relative z-0 inset-x-0 w-full bg-background text-black'
                content={content}
                editorProps={{
                  attributes: {
                    class:
                      'pt-6 pb-6 px-6 prose prose-base prose-blue prose-headings:scroll-mt-[80px] dark:prose-invert',
                  },
                }}
                onUpdate={({ editor }) => {
                  const html = !editor.isEmpty ? editor.getHTML() : '';
                  handleContentChange(html);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
