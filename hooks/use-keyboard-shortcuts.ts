'use client'

import { useEffect, useCallback } from 'react'
import { useEditorStore } from '@/lib/editor-store'

export function useKeyboardShortcuts() {
  const {
    selectedElementId,
    selectedSectionId,
    getCurrentPage,
    deleteElement,
    copyElement,
    pasteElement,
    cutElement,
    duplicateElement,
    undo,
    redo,
    selectElement,
    setZoom,
    zoom,
    togglePreviewMode,
    toggleGrid,
    saveProject
  } = useEditorStore()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentPage = getCurrentPage()
    
    // Ignore if typing in an input
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement).contentEditable === 'true'
    ) {
      return
    }

    const isCtrlOrCmd = e.ctrlKey || e.metaKey

    // Delete selected element
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
      e.preventDefault()
      deleteElement(selectedElementId)
    }

    // Copy (Ctrl+C)
    if (isCtrlOrCmd && e.key === 'c' && selectedElementId) {
      e.preventDefault()
      copyElement(selectedElementId)
    }

    // Paste (Ctrl+V)
    if (isCtrlOrCmd && e.key === 'v' && currentPage) {
      e.preventDefault()
      const targetSection = selectedSectionId || currentPage.sections[0]?.id
      if (targetSection) {
        pasteElement(targetSection)
      }
    }

    // Cut (Ctrl+X)
    if (isCtrlOrCmd && e.key === 'x' && selectedElementId) {
      e.preventDefault()
      cutElement(selectedElementId)
    }

    // Duplicate (Ctrl+D)
    if (isCtrlOrCmd && e.key === 'd' && selectedElementId) {
      e.preventDefault()
      duplicateElement(selectedElementId)
    }

    // Undo (Ctrl+Z)
    if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      undo()
    }

    // Redo (Ctrl+Shift+Z or Ctrl+Y)
    if (isCtrlOrCmd && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault()
      redo()
    }

    // Save (Ctrl+S)
    if (isCtrlOrCmd && e.key === 's') {
      e.preventDefault()
      saveProject()
    }

    // Escape - Deselect
    if (e.key === 'Escape') {
      selectElement(null)
    }

    // Zoom controls
    if (isCtrlOrCmd && e.key === '=') {
      e.preventDefault()
      setZoom(Math.min(200, zoom + 10))
    }
    if (isCtrlOrCmd && e.key === '-') {
      e.preventDefault()
      setZoom(Math.max(25, zoom - 10))
    }
    if (isCtrlOrCmd && e.key === '0') {
      e.preventDefault()
      setZoom(100)
    }

    // Toggle Preview (Ctrl+P)
    if (isCtrlOrCmd && e.key === 'p') {
      e.preventDefault()
      togglePreviewMode()
    }

    // Toggle Grid (Ctrl+G)
    if (isCtrlOrCmd && e.key === 'g') {
      e.preventDefault()
      toggleGrid()
    }

    // Select All (Ctrl+A) - Could be implemented to select all elements in current section
    // Arrow keys for nudging - Could be implemented for fine positioning
  }, [
    selectedElementId,
    selectedSectionId,
    getCurrentPage,
    deleteElement,
    copyElement,
    pasteElement,
    cutElement,
    duplicateElement,
    undo,
    redo,
    selectElement,
    setZoom,
    zoom,
    togglePreviewMode,
    toggleGrid,
    saveProject
  ])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
