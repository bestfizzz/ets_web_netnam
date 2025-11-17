"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TextSearchBarProps {
  initialQuery?: string
  onSearch: (query: string) => void
}

export function TextSearchBar({ initialQuery = "", onSearch }: TextSearchBarProps) {
  const [query, setQuery] = useState(initialQuery)

  const handleSearch = () => {
    if (!query.trim()) return
    onSearch(query.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="relative w-full">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search photos (e.g., beach, portrait...)"
        className="pr-10" // leave space for the icon
      />
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  )
}
