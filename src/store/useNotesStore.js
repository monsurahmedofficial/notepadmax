import { create } from 'zustand'
import * as notesService from '../services/notesService.js'

export const useNotesStore = create((set, get) => ({
  notes: [],
  groups: [],
  activeNoteId: null,
  activeGroupId: 'all',
  query: '',
  loading: false,
  saveState: 'Saved',
  error: '',
  loadWorkspace: async (session) => {
    set({ loading: true, error: '' })
    try {
      const { groups, notes } = await notesService.fetchWorkspace(session)
      set({
        groups,
        notes,
        activeNoteId: notes[0]?.id || null,
        loading: false,
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  setActiveNote: (activeNoteId) => set({ activeNoteId }),
  setActiveGroup: (activeGroupId) => set({ activeGroupId }),
  setQuery: (query) => set({ query }),
  createGroup: async (session, name) => {
    const group = await notesService.createGroup(session, name)
    set((state) => ({ groups: [...state.groups, group], activeGroupId: group.id }))
  },
  renameGroup: async (groupId, name) => {
    const previous = get().groups
    set({ groups: previous.map((group) => (group.id === groupId ? { ...group, name } : group)) })
    try {
      const group = await notesService.renameGroup(groupId, name)
      set((state) => ({ groups: state.groups.map((item) => (item.id === groupId ? group : item)) }))
    } catch (error) {
      set({ groups: previous, error: error.message })
    }
  },
  deleteGroup: async (groupId) => {
    const previous = { groups: get().groups, notes: get().notes, activeGroupId: get().activeGroupId }
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== groupId),
      notes: state.notes.map((note) => (note.group_id === groupId ? { ...note, group_id: null } : note)),
      activeGroupId: state.activeGroupId === groupId ? 'all' : state.activeGroupId,
    }))
    try {
      await notesService.removeGroup(groupId)
    } catch (error) {
      set({ ...previous, error: error.message })
    }
  },
  createNote: async (session) => {
    const state = get()
    const groupId = state.activeGroupId === 'all' || state.activeGroupId === 'pinned' ? null : state.activeGroupId
    const note = await notesService.createNote(session, groupId)
    set((current) => ({
      notes: [note, ...current.notes],
      activeNoteId: note.id,
    }))
  },
  updateNote: async (noteId, changes) => {
    set({ saveState: 'Saving...' })
    const previous = get().notes
    const optimistic = { ...changes, updated_at: new Date().toISOString() }
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, ...optimistic } : note)),
    }))

    try {
      const note = await notesService.updateNote(noteId, changes)
      set((state) => ({
        notes: state.notes.map((item) => (item.id === noteId ? note : item)),
        saveState: 'Saved',
      }))
    } catch (error) {
      set({ notes: previous, saveState: 'Save failed', error: error.message })
    }
  },
  deleteNote: async (noteId) => {
    const previous = { notes: get().notes, activeNoteId: get().activeNoteId }
    set((state) => {
      const notes = state.notes.filter((note) => note.id !== noteId)
      return {
        notes,
        activeNoteId: state.activeNoteId === noteId ? notes[0]?.id || null : state.activeNoteId,
      }
    })
    try {
      await notesService.removeNote(noteId)
    } catch (error) {
      set({ ...previous, error: error.message })
    }
  },
}))
