'use client'

import { useState } from 'react'
import { useEditorStore } from '@/lib/editor-store'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Globe, 
  Layers, 
  Component, 
  Smile,
  Plus,
  MoreHorizontal,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Home,
  Menu,
  GripVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ElementsPanel } from './elements-panel'
import { IconsPanel } from './icons-panel'
import { LayersPanel } from './layers-panel'

export function LeftPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [newPageName, setNewPageName] = useState('')
  const [newPageSlug, setNewPageSlug] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const {
    pages,
    currentPageId,
    leftPanelTab,
    setLeftPanelTab,
    setCurrentPage,
    addPage,
    deletePage,
    duplicatePage
  } = useEditorStore()

  const handleCreatePage = () => {
    if (newPageName && newPageSlug) {
      addPage(newPageName, newPageSlug.toLowerCase().replace(/\s+/g, '-'))
      setNewPageName('')
      setNewPageSlug('')
      setDialogOpen(false)
    }
  }

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#12121a] border-r border-white/10 flex flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="text-muted-foreground hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="w-8 h-px bg-white/10 my-2" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setIsCollapsed(false); setLeftPanelTab('pages') }}
          className={cn("text-muted-foreground hover:text-white", leftPanelTab === 'pages' && "text-red-500")}
        >
          <Globe className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setIsCollapsed(false); setLeftPanelTab('layers') }}
          className={cn("text-muted-foreground hover:text-white", leftPanelTab === 'layers' && "text-red-500")}
        >
          <Layers className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setIsCollapsed(false); setLeftPanelTab('components') }}
          className={cn("text-muted-foreground hover:text-white", leftPanelTab === 'components' && "text-red-500")}
        >
          <Component className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setIsCollapsed(false); setLeftPanelTab('icons') }}
          className={cn("text-muted-foreground hover:text-white", leftPanelTab === 'icons' && "text-red-500")}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-72 bg-[#12121a] border-r border-white/10 flex flex-col">
      <Tabs value={leftPanelTab} onValueChange={(v) => setLeftPanelTab(v as typeof leftPanelTab)} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <TabsList className="bg-transparent h-8 p-0 gap-1">
            <TabsTrigger 
              value="pages" 
              className="h-8 px-2 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 rounded"
            >
              <Globe className="h-4 w-4 mr-1" />
              <span className="text-xs">Pag</span>
            </TabsTrigger>
            <TabsTrigger 
              value="layers" 
              className="h-8 px-2 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 rounded"
            >
              <Layers className="h-4 w-4 mr-1" />
              <span className="text-xs">Cap</span>
            </TabsTrigger>
            <TabsTrigger 
              value="components" 
              className="h-8 px-2 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 rounded"
            >
              <Component className="h-4 w-4 mr-1" />
              <span className="text-xs">Com</span>
            </TabsTrigger>
            <TabsTrigger 
              value="icons" 
              className="h-8 px-2 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500 rounded"
            >
              <Smile className="h-4 w-4 mr-1" />
              <span className="text-xs">Icon</span>
            </TabsTrigger>
          </TabsList>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="text-muted-foreground hover:text-white h-6 w-6"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
        </div>

        {/* Pages Tab */}
        <TabsContent value="pages" className="flex-1 m-0 overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">PAGINAS</span>
              <span className="text-xs text-muted-foreground">{pages.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Sitio publicado</p>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer group transition-colors",
                    currentPageId === page.id 
                      ? "bg-white/10 border border-white/20" 
                      : "hover:bg-white/5"
                  )}
                  onClick={() => setCurrentPage(page.id)}
                >
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate">{page.name}</span>
                      {page.isHome && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Home</span>
                      )}
                      {page.slug.includes('menu') && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Menu</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">/{page.slug}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a24] border-white/10">
                      <DropdownMenuItem onClick={() => duplicatePage(page.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-400"
                        onClick={() => deletePage(page.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-white/10">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-dashed border-white/20 hover:border-red-500/50 hover:bg-red-500/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Pagina
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a1a24] border-white/10">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Pagina</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Nombre</label>
                    <Input
                      placeholder="Mi Pagina"
                      value={newPageName}
                      onChange={(e) => {
                        setNewPageName(e.target.value)
                        setNewPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                      }}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">URL Slug</label>
                    <div className="flex items-center">
                      <span className="text-muted-foreground text-sm mr-1">/</span>
                      <Input
                        placeholder="mi-pagina"
                        value={newPageSlug}
                        onChange={(e) => setNewPageSlug(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreatePage} className="w-full bg-red-500 hover:bg-red-600">
                    Crear Pagina
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        {/* Layers Tab */}
        <TabsContent value="layers" className="flex-1 m-0 overflow-hidden">
          <LayersPanel />
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="flex-1 m-0 overflow-hidden">
          <ElementsPanel />
        </TabsContent>

        {/* Icons Tab */}
        <TabsContent value="icons" className="flex-1 m-0 overflow-hidden">
          <IconsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
