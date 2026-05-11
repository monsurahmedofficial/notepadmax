import { motion } from 'framer-motion'
import { LockKeyhole, Mail, NotebookPen, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { canUseLocalDemo, isSupabaseConfigured } from '../lib/supabase.js'
import { useAuthStore } from '../store/useAuthStore.js'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('demo@notepad.max')
  const [password, setPassword] = useState('notepadmax')
  const { session, loading, error, login, register } = useAuthStore()
  const navigate = useNavigate()

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    const action = mode === 'login' ? login : register
    await action({ email, password })
    navigate('/')
  }

  return (
    <main className="grid min-h-svh place-items-center px-4 py-8">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel grid w-full max-w-5xl overflow-hidden rounded-[36px] md:grid-cols-[1.05fr_0.95fr]"
        initial={{ opacity: 0, y: 16 }}
      >
        <div className="relative min-h-[34rem] p-8 md:p-10">
          <div className="mb-14 flex items-center gap-3">
            <div className="grid size-13 place-items-center rounded-[24px] bg-white/14 text-mint">
              <NotebookPen size={27} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Notepad Max</h1>
              <p className="text-sm text-white/50 light:text-slate-500">Apple-inspired glass notes</p>
            </div>
          </div>

          <div className="max-w-md">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/64 light:text-slate-600">
              <Sparkles size={16} /> Fast, focused, deployment-ready
            </div>
            <h2 className="text-5xl font-black leading-[1.03] tracking-tight md:text-6xl">Write quickly. Organize calmly.</h2>
            <p className="mt-5 text-base leading-7 text-white/56 light:text-slate-600">
              A premium notepad workspace with pinned notes, groups, search, autosave, and Supabase storage.
            </p>
          </div>

          {canUseLocalDemo && (
            <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-mint/20 bg-mint/10 p-4 text-sm text-mint">
              Development demo mode is active. Production on Vercel requires Supabase env keys.
            </div>
          )}
        </div>

        <form className="m-3 rounded-[30px] border border-white/12 bg-black/16 p-5 md:p-8 light:bg-white/42" onSubmit={handleSubmit}>
          <div className="mb-8 flex rounded-[22px] bg-white/8 p-1">
            {['login', 'register'].map((item) => (
              <button
                className={`h-11 flex-1 rounded-[18px] text-sm font-bold transition ${mode === item ? 'bg-white/18 text-white light:bg-white light:text-slate-950' : 'text-white/50 light:text-slate-500'}`}
                key={item}
                type="button"
                onClick={() => setMode(item)}
              >
                {item === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-semibold text-white/58 light:text-slate-600">Email</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/38" size={18} />
              <input className="field h-13 pl-12 pr-4" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
          </label>

          <label className="mb-5 block">
            <span className="mb-2 block text-sm font-semibold text-white/58 light:text-slate-600">Password</span>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-white/38" size={18} />
              <input className="field h-13 pl-12 pr-4" minLength={6} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
          </label>

          {error && <p className="mb-4 rounded-2xl bg-coral/12 px-4 py-3 text-sm text-coral">{error}</p>}

          <button className="primary-button h-13 w-full" disabled={loading} type="submit">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>

          <p className="mt-5 text-center text-sm text-white/42 light:text-slate-500">
            {isSupabaseConfigured ? 'Session persists with Supabase Auth.' : canUseLocalDemo ? 'Dev demo accepts any email and password.' : 'Add Supabase env vars in Vercel to enable auth.'}
          </p>
        </form>
      </motion.section>
    </main>
  )
}
