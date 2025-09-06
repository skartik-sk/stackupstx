"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Command } from "lucide-react"

interface SearchSuggestion {
  id: string
  title: string
  type: "bounty" | "project" | "grant" | "idea"
  category?: string
}

const mockSuggestions: SearchSuggestion[] = [
  { id: "1", title: "Smart Contract Security Audit", type: "bounty", category: "Security" },
  { id: "2", title: "DeFi Protocol Development", type: "project", category: "DeFi" },
  { id: "3", title: "Education Grant Program", type: "grant", category: "Education" },
  { id: "4", title: "AI Code Review Tool", type: "idea", category: "Tools" },
]

export function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global search shortcut (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
      setQuery("")
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setSelectedIndex(-1)

    if (value.length > 1) {
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter((suggestion) =>
        suggestion.title.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex]
          handleSearch(suggestion.title)
        } else {
          handleSearch(query)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bounty":
        return "bg-blue-100 text-blue-800"
      case "project":
        return "bg-green-100 text-green-800"
      case "grant":
        return "bg-purple-100 text-purple-800"
      case "idea":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search... (⌘K)"
          className="pl-10 pr-12"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <div className="absolute right-3 top-3 flex items-center gap-1">
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-0">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className={`flex items-center justify-between p-3 cursor-pointer border-b last:border-b-0 ${
                  index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() => handleSearch(suggestion.title)}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{suggestion.title}</p>
                  {suggestion.category && <p className="text-xs text-muted-foreground">{suggestion.category}</p>}
                </div>
                <Badge variant="secondary" className={getTypeColor(suggestion.type)}>
                  {suggestion.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
