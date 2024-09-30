'use client';

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { EditorContent, EditorOptions } from '@tiptap/react';
import LinkBubbleMenu from './components/link-bubble-menu';
import { EditorInstance } from '.';

export interface EditorProps extends Partial<EditorOptions> {
  editor: EditorInstance; // Now this is passed as a prop
  wrapperClassName?: string;
  contentClassName?: string;
  onContentChange?: (content: string) => void; // For content change events
  placeholder?: string;
}

export type EditorRef = {
  getEditor: () => EditorInstance;
};

export const Editor = forwardRef<EditorRef, EditorProps>(
  (
    {
      editor,
      wrapperClassName,
      contentClassName,
      onContentChange, 
      placeholder,
      ...rest
    },
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
    }));

    // Update editable state if/when it changes
    useEffect(() => {
      if (!editor || editor.isDestroyed) return;

      queueMicrotask(() => {
        editor.setEditable(rest.editable ?? true);
      });
    }, [rest.editable, editor]);

    // Handle editor content change
    useEffect(() => {
      if (!editor) return;

      editor.on('update', () => {
        if (onContentChange) {
          const html = editor.getHTML();
          onContentChange(html); // Call the callback with the new content
        }
      });
    }, [editor, onContentChange]);

    if (!editor) return null;

    return (
      <div className={wrapperClassName}>
        {rest.editable && <LinkBubbleMenu editor={editor} />}
        <EditorContent
          editor={editor}
          className={contentClassName}
          onClick={(e) => {
            // Prevent event bubbling to avoid triggering toolbar buttons
            e.stopPropagation();
          }}
        />
      </div>
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;
