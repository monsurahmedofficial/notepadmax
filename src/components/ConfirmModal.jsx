import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass-panel w-full max-w-md rounded-[28px] p-6"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-coral/18 text-coral">
            <AlertTriangle size={21} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-white/54 light:text-slate-500">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button className="rounded-2xl px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 light:text-slate-600" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="rounded-2xl bg-coral px-4 py-2 text-sm font-bold text-slate-950" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
