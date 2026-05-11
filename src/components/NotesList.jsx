import { AnimatePresence, motion } from 'framer-motion'
import { FilePlus2, Menu, SearchX } from 'lucide-react'
import NoteCard from './NoteCard.jsx'
import { stripHtml } from '../lib/format.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { useNotesStore } from '../store/useNotesStore.js'

export default function NotesList({ onOpenSidebar }) {
  const session = useAuthStore((state) => state.session)
  const {
    notes,
    groups,
    activeNoteId,
    activeGroupId,
    query,
    setActiveNote,
    createNote,
  } = useNotesStore()

  const normalizedQuery = query.trim().toLowerCase()
  const visibleNotes = notes.filter((note) => {
    const matchesGroup =
      activeGroupId === 'all' ||
      (activeGroupId === 'pinned' && note.pinned) ||
      note.group_id === activeGroupId
    const matchesSearch =
      !normalizedQuery ||
      note.title?.toLowerCase().includes(normalizedQuery) ||
      stripHtml(note.content).toLowerCase().includes(normalizedQuery)
    return matchesGroup && matchesSearch
  })

  const pinned = visibleNotes.filter((note) => note.pinned)
  const regular = visibleNotes.filter((note) => !note.pinned)

  function groupName(id) {
    return groups.find((group) => group.id === id)?.name
  }

  return (
    <section className="glass-panel flex min-h-0 flex-col rounded-[30px] p-4 lg:h-[calc(100svh-2rem)] lg:w-96">
      <header className="mb-4 flex items-center justify-between gap-3">
        <button className="icon-button lg:hidden" type="button" onClick={onOpenSidebar} title="Open sidebar" aria-label="Open sidebar">
          <Menu size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase text-white/38 light:text-slate-400">{visibleNotes.length} notes</p>
          <h2 className="truncate text-2xl font-black tracking-tight">
            {activeGroupId === 'all' ? 'All notes' : activeGroupId === 'pinned' ? 'Pinned notes' : groupName(activeGroupId)}
          </h2>
        </div>
        <button className="primary-button h-12 px-4" type="button" onClick={() => createNote(session)}>
          <FilePlus2 size={18} /> New
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {visibleNotes.length === 0 ? (
          <div className="grid h-full min-h-72 place-items-center rounded-[26px] border border-dashed border-white/14 text-center light:border-slate-950/10">
            <div>
              <SearchX className="mx-auto mb-3 text-white/36 light:text-slate-400" size={34} />
              <h3 className="font-bold">No notes yet</h3>
              <p className="mt-1 text-sm text-white/46 light:text-slate-500">Create your first note</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {pinned.length > 0 && <p className="px-2 text-xs font-bold uppercase text-white/36 light:text-slate-400">Pinned</p>}
            <AnimatePresence initial={false}>
              {[...pinned, ...regular].map((note) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={note.id}
                  layout
                >
                  <NoteCard active={activeNoteId === note.id} groupName={groupName(note.group_id)} note={note} onSelect={() => setActiveNote(note.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
