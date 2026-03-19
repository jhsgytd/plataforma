'use client'

import { useEditorStore } from '@/lib/editor-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Type,
  Heading1,
  Image,
  MousePointer2,
  Star,
  Square,
  Minus,
  Video,
  Code,
  Link,
  Layers as LayersIcon
} from 'lucide-react'
import type { ElementType } from '@/lib/editor-types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

const ELEMENT_ICONS: Record<ElementType, React.ComponentType<{ className?: string }>> = {
  'text': Type,
  'heading': Heading1,
  'image': Image,
  'button': MousePointer2,
  'icon': Star,
  'container': Square,
  'section': LayersIcon,
  'divider': Minus,
  'spacer': Square,
  'video': Video,
  'html-block': Code,
  'link': Link,
  'list': Type,
  'form': Square,
  'input': Type
}

interface SortableItemProps {
  id: string
  element: {
    id: string
    name: string
    type: ElementType
    visible?: boolean
    locked?: boolean
  }
  isSelected: boolean
  onSelect: () => void
  onToggleVisibility: () => void
  onToggleLock: () => void
  onDelete: () => void
  onDuplicate: () => void
}

function SortableItem({
  id,
  element,
  isSelected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onDelete,
  onDuplicate
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const IconComponent = ELEMENT_ICONS[element.type] || Square

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-1 p-2 rounded group transition-colors",
        isSelected ? "bg-red-500/20 border border-red-500/50" : "hover:bg-white/5",
        isDragging && "opacity-50",
        !element.visible && "opacity-40"
      )}
      onClick={onSelect}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <IconComponent className="h-4 w-4 text-muted-foreground shrink-0" />
      
      <span className={cn(
        "flex-1 text-sm truncate",
        element.locked && "italic text-muted-foreground"
      )}>
        {element.name}
      </span>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onToggleVisibility() }}
        >
          {element.visible !== false ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onToggleLock() }}
        >
          {element.locked ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Unlock className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => { e.stopPropagation(); onDuplicate() }}
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:text-red-400"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export function LayersPanel() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  
  const {
    getCurrentPage,
    selectedElementId,
    selectElement,
    updateElement,
    deleteElement,
    duplicateElement,
    updateSection,
    reorderSections
  } = useEditorStore()

  const currentPage = getCurrentPage()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || !currentPage) return

    // For now, handle element reordering within the same section
    // This is simplified - full implementation would need more complex logic
  }

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground text-center">
          Selecciona una pagina para ver sus capas
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-white/10">
        <div className="text-xs font-semibold text-red-500 uppercase tracking-wider">
          CAPAS
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Organiza y gestiona elementos
        </p>
      </div>

      <ScrollArea className="flex-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="p-2 space-y-2">
            {currentPage.sections.map((section, sectionIndex) => {
              const isExpanded = expandedSections[section.id] !== false // Default expanded
              const sectionElements = section.elements
                .map(id => currentPage.elements[id])
                .filter(Boolean)

              return (
                <div key={section.id} className="bg-white/5 rounded-lg overflow-hidden">
                  {/* Section Header */}
                  <div
                    className={cn(
                      "flex items-center gap-2 p-2 cursor-pointer hover:bg-white/5",
                      !section.visible && "opacity-40"
                    )}
                    onClick={() => toggleSection(section.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <LayersIcon className="h-4 w-4 text-red-400" />
                    <span className="flex-1 text-sm font-medium truncate">
                      {section.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {sectionElements.length}
                    </span>
                    
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateSection(currentPage.id, section.id, { visible: !section.visible })
                        }}
                      >
                        {section.visible !== false ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          updateSection(currentPage.id, section.id, { locked: !section.locked })
                        }}
                      >
                        {section.locked ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Unlock className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Section Elements */}
                  {isExpanded && (
                    <div className="border-t border-white/10">
                      {sectionElements.length === 0 ? (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          Sin elementos
                        </div>
                      ) : (
                        <SortableContext
                          items={sectionElements.map(el => el.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="p-1 space-y-0.5">
                            {sectionElements.map((element) => (
                              <SortableItem
                                key={element.id}
                                id={element.id}
                                element={element}
                                isSelected={selectedElementId === element.id}
                                onSelect={() => selectElement(element.id)}
                                onToggleVisibility={() => 
                                  updateElement(element.id, { visible: !element.visible })
                                }
                                onToggleLock={() => 
                                  updateElement(element.id, { locked: !element.locked })
                                }
                                onDelete={() => deleteElement(element.id)}
                                onDuplicate={() => duplicateElement(element.id)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </DndContext>
      </ScrollArea>

      {/* Layer count */}
      <div className="p-3 border-t border-white/10">
        <p className="text-xs text-muted-foreground text-center">
          {currentPage.sections.length} secciones, {Object.keys(currentPage.elements).length} elementos
        </p>
      </div>
    </div>
  )
}
