'use client'

import { useRef, useCallback, useState } from 'react'
import { useEditorStore } from '@/lib/editor-store'
import { EditorElement } from './editor-element'
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

export function EditorCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  
  const {
    getCurrentPage,
    selectedElementId,
    selectedSectionId,
    hoveredElementId,
    zoom,
    viewportWidth,
    isPreviewMode,
    showGrid,
    gridSize,
    selectElement,
    selectSection,
    setHoveredElement,
    updateElementPosition,
    setIsDragging
  } = useEditorStore()

  const currentPage = getCurrentPage()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as string)
    setIsDragging(true)
  }, [setIsDragging])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event
    setActiveDragId(null)
    setIsDragging(false)
    
    if (!currentPage) return
    
    const element = currentPage.elements[active.id as string]
    if (element && !element.locked) {
      updateElementPosition(active.id as string, {
        x: element.position.x + delta.x,
        y: element.position.y + delta.y
      })
    }
  }, [currentPage, updateElementPosition, setIsDragging])

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.section) {
      selectElement(null)
    }
  }, [selectElement])

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a12]">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No hay pagina seleccionada</p>
          <p className="text-sm mt-2">Selecciona o crea una pagina desde el panel izquierdo</p>
        </div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-auto bg-[#0a0a12] p-8">
        <div 
          className="mx-auto relative transition-all duration-200"
          style={{ 
            width: viewportWidth,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {/* Canvas Background */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className={cn(
              "relative min-h-screen rounded-lg overflow-hidden transition-shadow",
              !isPreviewMode && "ring-1 ring-white/10",
              showGrid && "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
            )}
            style={{
              backgroundColor: currentPage.settings.backgroundColor || '#0a0a0f',
              backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : undefined
            }}
          >
            {/* Sections */}
            {currentPage.sections.map((section, index) => (
              <div
                key={section.id}
                data-section={section.id}
                className={cn(
                  "relative",
                  !isPreviewMode && "min-h-[200px]",
                  !isPreviewMode && selectedSectionId === section.id && "ring-2 ring-red-500/50",
                  !isPreviewMode && "hover:ring-1 hover:ring-white/20",
                  section.locked && "pointer-events-none opacity-50",
                  !section.visible && "hidden"
                )}
                style={{
                  minHeight: typeof section.height === 'number' ? section.height : undefined,
                  backgroundColor: section.backgroundColor,
                  backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                onClick={(e) => {
                  if (!isPreviewMode && e.target === e.currentTarget) {
                    selectSection(section.id)
                  }
                }}
              >
                {/* Section Label */}
                {!isPreviewMode && (
                  <div className="absolute -top-6 left-0 text-xs text-muted-foreground bg-[#1a1a24] px-2 py-0.5 rounded-t">
                    {section.name}
                  </div>
                )}

                {/* Elements in Section */}
                {section.elements.map((elementId) => {
                  const element = currentPage.elements[elementId]
                  if (!element || !element.visible) return null
                  
                  return (
                    <EditorElement
                      key={element.id}
                      element={element}
                      isSelected={selectedElementId === element.id}
                      isHovered={hoveredElementId === element.id}
                      isPreview={isPreviewMode}
                      onSelect={() => selectElement(element.id)}
                      onHover={(hovered) => setHoveredElement(hovered ? element.id : null)}
                    />
                  )
                })}

                {/* Drop zone indicator */}
                {!isPreviewMode && section.elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-white/10 rounded m-4">
                    <p className="text-muted-foreground text-sm">
                      Arrastra elementos aqui o usa "+ Agregar bloque"
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Add Section Button */}
            {!isPreviewMode && (
              <button
                onClick={() => useEditorStore.getState().addSection(currentPage.id)}
                className="w-full py-8 border-2 border-dashed border-white/10 hover:border-red-500/50 rounded-lg mt-4 text-muted-foreground hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-2xl">+</span>
                <span>Agregar Seccion</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeDragId && currentPage.elements[activeDragId] && (
          <div className="opacity-80 pointer-events-none">
            <EditorElement
              element={currentPage.elements[activeDragId]}
              isSelected={false}
              isHovered={false}
              isPreview={false}
              isDragOverlay
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
