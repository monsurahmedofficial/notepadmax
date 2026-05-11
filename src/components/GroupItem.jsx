import { Folder, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

export default function GroupItem({ group, active, onSelect, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [name, setName] = useState(group.name)

  function saveName() {
    const next = name.trim()
    if (next && next !== group.name) onRename(group.id, next)
    setEditing(false)
  }

  return (
    <div className="relative">
      <button
        className={clsx(
          'group flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm transition',
          active ? 'bg-white/18 text-white light:bg-slate-950/8 light:text-slate-950' : 'text-white/62 hover:bg-white/10 light:text-slate-600 light:hover:bg-white/55',
        )}
        type="button"
        onClick={onSelect}
      >
        <Folder size={17} />
        {editing ? (
          <input
            autoFocus
            className="min-w-0 flex-1 bg-transparent outline-none"
            value={name}
            onBlur={saveName}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') saveName()
              if (event.key === 'Escape') setEditing(false)
            }}
          />
        ) : (
          <span className="min-w-0 flex-1 truncate">{group.name}</span>
        )}
        <span
          className="grid size-7 place-items-center rounded-xl opacity-0 transition hover:bg-white/12 group-hover:opacity-100"
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen((value) => !value)
          }}
        >
          <MoreHorizontal size={16} />
        </span>
      </button>
      {menuOpen && (
        <div className="glass-panel absolute right-1 top-10 z-20 w-36 overflow-hidden rounded-2xl p-1">
          <button
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/12"
            type="button"
            onClick={() => {
              setMenuOpen(false)
              setEditing(true)
            }}
          >
            <Pencil size={15} /> Rename
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-coral hover:bg-white/12"
            type="button"
            onClick={() => {
              setMenuOpen(false)
              onDelete(group)
            }}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}
