const DB_KEY = 'notepad-max-local-db'

const seedUser = {
  id: 'local-user',
  email: 'demo@notepad.max',
}

function readDb() {
  const fallback = {
    users: [seedUser],
    groups: [
      {
        id: 'group-inbox',
        user_id: seedUser.id,
        name: 'Inbox',
        created_at: new Date().toISOString(),
      },
    ],
    notes: [
      {
        id: 'note-welcome',
        user_id: seedUser.id,
        group_id: 'group-inbox',
        title: 'Welcome to Notepad Max',
        content:
          '<h1>A calm place for fast notes</h1><p>Create groups, pin important notes, and keep writing. Connect Supabase env keys when you are ready for cloud sync.</p><ul><li>Autosaves after one second</li><li>Searches title and content instantly</li></ul>',
        pinned: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  }

  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || fallback
  } catch {
    return fallback
  }
}

function writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export const localDatabase = {
  seedUser,
  signIn(email) {
    const db = readDb()
    const user = db.users.find((item) => item.email === email) || { id: seedUser.id, email }
    if (!db.users.some((item) => item.email === email)) {
      db.users.push(user)
      writeDb(db)
    }
    return { user, access_token: `local-${user.id}` }
  },
  signOut() {
    localStorage.removeItem('notepad-max-local-session')
  },
  getSession() {
    try {
      return JSON.parse(localStorage.getItem('notepad-max-local-session'))
    } catch {
      return null
    }
  },
  setSession(session) {
    localStorage.setItem('notepad-max-local-session', JSON.stringify(session))
  },
  listGroups(userId) {
    return readDb()
      .groups.filter((group) => group.user_id === userId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
  },
  listNotes(userId) {
    return readDb()
      .notes.filter((note) => note.user_id === userId)
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updated_at.localeCompare(a.updated_at))
  },
  upsertGroup(group) {
    const db = readDb()
    const index = db.groups.findIndex((item) => item.id === group.id)
    if (index >= 0) db.groups[index] = { ...db.groups[index], ...group }
    else db.groups.push(group)
    writeDb(db)
    return group
  },
  deleteGroup(groupId) {
    const db = readDb()
    db.groups = db.groups.filter((group) => group.id !== groupId)
    db.notes = db.notes.map((note) => (note.group_id === groupId ? { ...note, group_id: null } : note))
    writeDb(db)
  },
  upsertNote(note) {
    const db = readDb()
    const index = db.notes.findIndex((item) => item.id === note.id)
    if (index >= 0) db.notes[index] = { ...db.notes[index], ...note }
    else db.notes.push(note)
    writeDb(db)
    return note
  },
  deleteNote(noteId) {
    const db = readDb()
    db.notes = db.notes.filter((note) => note.id !== noteId)
    writeDb(db)
  },
}
