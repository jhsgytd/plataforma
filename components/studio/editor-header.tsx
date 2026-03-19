'use client'

import { useEditorStore } from '@/lib/editor-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Edit3,
  Save,
  Check,
  ExternalLink,
  ArrowLeft,
  Maximize2,
  Grid3X3
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link'

export function EditorHeader() {
  const {
    getCurrentPage,
    zoom,
    setZoom,
    viewport,
    setViewport,
    isPreviewMode,
    togglePreviewMode,
    showGrid,
    toggleGrid,
    undo,
    redo,
    historyIndex,
    history,
    saveProject
  } = useEditorStore()

  const currentPage = getCurrentPage()
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const zoomLevels = [
    { label: 'Fit', value: 100 },
    { label: '100%', value: 100 },
    { label: '75%', value: 75 },
    { label: '50%', value: 50 },
  ]

  return (
    <TooltipProvider>
      <header className="h-14 bg-[#12121a] border-b border-white/10 flex items-center justify-between px-4">
        {/* Left Section - Title & Navigation */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-red-500 uppercase">STUDIO</span>
            <h1 className="text-sm font-medium">
              {currentPage?.name || 'Sin pagina'}
              <span className="text-muted-foreground ml-1">
                /{currentPage?.slug || ''}
              </span>
            </h1>
          </div>
        </div>

        {/* Center Section - Tools */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="h-8 w-8"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Deshacer (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo}
                  className="h-8 w-8"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rehacer (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          {/* Viewport Selector */}
          <div className="flex items-center bg-white/5 rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewport('desktop')}
                  className={cn(
                    "h-7 px-3",
                    viewport === 'desktop' && "bg-red-500 text-white hover:bg-red-600"
                  )}
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  Desktop
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista de escritorio (1440px)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewport('tablet')}
                  className={cn(
                    "h-7 px-2",
                    viewport === 'tablet' && "bg-red-500 text-white hover:bg-red-600"
                  )}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista tablet (768px)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewport('mobile')}
                  className={cn(
                    "h-7 px-2",
                    viewport === 'mobile' && "bg-red-500 text-white hover:bg-red-600"
                  )}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vista movil (375px)</TooltipContent>
            </Tooltip>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center bg-white/5 rounded-lg p-1">
            {zoomLevels.map((level) => (
              <Button
                key={level.label}
                variant="ghost"
                size="sm"
                onClick={() => setZoom(level.value)}
                className={cn(
                  "h-7 px-2 text-xs",
                  zoom === level.value && "bg-white/10"
                )}
              >
                {level.label}
              </Button>
            ))}
          </div>

          {/* Edit/Preview Toggle */}
          <div className="flex items-center bg-white/5 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => !isPreviewMode && null}
              className={cn(
                "h-7 px-3",
                !isPreviewMode && "bg-white/10"
              )}
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePreviewMode}
              className={cn(
                "h-7 px-3",
                isPreviewMode && "bg-white/10"
              )}
            >
              <Eye className="h-4 w-4 mr-1" />
              Vista previa
            </Button>
          </div>

          {/* Grid Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleGrid}
                className={cn(
                  "h-7",
                  showGrid && "bg-white/10"
                )}
              >
                <Grid3X3 className="h-4 w-4 mr-1" />
                Revisar pagina
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mostrar/ocultar cuadricula</TooltipContent>
          </Tooltip>

          {/* Focus Mode */}
          <Button variant="ghost" size="sm" className="h-7">
            <Maximize2 className="h-4 w-4 mr-1" />
            Modo enfoque
          </Button>

          {/* Resolution indicator */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 rounded-lg px-2 py-1">
            <span className={viewport === 'desktop' ? 'text-red-400' : ''}>1440px</span>
            <span className={viewport === 'tablet' ? 'text-red-400' : ''}>1280px</span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8" asChild>
                <a href={currentPage ? `/${currentPage.slug}` : '#'} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ver sitio
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Abrir pagina en nueva pestana</TooltipContent>
          </Tooltip>

          <Button
            onClick={saveProject}
            className="h-8 bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-1" />
            Guardar
          </Button>

          <Button className="h-8 bg-red-500 hover:bg-red-600">
            <Check className="h-4 w-4 mr-1" />
            Publicar
          </Button>

          <Button variant="ghost" size="sm" className="h-8" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al admin
            </Link>
          </Button>
        </div>
      </header>
    </TooltipProvider>
  )
}
