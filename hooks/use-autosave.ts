"use client"

import { useEffect, useRef, useCallback } from "react"
import { useEditorStore } from "@/lib/editor-store"

const AUTOSAVE_INTERVAL = 30000 // 30 seconds

export function useAutosave() {
  const { saveProject, hasUnsavedChanges, setHasUnsavedChanges } = useEditorStore()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSaveRef = useRef<number>(Date.now())

  const performSave = useCallback(() => {
    if (hasUnsavedChanges) {
      saveProject()
      lastSaveRef.current = Date.now()
    }
  }, [hasUnsavedChanges, saveProject])

  // Auto-save interval
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      performSave()
    }, AUTOSAVE_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [performSave])

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        performSave()
        e.preventDefault()
        e.returnValue = "Tienes cambios sin guardar. Estas seguro que quieres salir?"
        return e.returnValue
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges, performSave])

  // Visibility change - save when tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && hasUnsavedChanges) {
        performSave()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [hasUnsavedChanges, performSave])

  return {
    performSave,
    lastSave: lastSaveRef.current,
  }
}
