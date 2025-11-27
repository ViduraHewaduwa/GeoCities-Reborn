import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import './WYSIWYGEditor.css'

interface WYSIWYGEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function WYSIWYGEditor({ content, onChange }: WYSIWYGEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const addImageFromUrl = () => {
    const url = prompt('Enter image URL:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="wysiwyg-editor">
      <div className="editor-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="toolbar-divider"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
          title="Paragraph"
        >
          P
        </button>
        <div className="toolbar-divider"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="toolbar-divider"></div>
        <input
          type="color"
          onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          title="Text Color"
          className="color-picker"
        />
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          title="Clear Color"
        >
          Clear Color
        </button>
        <div className="toolbar-divider"></div>
        <button
          onClick={addImageFromUrl}
          title="Add Image from URL"
        >
          🖼️ Image URL
        </button>
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}
