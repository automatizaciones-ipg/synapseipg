'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string // ✅ Opcional para hacerlo dinámico
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative w-full md:w-[300px]">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <Input
        placeholder={placeholder || "Buscar..."}
        className="pl-9 bg-white border-slate-200 focus-visible:ring-slate-900 transition-all duration-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}