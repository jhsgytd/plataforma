'use client'

import { useEditorStore } from '@/lib/editor-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import type { ElementType } from '@/lib/editor-types'
import {
  Type,
  Heading1,
  Image,
  MousePointer2,
  Star,
  Square,
  Minus,
  Space,
  Video,
  Code,
  Link,
  List,
  FormInput,
  Layers
} from 'lucide-react'

const ELEMENT_CATEGORIES = [
  {
    name: 'Basicos',
    elements: [
      { type: 'heading' as ElementType, icon: Heading1, label: 'Titulo' },
      { type: 'text' as ElementType, icon: Type, label: 'Texto' },
      { type: 'image' as ElementType, icon: Image, label: 'Imagen' },
      { type: 'button' as ElementType, icon: MousePointer2, label: 'Boton' },
      { type: 'link' as ElementType, icon: Link, label: 'Enlace' },
    ]
  },
  {
    name: 'Estructura',
    elements: [
      { type: 'container' as ElementType, icon: Square, label: 'Contenedor' },
      { type: 'section' as ElementType, icon: Layers, label: 'Seccion' },
      { type: 'divider' as ElementType, icon: Minus, label: 'Divisor' },
      { type: 'spacer' as ElementType, icon: Space, label: 'Espaciador' },
    ]
  },
  {
    name: 'Media',
    elements: [
      { type: 'video' as ElementType, icon: Video, label: 'Video' },
      { type: 'icon' as ElementType, icon: Star, label: 'Icono' },
    ]
  },
  {
    name: 'Avanzado',
    elements: [
      { type: 'html-block' as ElementType, icon: Code, label: 'HTML' },
      { type: 'list' as ElementType, icon: List, label: 'Lista' },
      { type: 'form' as ElementType, icon: FormInput, label: 'Formulario' },
    ]
  }
]

export function ElementsPanel() {
  const { getCurrentPage, addElement, selectedSectionId } = useEditorStore()
  const currentPage = getCurrentPage()

  const handleAddElement = (type: ElementType) => {
    if (!currentPage) return
    
    // Use selected section or first section
    const targetSectionId = selectedSectionId || currentPage.sections[0]?.id
    if (!targetSectionId) return
    
    // Calculate position based on existing elements
    const section = currentPage.sections.find(s => s.id === targetSectionId)
    if (!section) return
    
    const elementsInSection = section.elements.map(id => currentPage.elements[id]).filter(Boolean)
    const maxY = elementsInSection.reduce((max, el) => {
      const elBottom = el.position.y + (typeof el.size.height === 'number' ? el.size.height : 100)
      return Math.max(max, elBottom)
    }, 0)
    
    addElement(type, targetSectionId, { x: 50, y: maxY + 20 })
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-6">
        <div className="text-xs font-semibold text-red-500 uppercase tracking-wider">
          COMPONENTES
        </div>
        <p className="text-xs text-muted-foreground -mt-4">
          Arrastra o haz clic para agregar
        </p>

        {ELEMENT_CATEGORIES.map((category) => (
          <div key={category.name}>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase">
              {category.name}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {category.elements.map((element) => (
                <Button
                  key={element.type}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/50"
                  onClick={() => handleAddElement(element.type)}
                  disabled={!currentPage}
                >
                  <element.icon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs">{element.label}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Quick tips */}
        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-medium text-white">Tips rapidos</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Doble clic para editar texto</li>
            <li>• Ctrl+C/V para copiar/pegar</li>
            <li>• Delete para eliminar</li>
            <li>• Arrastra las esquinas para redimensionar</li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  )
}
