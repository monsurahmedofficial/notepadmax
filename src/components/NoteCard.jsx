import { Pin } from 'lucide-react'
import clsx from 'clsx'
import { formatDate, stripHtml } from '../lib/format.js'

export default function NoteCard({ note, active, groupName, onSelect }) {
  const preview = stripHtml(note.content) || 'No content yet'

  return (
    <button
      className={clsx(
        'w-full rounded-[24px] border p-4 text-left transition duration-200',
        active
          ? 'border-mint/40 bg-white/16 shadow-2xl shadow-black/10 light:bg-white/78'
          : 'border-white/10 bg-white/7 hover:-translate-y-0.5 hover:bg-white/12 light:border-white/70 light:bg-white/46 light:hover:bg-white/72',
      )}
      type="button"
      onClick={onSelect}
    >
      <div className="mb-3 flex items-start gap-3">
        <h3 className="min-w-0 flex-1 truncate text-base font-bold">{note.title || 'Untitled note'}</h3>
        {note.pinned && <Pin className="mt-0.5 shrink-0 text-mint" fill="currentColor" size={15} />}
      </div>
      <p className="line-clamp-2 min-h-10 text-sm leading-5 text-white/52 light:text-slate-500">{preview}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-white/38 light:text-slate-400">
        <span className="truncate">{groupName || 'No group'}</span>
        <time>{formatDate(note.updated_at)}</time>
      </div>
    </button>
  )
}
