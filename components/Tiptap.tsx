'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { useState } from 'react'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Link.configure({
        openOnClick: false, // Links won't open in a new tab when clicked
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<p>Let\'s create an amazing rich text editor! 🌟</p>',
  })

  const [link, setLink] = useState('')

  const setLinkHandler = () => {
    if (link) {
      editor.chain().focus().setLink({ href: link }).run()
      setLink('')
    } else {
      editor.chain().focus().unsetLink().run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}>Underline</button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'active' : ''}>Strikethrough</button>
        
        {/* Heading options */}
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}>H3</button>
        
        {/* Text alignment */}
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}>Left</button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}>Center</button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}>Right</button>

        {/* Links */}
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Insert link"
        />
        <button onClick={setLinkHandler}>
          {editor.isActive('link') ? 'Unlink' : 'Set Link'}
        </button>

        {/* Images */}
        <button onClick={() => {
          const url = window.prompt('Enter image URL')
          if (url) editor.chain().focus().setImage({ src: url }).run()
        }}>Add Image</button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
      
      <style jsx>{`
        .toolbar {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .toolbar button {
          padding: 4px 8px;
          border: 1px solid #ccc;
          background-color: #f0f0f0;
          cursor: pointer;
        }

        .toolbar button.active {
          background-color: #000;
          color: white;
        }

        .editor-container {
          border: 1px solid #ddd;
          padding: 16px;
          border-radius: 8px;
        }

        .toolbar input {
          padding: 4px;
          border: 1px solid #ddd;
        }
      `}</style>
    </div>
  )
}

export default Tiptap
