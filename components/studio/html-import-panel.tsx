'use client'

import { useState, useCallback } from 'react'
import { useEditorStore } from '@/lib/editor-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, Upload, FileCode, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HTMLImportPanel() {
  const [htmlContent, setHtmlContent] = useState('')
  const [cssContent, setCssContent] = useState('')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  
  const { getCurrentPage, importHTML, selectedSectionId, addSection } = useEditorStore()
  const currentPage = getCurrentPage()

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return
    
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const content = e.target?.result as string
        
        if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          // Extract CSS from HTML if present
          const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
          if (styleMatch) {
            const extractedCSS = styleMatch.map(style => 
              style.replace(/<\/?style[^>]*>/gi, '')
            ).join('\n')
            setCssContent(prev => prev + '\n' + extractedCSS)
          }
          
          // Extract body content
          const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
          setHtmlContent(bodyMatch ? bodyMatch[1] : content)
        } else if (file.name.endsWith('.css')) {
          setCssContent(prev => prev + '\n' + content)
        }
      }
      
      reader.readAsText(file)
    })
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }, [handleFileUpload])

  const handleImport = useCallback(() => {
    if (!currentPage || !htmlContent.trim()) {
      setImportStatus('error')
      setErrorMessage('No hay contenido HTML para importar')
      return
    }

    try {
      // Get target section or create one
      let targetSectionId = selectedSectionId
      if (!targetSectionId) {
        if (currentPage.sections.length === 0) {
          addSection(currentPage.id)
          targetSectionId = useEditorStore.getState().getCurrentPage()?.sections[0]?.id
        } else {
          targetSectionId = currentPage.sections[0].id
        }
      }

      if (!targetSectionId) {
        throw new Error('No se pudo encontrar o crear una seccion')
      }

      // Import HTML
      importHTML(htmlContent, cssContent, targetSectionId)
      
      setImportStatus('success')
      setHtmlContent('')
      setCssContent('')
      
      setTimeout(() => setImportStatus('idle'), 3000)
    } catch (error) {
      setImportStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Error al importar HTML')
    }
  }, [currentPage, htmlContent, cssContent, selectedSectionId, importHTML, addSection])

  return (
    <div className="p-4 space-y-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-red-500/10 rounded-xl mx-auto flex items-center justify-center">
          <Code className="h-8 w-8 text-red-400" />
        </div>
        <h3 className="font-semibold">Importar HTML inteligente</h3>
        <p className="text-xs text-muted-foreground">
          Carga un archivo `.html` en esta pagina y conviertelo en un bloque editable, libre y ordenable dentro del Studio.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragging ? "border-red-500 bg-red-500/10" : "border-white/20 hover:border-red-500/50",
          importStatus === 'success' && "border-green-500 bg-green-500/10",
          importStatus === 'error' && "border-red-500 bg-red-500/10"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('html-file-input')?.click()}
      >
        <input
          id="html-file-input"
          type="file"
          accept=".html,.htm,.css"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        
        {importStatus === 'success' ? (
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
            <p className="text-sm text-green-400">HTML importado correctamente</p>
          </div>
        ) : importStatus === 'error' ? (
          <div className="space-y-2">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-white/5 rounded-lg mx-auto flex items-center justify-center mb-3">
              <FileCode className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">HTML Smart Import</p>
            <p className="text-xs text-muted-foreground mt-1">
              Clic o arrastra un archivo `.html`
            </p>
            <p className="text-xs text-muted-foreground">
              Lo adapto al look del sitio y luego puedes editarlo visualmente desde el admin.
            </p>
          </>
        )}
      </div>

      {/* Manual Code Entry */}
      <Tabs defaultValue="html" className="w-full">
        <TabsList className="grid grid-cols-2 bg-white/5">
          <TabsTrigger value="html" className="text-xs">HTML</TabsTrigger>
          <TabsTrigger value="css" className="text-xs">CSS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="html" className="mt-2">
          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder="<div>Pega tu HTML aqui...</div>"
            className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </TabsContent>
        
        <TabsContent value="css" className="mt-2">
          <textarea
            value={cssContent}
            onChange={(e) => setCssContent(e.target.value)}
            placeholder=".clase { color: red; }"
            className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </TabsContent>
      </Tabs>

      <Button
        onClick={handleImport}
        className="w-full bg-red-500 hover:bg-red-600"
        disabled={!htmlContent.trim() || !currentPage}
      >
        <Upload className="h-4 w-4 mr-2" />
        Importar HTML
      </Button>

      {/* Tips */}
      <div className="bg-white/5 rounded-lg p-3 space-y-2">
        <h4 className="text-xs font-medium">Tips de importacion</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Los estilos inline se preservan</li>
          <li>• Las clases CSS se convierten a estilos</li>
          <li>• Las imagenes mantienen sus URLs</li>
          <li>• Puedes editar cada elemento despues</li>
        </ul>
      </div>
    </div>
  )
}
