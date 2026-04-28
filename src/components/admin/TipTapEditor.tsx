'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback } from 'react'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function TipTapEditor({ content, onChange, placeholder = '본문을 입력하세요...' }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[320px] p-4 focus:outline-none text-gray-800 text-sm leading-relaxed',
      },
    },
  })

  const addImage = useCallback(() => {
    const url = window.prompt('이미지 URL을 입력하세요:')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href
    const url = window.prompt('링크 URL:', prev)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const btnBase = 'px-2.5 py-1.5 rounded text-xs font-semibold transition-colors'
  const btnActive = 'bg-rose-500 text-white'
  const btnInactive = 'bg-gray-100 text-gray-700 hover:bg-gray-200'

  const isActive = (name: string, attrs?: object) =>
    editor.isActive(name, attrs) ? btnActive : btnInactive

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btnBase} ${isActive('bold')}`}
          title="굵게"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btnBase} italic ${isActive('italic')}`}
          title="기울임"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${btnBase} line-through ${isActive('strike')}`}
          title="취소선"
        >
          S
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${btnBase} ${isActive('heading', { level: 2 })}`}
          title="제목 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${btnBase} ${isActive('heading', { level: 3 })}`}
          title="제목 3"
        >
          H3
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btnBase} ${isActive('bulletList')}`}
          title="글머리 목록"
        >
          UL
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btnBase} ${isActive('orderedList')}`}
          title="번호 목록"
        >
          OL
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${btnBase} ${isActive('blockquote')}`}
          title="인용문"
        >
          ❝
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${btnBase} font-mono ${isActive('code')}`}
          title="인라인 코드"
        >
          {'</>'}
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`${btnBase} ${isActive('link')}`}
          title="링크 삽입"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={addImage}
          className={`${btnBase} ${btnInactive}`}
          title="이미지 삽입"
        >
          🖼
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${btnBase} ${btnInactive} disabled:opacity-40`}
          title="실행 취소"
        >
          ↩
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${btnBase} ${btnInactive} disabled:opacity-40`}
          title="다시 실행"
        >
          ↪
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  )
}
