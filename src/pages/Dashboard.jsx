import { useEffect, useState } from 'react'
import ConfirmModal from '../components/ConfirmModal.jsx'
import Editor from '../components/Editor.jsx'
import NotesList from '../components/NotesList.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useAuthStore } from '../store/useAuthStore.js'
import { useNotesStore } from '../store/useNotesStore.js'
import { useThemeStore } from '../store/useThemeStore.js'

export default function Dashboard() {
  const session = useAuthStore((state) => state.session)
  const { initialize: initializeTheme } = useThemeStore()
  const { loadWorkspace, createGroup, deleteGroup, loading } = useNotesStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState(null)

  useEffect(() => {
    initializeTheme()
  }, [initializeTheme])

  useEffect(() => {
    if (session) loadWorkspace(session)
  }, [session, loadWorkspace])

  function handleCreateGroup() {
    const name = window.prompt('Group name')
    if (name?.trim()) createGroup(session, name.trim())
  }

  return (
    <main className="min-h-svh p-3 lg:p-4">
      <div className="mx-auto flex max-w-[95rem] gap-4">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCreateGroup={handleCreateGroup}
          onDeleteGroup={setGroupToDelete}
        />
        {sidebarOpen && <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" type="button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />}
        <div className="grid min-w-0 flex-1 gap-4 lg:grid-cols-[24rem_minmax(0,1fr)]">
          <NotesList onOpenSidebar={() => setSidebarOpen(true)} />
          {loading ? (
            <section className="glass-panel grid min-h-[70svh] place-items-center rounded-[30px]">
              <p className="text-white/54">Loading workspace...</p>
            </section>
          ) : (
            <Editor />
          )}
        </div>
      </div>
      {groupToDelete && (
        <ConfirmModal
          title="Delete group?"
          message={`Notes in ${groupToDelete.name} will stay in your library without a group.`}
          onCancel={() => setGroupToDelete(null)}
          onConfirm={() => {
            deleteGroup(groupToDelete.id)
            setGroupToDelete(null)
          }}
        />
      )}
    </main>
  )
}
