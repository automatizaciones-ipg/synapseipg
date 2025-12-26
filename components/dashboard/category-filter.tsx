'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils" 

interface CategoryFilterProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
  categories: string[] // ✅ Aceptamos las categorías dinámicas
}

export function CategoryFilter({ selectedCategory, onSelectCategory, categories }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat
        return (
          <Button
            key={cat}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(cat)}
            className={cn(
              "rounded-full text-xs h-8 px-4 transition-all duration-200",
              isActive 
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm" 
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {cat}
          </Button>
        )
      })}
    </div>
  )
}