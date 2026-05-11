import { FolderPlus, LogOut, NotebookPen, Pin, Settings } from 'lucide-react'
import clsx from 'clsx'
import SearchBar from './SearchBar.jsx'
import GroupItem from './GroupItem.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useAuthStore } from '../store/useAuthStore.js'
import { useNotesStore } from '../store/useNotesStore.js'

export default function Sidebar({ open, onClose, onCreateGroup, onDeleteGroup }) {
  const { session, logout } = useAuthStore()
  const {
    groups,
    activeGroupId,
    query,
    setActiveGroup,
    setQuery,
    renameGroup,
  } = useNotesStore()

  return (
    <aside
      className={clsx(
        'glass-panel fixed inset-y-3 left-3 z-40 flex w-[min(21rem,calc(100vw-1.5rem))] flex-col rounded-[30px] p-4 transition-transform duration-300 lg:static lg:inset-auto lg:h-[calc(100svh-2rem)] lg:w-72 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-[110%]',
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <button className="flex items-center gap-3 text-left" type="button" onClick={onClose}>
          <div className="grid size-12 place-items-center rounded-3xl bg-white/14 text-mint shadow-inner light:bg-white/75">
            <NotebookPen size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Notepad Max</h1>
            <p className="text-xs text-white/46 light:text-slate-500">Fast glass notes</p>
          </div>
        </button>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <nav className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase text-white/36 light:text-slate-400">Library</span>
        </div>
        <button
          className={clsx('mb-1 flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm transition', activeGroupId === 'all' ? 'bg-white/18' : 'text-white/62 hover:bg-white/10 light:text-slate-600')}
          type="button"
          onClick={() => setActiveGroup('all')}
        >
          <NotebookPen size={17} /> All notes
        </button>
        <button
          className={clsx('mb-4 flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm transition', activeGroupId === 'pinned' ? 'bg-white/18' : 'text-white/62 hover:bg-white/10 light:text-slate-600')}
          type="button"
          onClick={() => setActiveGroup('pinned')}
        >
          <Pin size={17} /> Pinned
        </button>

        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-xs font-bold uppercase text-white/36 light:text-slate-400">Groups</span>
          <button className="grid size-8 place-items-center rounded-xl hover:bg-white/10" type="button" onClick={onCreateGroup} title="Create group" aria-label="Create group">
            <FolderPlus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {groups.map((group) => (
            <GroupItem
              active={activeGroupId === group.id}
              group={group}
              key={group.id}
              onDelete={onDeleteGroup}
              onRename={renameGroup}
              onSelect={() => setActiveGroup(group.id)}
            />
          ))}
        </div>
      </nav>

      <div className="mt-4 flex items-center gap-2 rounded-3xl bg-white/8 p-2 light:bg-white/48">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-mint/20 text-sm font-black text-mint">
          {(session?.user?.email || 'D').slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{session?.user?.email || 'Demo workspace'}</p>
          <p className="text-xs text-white/42 light:text-slate-500">Personal notes</p>
        </div>
        <ThemeToggle />
        <button className="icon-button" type="button" title="Settings" aria-label="Settings">
          <Settings size={17} />
        </button>
        <button className="icon-button" type="button" onClick={logout} title="Log out" aria-label="Log out">
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  )
}
