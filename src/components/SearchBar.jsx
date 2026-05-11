import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/42 light:text-slate-500" size={18} />
      <input
        className="field h-12 pl-11 pr-4 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search notes"
        type="search"
      />
    </label>
  )
}
