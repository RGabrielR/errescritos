import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
const CustomEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            TextStyle, // Add TextStyle extension
            Color.configure({ types: [TextStyle.name] }), // Configure Color with TextStyle
            Image,
          ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div>
              {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bubble-menu">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            Bold
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            Italic
          </button>

          {/* Highlight Button */}
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'is-active' : ''}
          >
            Highlight
          </button>

          {/* Color Selection Button */}
          <button
            onClick={() => editor.chain().focus().setColor('#ff0000').run()}
            style={{ color: '#ff0000' }}
            className={editor.isActive('textStyle', { color: '#ff0000' }) ? 'is-active' : ''}
          >
            Red Text
          </button>

          <button
            onClick={() => editor.chain().focus().setColor('#0000ff').run()}
            style={{ color: '#0000ff' }}
            className={editor.isActive('textStyle', { color: '#0000ff' }) ? 'is-active' : ''}
          >
            Blue Text
          </button>

          {/* Image Upload Button */}
          <button
            onClick={() => {
              const url = prompt('Enter image URL');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
          >
            Add Image
          </button>
        </BubbleMenu>
      )}
            <EditorContent editor={editor} />
        </div>
    );
};

export default CustomEditor;
