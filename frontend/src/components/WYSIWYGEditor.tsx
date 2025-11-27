import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import { useRef, useState } from 'react'
import './WYSIWYGEditor.css'

interface WYSIWYGEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function WYSIWYGEditor({ content, onChange }: WYSIWYGEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      const fileUrl = `http://localhost:3001${data.url}`

      // Check if it's an image or video
      if (file.type.startsWith('image/')) {
        editor.chain().focus().setImage({ src: fileUrl }).run()
      } else if (file.type.startsWith('video/')) {
        // Insert video as HTML
        editor.chain().focus().insertContent(
          `<video controls width="100%" style="max-width: 600px;"><source src="${fileUrl}" type="${file.type}">Your browser does not support the video tag.</video>`
        ).run()
      } else {
        // Insert as download link for other files
        editor.chain().focus().insertContent(
          `<a href="${fileUrl}" download="${data.filename}">${data.filename}</a>`
        ).run()
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

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
          onClick={() => fileInputRef.current?.click()}
          title="Upload Image/Video/File"
          disabled={uploading}
        >
          {uploading ? '⏳ Uploading...' : '📁 Upload'}
        </button>
        <button
          onClick={addImageFromUrl}
          title="Add Image from URL"
        >
          🖼️ Image URL
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}
