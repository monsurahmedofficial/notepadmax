import { uid } from '../lib/format.js'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import { localDatabase } from './localDatabase.js'

function currentUserId(session) {
  return session?.user?.id || session?.user?.sub || 'local-user'
}

export async function fetchWorkspace(session) {
  const userId = currentUserId(session)

  if (!isSupabaseConfigured) {
    return {
      groups: localDatabase.listGroups(userId),
      notes: localDatabase.listNotes(userId),
    }
  }

  const [groupsResult, notesResult] = await Promise.all([
    supabase.from('groups').select('*').order('created_at', { ascending: true }),
    supabase.from('notes').select('*').order('pinned', { ascending: false }).order('updated_at', { ascending: false }),
  ])

  if (groupsResult.error) throw groupsResult.error
  if (notesResult.error) throw notesResult.error

  return {
    groups: groupsResult.data,
    notes: notesResult.data,
  }
}

export async function createGroup(session, name) {
  const group = {
    id: uid('group'),
    user_id: currentUserId(session),
    name,
    created_at: new Date().toISOString(),
  }

  if (!isSupabaseConfigured) return localDatabase.upsertGroup(group)

  const { data, error } = await supabase.from('groups').insert(group).select().single()
  if (error) throw error
  return data
}

export async function renameGroup(groupId, name) {
  if (!isSupabaseConfigured) return localDatabase.upsertGroup({ id: groupId, name })

  const { data, error } = await supabase.from('groups').update({ name }).eq('id', groupId).select().single()
  if (error) throw error
  return data
}

export async function removeGroup(groupId) {
  if (!isSupabaseConfigured) return localDatabase.deleteGroup(groupId)

  const { error } = await supabase.from('groups').delete().eq('id', groupId)
  if (error) throw error
}

export async function createNote(session, groupId) {
  const now = new Date().toISOString()
  const note = {
    id: uid('note'),
    user_id: currentUserId(session),
    group_id: groupId || null,
    title: 'Untitled note',
    content: '',
    pinned: false,
    created_at: now,
    updated_at: now,
  }

  if (!isSupabaseConfigured) return localDatabase.upsertNote(note)

  const { data, error } = await supabase.from('notes').insert(note).select().single()
  if (error) throw error
  return data
}

export async function updateNote(noteId, changes) {
  const payload = { ...changes, updated_at: new Date().toISOString() }

  if (!isSupabaseConfigured) return localDatabase.upsertNote({ id: noteId, ...payload })

  const { data, error } = await supabase.from('notes').update(payload).eq('id', noteId).select().single()
  if (error) throw error
  return data
}

export async function removeNote(noteId) {
  if (!isSupabaseConfigured) return localDatabase.deleteNote(noteId)

  const { error } = await supabase.from('notes').delete().eq('id', noteId)
  if (error) throw error
}
