'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEditorStore } from '@/lib/editor-store'
import { EditorHeader } from '@/components/studio/editor-header'
import { LeftPanel } from '@/components/studio/left-panel'
import { EditorCanvas } from '@/components/studio/editor-canvas'
import { RightPanel } from '@/components/studio/right-panel'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useAutosave } from '@/hooks/use-autosave'

export default function StudioPage() {
  const searchParams = useSearchParams()
  const pageSlug = searchParams.get('page')
  
  const {
    pages,
    currentPageId,
    setCurrentPage,
    addPage,
    loadProject,
    showGuide,
    toggleGuide
  } = useEditorStore()

  // Load project and set current page
  useEffect(() => {
    loadProject()
  }, [loadProject])

  // Initialize with a default page if none exist
  useEffect(() => {
    if (pages.length === 0) {
      // Create default pages based on your existing structure
      addPage('Inicio', 'inicio')
      addPage('Docentes EC', 'docentes-ec')
      addPage('IA', 'ia')
      addPage('Simulador', 'simulador')
    }
  }, [pages.length, addPage])

  // Set current page based on URL param
  useEffect(() => {
    if (pageSlug && pages.length > 0) {
      const page = pages.find(p => p.slug === pageSlug)
      if (page && page.id !== currentPageId) {
        setCurrentPage(page.id)
      }
    } else if (pages.length > 0 && !currentPageId) {
      setCurrentPage(pages[0].id)
    }
  }, [pageSlug, pages, currentPageId, setCurrentPage])

  // Enable keyboard shortcuts and autosave
  useKeyboardShortcuts()
  useAutosave()

  return (
    <div className="h-screen flex flex-col bg-[#0a0a12] text-white overflow-hidden">
      <EditorHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel />
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Quick Guide */}
          {showGuide && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a24] border border-white/10 rounded-lg p-4 max-w-2xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-red-500 uppercase">VIEWPORT</span>
                  <p className="text-sm">Desktop · 1440px</p>
                </div>
                <button
                  onClick={() => useEditorStore.getState().selectElement(null)}
                  className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                >
                  Pagina editable
                </button>
              </div>
              
              <div className="mb-3">
                <span className="text-[10px] font-semibold tracking-wider text-red-500 uppercase">GUIA RAPIDA</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">1.</span> Usa {"'+ Agregar bloque'"} para insertar donde quieras.
                </div>
                <div>
                  <span className="font-medium">2.</span> Haz click en un bloque y luego click en el texto para editar directo.
                </div>
                <div>
                  <span className="font-medium">3.</span> Arrastra un bloque desde su borde para cambiar el orden.
                </div>
              </div>
              
              <div className="flex justify-end mt-3">
                <button
                  onClick={toggleGuide}
                  className="text-xs text-muted-foreground hover:text-white transition-colors"
                >
                  Ocultar
                </button>
              </div>
            </div>
          )}
          
          <EditorCanvas />
        </div>
        
        <RightPanel />
      </div>
    </div>
  )
}
