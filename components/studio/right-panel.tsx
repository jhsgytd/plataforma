'use client'

import { useState, useCallback } from 'react'
import { useEditorStore } from '@/lib/editor-store'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Pen,
  Palette,
  Zap,
  Code,
  ChevronDown,
  ChevronRight,
  Globe,
  Upload,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough
} from 'lucide-react'
import { HTMLImportPanel } from './html-import-panel'

// Color picker component
function ColorPicker({ 
  value, 
  onChange, 
  label 
}: { 
  value?: string
  onChange: (value: string) => void
  label: string 
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={value || '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border border-white/10"
          />
        </div>
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          className="flex-1 bg-white/5 border-white/10 text-sm h-10"
        />
      </div>
    </div>
  )
}

// Number input with slider
function NumberInput({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  unit = ''
}: {
  value?: number
  onChange: (value: number) => void
  label: string
  min?: number
  max?: number
  step?: number
  unit?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs text-muted-foreground">{value ?? 0}{unit}</span>
      </div>
      <Slider
        value={[value ?? 0]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="py-2"
      />
    </div>
  )
}

// Collapsible section
function PropertySection({ 
  title, 
  defaultOpen = true, 
  children 
}: { 
  title: string
  defaultOpen?: boolean
  children: React.ReactNode 
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-white/5 transition-colors">
        <span className="text-sm font-medium">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3 space-y-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function RightPanel() {
  const {
    rightPanelTab,
    setRightPanelTab,
    getSelectedElement,
    getCurrentPage,
    updateElement,
    updateElementStyles
  } = useEditorStore()

  const selectedElement = getSelectedElement()
  const currentPage = getCurrentPage()

  const handleStyleChange = useCallback((property: string, value: unknown) => {
    if (!selectedElement) return
    updateElementStyles(selectedElement.id, { [property]: value })
  }, [selectedElement, updateElementStyles])

  const handleElementChange = useCallback((property: string, value: unknown) => {
    if (!selectedElement) return
    updateElement(selectedElement.id, { [property]: value })
  }, [selectedElement, updateElement])

  return (
    <div className="w-80 bg-[#12121a] border-l border-white/10 flex flex-col">
      {/* Page Info Header */}
      {currentPage && (
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentPage.name}</p>
              <p className="text-xs text-muted-foreground">/{currentPage.slug}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={rightPanelTab} onValueChange={(v) => setRightPanelTab(v as typeof rightPanelTab)} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 bg-transparent border-b border-white/10 rounded-none h-10 p-0">
          <TabsTrigger 
            value="content" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent"
          >
            <Pen className="h-4 w-4 mr-1" />
            <span className="text-xs">Conten...</span>
          </TabsTrigger>
          <TabsTrigger 
            value="style" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent"
          >
            <Palette className="h-4 w-4 mr-1" />
            <span className="text-xs">Estilo</span>
          </TabsTrigger>
          <TabsTrigger 
            value="actions" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent"
          >
            <Zap className="h-4 w-4 mr-1" />
            <span className="text-xs">Acc.</span>
          </TabsTrigger>
          <TabsTrigger 
            value="dev" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent"
          >
            <Code className="h-4 w-4 mr-1" />
            <span className="text-xs">Dev</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {/* Content Tab */}
          <TabsContent value="content" className="m-0 p-0">
            {selectedElement ? (
              <div className="divide-y divide-white/10">
                {/* Element Info */}
                <PropertySection title="Elemento">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Nombre</Label>
                      <Input
                        value={selectedElement.name}
                        onChange={(e) => handleElementChange('name', e.target.value)}
                        className="mt-1 bg-white/5 border-white/10"
                      />
                    </div>
                    
                    {(selectedElement.type === 'text' || 
                      selectedElement.type === 'heading' || 
                      selectedElement.type === 'button' ||
                      selectedElement.type === 'link') && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Contenido</Label>
                        <Input
                          value={selectedElement.content || ''}
                          onChange={(e) => handleElementChange('content', e.target.value)}
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                    )}

                    {selectedElement.type === 'image' && (
                      <div>
                        <Label className="text-xs text-muted-foreground">URL de imagen</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            value={selectedElement.src || ''}
                            onChange={(e) => handleElementChange('src', e.target.value)}
                            placeholder="https://..."
                            className="flex-1 bg-white/5 border-white/10"
                          />
                          <Button variant="outline" size="icon" className="shrink-0 border-white/10">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedElement.type === 'link' && (
                      <div>
                        <Label className="text-xs text-muted-foreground">URL</Label>
                        <Input
                          value={selectedElement.href || ''}
                          onChange={(e) => handleElementChange('href', e.target.value)}
                          placeholder="https://..."
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                    )}

                    {selectedElement.type === 'video' && (
                      <div>
                        <Label className="text-xs text-muted-foreground">URL del video (YouTube, Vimeo)</Label>
                        <Input
                          value={selectedElement.src || ''}
                          onChange={(e) => handleElementChange('src', e.target.value)}
                          placeholder="https://youtube.com/embed/..."
                          className="mt-1 bg-white/5 border-white/10"
                        />
                      </div>
                    )}

                    {selectedElement.type === 'html-block' && (
                      <div>
                        <Label className="text-xs text-muted-foreground">HTML</Label>
                        <textarea
                          value={selectedElement.htmlContent || ''}
                          onChange={(e) => handleElementChange('htmlContent', e.target.value)}
                          className="mt-1 w-full h-32 bg-white/5 border border-white/10 rounded p-2 text-sm font-mono"
                          placeholder="<div>...</div>"
                        />
                      </div>
                    )}
                  </div>
                </PropertySection>

                {/* Position & Size */}
                <PropertySection title="Posicion y Tamano">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">X</Label>
                      <Input
                        type="number"
                        value={selectedElement.position.x}
                        onChange={(e) => handleElementChange('position', {
                          ...selectedElement.position,
                          x: Number(e.target.value)
                        })}
                        className="mt-1 bg-white/5 border-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Y</Label>
                      <Input
                        type="number"
                        value={selectedElement.position.y}
                        onChange={(e) => handleElementChange('position', {
                          ...selectedElement.position,
                          y: Number(e.target.value)
                        })}
                        className="mt-1 bg-white/5 border-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Ancho</Label>
                      <Input
                        type="text"
                        value={selectedElement.size.width}
                        onChange={(e) => {
                          const val = e.target.value
                          handleElementChange('size', {
                            ...selectedElement.size,
                            width: val === 'auto' || val === '100%' ? val : Number(val)
                          })
                        }}
                        className="mt-1 bg-white/5 border-white/10"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Alto</Label>
                      <Input
                        type="text"
                        value={selectedElement.size.height}
                        onChange={(e) => {
                          const val = e.target.value
                          handleElementChange('size', {
                            ...selectedElement.size,
                            height: val === 'auto' || val === '100%' ? val : Number(val)
                          })
                        }}
                        className="mt-1 bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                </PropertySection>
              </div>
            ) : (
              <HTMLImportPanel />
            )}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="m-0 p-0">
            {selectedElement ? (
              <div className="divide-y divide-white/10">
                {/* Typography */}
                {(selectedElement.type === 'text' || 
                  selectedElement.type === 'heading' || 
                  selectedElement.type === 'button' ||
                  selectedElement.type === 'link') && (
                  <PropertySection title="Tipografia">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Fuente</Label>
                        <Select
                          value={selectedElement.styles.fontFamily || 'inherit'}
                          onValueChange={(v) => handleStyleChange('fontFamily', v)}
                        >
                          <SelectTrigger className="mt-1 bg-white/5 border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a24] border-white/10">
                            <SelectItem value="inherit">Por defecto</SelectItem>
                            <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                            <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                            <SelectItem value="Open Sans, sans-serif">Open Sans</SelectItem>
                            <SelectItem value="Montserrat, sans-serif">Montserrat</SelectItem>
                            <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                            <SelectItem value="Georgia, serif">Georgia</SelectItem>
                            <SelectItem value="monospace">Monospace</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <NumberInput
                        label="Tamano de fuente"
                        value={selectedElement.styles.fontSize}
                        onChange={(v) => handleStyleChange('fontSize', v)}
                        min={8}
                        max={120}
                        unit="px"
                      />

                      <div>
                        <Label className="text-xs text-muted-foreground">Peso</Label>
                        <Select
                          value={String(selectedElement.styles.fontWeight || '400')}
                          onValueChange={(v) => handleStyleChange('fontWeight', Number(v))}
                        >
                          <SelectTrigger className="mt-1 bg-white/5 border-white/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a24] border-white/10">
                            <SelectItem value="100">Thin (100)</SelectItem>
                            <SelectItem value="200">Extra Light (200)</SelectItem>
                            <SelectItem value="300">Light (300)</SelectItem>
                            <SelectItem value="400">Regular (400)</SelectItem>
                            <SelectItem value="500">Medium (500)</SelectItem>
                            <SelectItem value="600">Semi Bold (600)</SelectItem>
                            <SelectItem value="700">Bold (700)</SelectItem>
                            <SelectItem value="800">Extra Bold (800)</SelectItem>
                            <SelectItem value="900">Black (900)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Text alignment */}
                      <div>
                        <Label className="text-xs text-muted-foreground">Alineacion</Label>
                        <div className="flex gap-1 mt-1">
                          {[
                            { value: 'left', icon: AlignLeft },
                            { value: 'center', icon: AlignCenter },
                            { value: 'right', icon: AlignRight },
                            { value: 'justify', icon: AlignJustify },
                          ].map(({ value, icon: Icon }) => (
                            <Button
                              key={value}
                              variant="outline"
                              size="icon"
                              className={cn(
                                "flex-1 border-white/10",
                                selectedElement.styles.textAlign === value && "bg-red-500/20 border-red-500/50"
                              )}
                              onClick={() => handleStyleChange('textAlign', value)}
                            >
                              <Icon className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </div>

                      <ColorPicker
                        label="Color de texto"
                        value={selectedElement.styles.color}
                        onChange={(v) => handleStyleChange('color', v)}
                      />

                      <NumberInput
                        label="Altura de linea"
                        value={selectedElement.styles.lineHeight}
                        onChange={(v) => handleStyleChange('lineHeight', v)}
                        min={0.5}
                        max={3}
                        step={0.1}
                      />

                      <NumberInput
                        label="Espaciado de letras"
                        value={selectedElement.styles.letterSpacing}
                        onChange={(v) => handleStyleChange('letterSpacing', v)}
                        min={-5}
                        max={20}
                        step={0.5}
                        unit="px"
                      />
                    </div>
                  </PropertySection>
                )}

                {/* Background */}
                <PropertySection title="Fondo">
                  <div className="space-y-3">
                    <ColorPicker
                      label="Color de fondo"
                      value={selectedElement.styles.backgroundColor}
                      onChange={(v) => handleStyleChange('backgroundColor', v)}
                    />
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">Imagen de fondo</Label>
                      <Input
                        value={selectedElement.styles.backgroundImage?.replace(/url\(['"]?|['"]?\)/g, '') || ''}
                        onChange={(e) => handleStyleChange('backgroundImage', e.target.value ? `url(${e.target.value})` : '')}
                        placeholder="URL de imagen"
                        className="mt-1 bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                </PropertySection>

                {/* Spacing */}
                <PropertySection title="Espaciado">
                  <div className="space-y-3">
                    <NumberInput
                      label="Padding"
                      value={typeof selectedElement.styles.padding === 'number' ? selectedElement.styles.padding : 0}
                      onChange={(v) => handleStyleChange('padding', v)}
                      max={100}
                      unit="px"
                    />
                    <NumberInput
                      label="Margin"
                      value={typeof selectedElement.styles.margin === 'number' ? selectedElement.styles.margin : 0}
                      onChange={(v) => handleStyleChange('margin', v)}
                      max={100}
                      unit="px"
                    />
                  </div>
                </PropertySection>

                {/* Border */}
                <PropertySection title="Borde">
                  <div className="space-y-3">
                    <NumberInput
                      label="Grosor"
                      value={selectedElement.styles.borderWidth}
                      onChange={(v) => handleStyleChange('borderWidth', v)}
                      max={20}
                      unit="px"
                    />
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">Estilo</Label>
                      <Select
                        value={selectedElement.styles.borderStyle || 'none'}
                        onValueChange={(v) => handleStyleChange('borderStyle', v)}
                      >
                        <SelectTrigger className="mt-1 bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a24] border-white/10">
                          <SelectItem value="none">Ninguno</SelectItem>
                          <SelectItem value="solid">Solido</SelectItem>
                          <SelectItem value="dashed">Discontinuo</SelectItem>
                          <SelectItem value="dotted">Punteado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <ColorPicker
                      label="Color de borde"
                      value={selectedElement.styles.borderColor}
                      onChange={(v) => handleStyleChange('borderColor', v)}
                    />

                    <NumberInput
                      label="Radio de borde"
                      value={typeof selectedElement.styles.borderRadius === 'number' ? selectedElement.styles.borderRadius : 0}
                      onChange={(v) => handleStyleChange('borderRadius', v)}
                      max={100}
                      unit="px"
                    />
                  </div>
                </PropertySection>

                {/* Effects */}
                <PropertySection title="Efectos">
                  <div className="space-y-3">
                    <NumberInput
                      label="Opacidad"
                      value={(selectedElement.styles.opacity ?? 1) * 100}
                      onChange={(v) => handleStyleChange('opacity', v / 100)}
                      max={100}
                      unit="%"
                    />
                    
                    <div>
                      <Label className="text-xs text-muted-foreground">Sombra</Label>
                      <Select
                        value={selectedElement.styles.boxShadow || 'none'}
                        onValueChange={(v) => handleStyleChange('boxShadow', v)}
                      >
                        <SelectTrigger className="mt-1 bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a24] border-white/10">
                          <SelectItem value="none">Ninguna</SelectItem>
                          <SelectItem value="0 1px 3px rgba(0,0,0,0.2)">Sutil</SelectItem>
                          <SelectItem value="0 4px 6px rgba(0,0,0,0.3)">Media</SelectItem>
                          <SelectItem value="0 10px 20px rgba(0,0,0,0.4)">Grande</SelectItem>
                          <SelectItem value="0 20px 40px rgba(0,0,0,0.5)">Extra grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <NumberInput
                      label="Z-Index"
                      value={selectedElement.styles.zIndex ?? 1}
                      onChange={(v) => handleStyleChange('zIndex', v)}
                      min={0}
                      max={999}
                    />
                  </div>
                </PropertySection>
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <Palette className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Selecciona un elemento para editar sus estilos</p>
              </div>
            )}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="m-0 p-4">
            {selectedElement ? (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Acciones del elemento</h4>
                <p className="text-xs text-muted-foreground">
                  Configura acciones para cuando el usuario interactue con este elemento.
                </p>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Al hacer clic</Label>
                  <Select defaultValue="none">
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a24] border-white/10">
                      <SelectItem value="none">Sin accion</SelectItem>
                      <SelectItem value="link">Ir a enlace</SelectItem>
                      <SelectItem value="page">Ir a pagina</SelectItem>
                      <SelectItem value="scroll">Scroll a seccion</SelectItem>
                      <SelectItem value="modal">Abrir modal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Selecciona un elemento para configurar acciones</p>
              </div>
            )}
          </TabsContent>

          {/* Dev Tab */}
          <TabsContent value="dev" className="m-0">
            <HTMLImportPanel />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
