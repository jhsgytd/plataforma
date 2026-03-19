"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"

type ThemeMode = "dark" | "light"
type ThemeScope = "admin" | "dashboard"

const STORAGE_KEYS: Record<ThemeScope, string> = {
  admin: "he-theme-admin",
  dashboard: "he-theme-dashboard",
}

function applyTheme(theme: ThemeMode) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

export default function ThemeToggle({ scope }: { scope: ThemeScope }) {
  const [theme, setTheme] = useState<ThemeMode>("dark")

  useEffect(() => {
    const key = STORAGE_KEYS[scope]
    const stored = localStorage.getItem(key)
    const initial = stored === "light" || stored === "dark" ? stored : "dark"
    setTheme(initial)
    applyTheme(initial)
  }, [scope])

  const onToggle = (checked: boolean) => {
    const next = checked ? "dark" : "light"
    setTheme(next)
    localStorage.setItem(STORAGE_KEYS[scope], next)
    applyTheme(next)
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border">
      <Sun className={`w-4 h-4 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
      <Switch checked={theme === "dark"} onCheckedChange={onToggle} aria-label="Cambiar tema" />
      <Moon className={`w-4 h-4 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
    </div>
  )
}
