"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

type ThemeMode = "dark" | "light"
type ThemeScope = "admin" | "dashboard"

const STORAGE_KEYS: Record<ThemeScope, string> = {
  admin: "he-theme-admin",
  dashboard: "he-theme-dashboard",
}

const getScope = (path: string): ThemeScope | null => {
  if (path.startsWith("/admin")) return "admin"
  if (path.startsWith("/dashboard")) return "dashboard"
  return null
}

export default function ThemeGuard() {
  const pathname = usePathname()

  useEffect(() => {
    const scope = getScope(pathname)
    if (!scope) {
      localStorage.removeItem(STORAGE_KEYS.admin)
      localStorage.removeItem(STORAGE_KEYS.dashboard)
      document.documentElement.classList.add("dark")
      return
    }

    const stored = localStorage.getItem(STORAGE_KEYS[scope])
    const theme: ThemeMode = stored === "light" || stored === "dark" ? stored : "dark"
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [pathname])

  return null
}
