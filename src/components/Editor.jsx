import { Bold, Heading1, Heading2, Italic, List, Pin, Save, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import ConfirmModal from './ConfirmModal.jsx'
import { formatDate } from '../lib/format.js'
import { useNotesStore } from '../store/useNotesStore.js'

const commands = [
  { label: 'Bold', icon: Bold, command: 'bold' },
  { label: 'Italic', icon: Italic, command: 'italic' },
  { label: 'Heading 1', icon: Heading1, command: 'formatBlock', value: 'h1' },
  { label: 'Heading 2', icon: Heading2, command: 'formatBlock', value: 'h2' },
  { label: 'Bullet list', icon: List, command: 'insertUnorderedList' },
]

export default function Editor() {
  const { notes, activeNoteId } = useNotesStore()
  const note = notes.find((item) => item.id === activeNoteId)

  if (!note) {
    return (
      <section className="glass-panel grid min-h-[55svh] flex-1 place-items-center rounded-[30px] p-6 text-center lg:h-[calc(100svh-2rem)]">
        <div>
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-[28px] bg-white/10 text-mint">
            <Save size={26} />
          </div>
          <h2 className="text-2xl font-black">Create your first note</h2>
          <p className="mt-2 text-sm text-white/48 light:text-slate-500">A blank page is waiting.</p>
        </div>
      </section>
    )
  }

  return <NoteEditor key={note.id} note={note} />
}

function NoteEditor({ note }) {
  const editorRef = useRef(null)
  const [draft, setDraft] = useState({
    title: note.title || '',
    content: note.content?.includes('<') ? note.content.replace(/<li>/g, '- ').replace(/<[^>]+>/g, '\n').replace(/\n{3,}/g, '\n\n').trim() : note.content || '',
    group_id: note.group_id || '',
  })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { groups, saveState, updateNote, deleteNote } = useNotesStore()
  const activeGroup = groups.find((group) => group.id === note?.group_id)

  useEffect(() => {
    const changed = draft.title !== note.title || draft.content !== note.content || (draft.group_id || null) !== note.group_id
    if (!changed) return

    const timer = window.setTimeout(() => {
      updateNote(note.id, {
        title: draft.title || 'Untitled note',
        content: draft.content,
        group_id: draft.group_id || null,
      })
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [draft, note.id, note.title, note.content, note.group_id, updateNote])

  const wordCount = draft.content
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  function runCommand(command, value) {
    const editor = editorRef.current
    if (!editor) return

    const start = editor.selectionStart
    const end = editor.selectionEnd
    const selected = draft.content.slice(start, end)
    const before = draft.content.slice(0, start)
    const after = draft.content.slice(end)

    const transforms = {
      bold: [`**${selected || 'bold text'}**`, selected ? 2 : 2, selected ? 2 + selected.length : 11],
      italic: [`_${selected || 'italic text'}_`, selected ? 1 : 1, selected ? 1 + selected.length : 12],
      insertUnorderedList: [`- ${selected || 'List item'}`, 2, selected ? 2 + selected.length : 11],
      formatBlock: value === 'h1' ? [`# ${selected || 'Heading'}`, 2, selected ? 2 + selected.length : 9] : [`## ${selected || 'Heading'}`, 3, selected ? 3 + selected.length : 10],
    }

    const [insert, selectionStart, selectionEnd] = transforms[command]
    const content = `${before}${insert}${after}`
    setDraft((current) => ({ ...current, content }))

    requestAnimationFrame(() => {
      editor.focus()
      editor.setSelectionRange(start + selectionStart, start + selectionEnd)
    })
  }

  return (
    <section className="glass-panel flex min-h-[70svh] flex-1 flex-col overflow-hidden rounded-[30px] lg:h-[calc(100svh-2rem)]">
      <header className="flex flex-wrap items-center gap-3 border-b border-white/10 p-4 light:border-slate-950/10">
        <div className="flex gap-2">
          {commands.map((item) => {
            const Icon = item.icon
            return (
              <button
                className="icon-button"
                key={item.label}
                type="button"
                title={item.label}
                aria-label={item.label}
                onClick={() => runCommand(item.command, item.value)}
              >
                <Icon size={17} />
              </button>
            )
          })}
        </div>

        <select
          className="field select-field h-10 w-40 rounded-2xl px-3 text-sm"
          value={draft.group_id}
          onChange={(event) => setDraft((current) => ({ ...current, group_id: event.target.value }))}
        >
          <option value="">No group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button
            className={clsx('icon-button', note.pinned && 'bg-mint/20 text-mint')}
            type="button"
            title="Pin note"
            aria-label="Pin note"
            onClick={() => updateNote(note.id, { pinned: !note.pinned })}
          >
            <Pin fill={note.pinned ? 'currentColor' : 'none'} size={17} />
          </button>
          <button className="icon-button text-coral" type="button" title="Delete note" aria-label="Delete note" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={17} />
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-7">
        <input
          className="mb-5 w-full bg-transparent text-4xl font-black leading-tight tracking-tight outline-none placeholder:text-white/28 md:text-5xl"
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          placeholder="Untitled note"
        />
        <textarea
          ref={editorRef}
          className="min-h-[44svh] w-full resize-none bg-transparent text-base leading-7 text-white/78 outline-none placeholder:text-white/30 light:text-slate-700 light:placeholder:text-slate-400"
          value={draft.content}
          onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
          placeholder="Start writing..."
        />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-sm text-white/44 light:border-slate-950/10 light:text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-2 rounded-full bg-mint" />
          <span>{saveState}</span>
        </div>
        <div className="flex gap-4">
          <span>{wordCount} words</span>
          <span>{activeGroup?.name || 'No group'}</span>
          <span>Updated {formatDate(note.updated_at)}</span>
        </div>
      </footer>

      {confirmDelete && (
        <ConfirmModal
          title="Delete note?"
          message="This note will be removed from your workspace."
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteNote(note.id)
            setConfirmDelete(false)
          }}
        />
      )}
    </section>
  )
}
