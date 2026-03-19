import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  EditorState, 
  EditorPage, 
  EditorElement, 
  EditorSection,
  ElementType,
  ElementStyles 
} from './editor-types'

const VIEWPORT_WIDTHS = {
  desktop: 1440,
  tablet: 768,
  mobile: 375
}

function generateId(): string {
  return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function createDefaultElement(type: ElementType, position = { x: 0, y: 0 }): EditorElement {
  const baseElement: EditorElement = {
    id: generateId(),
    type,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    position,
    size: { width: 'auto', height: 'auto' },
    styles: {},
    visible: true,
    locked: false
  }

  switch (type) {
    case 'text':
      return {
        ...baseElement,
        content: 'Haz clic para editar este texto',
        size: { width: 300, height: 'auto' },
        styles: { fontSize: 16, color: '#ffffff' }
      }
    case 'heading':
      return {
        ...baseElement,
        content: 'Titulo',
        size: { width: 400, height: 'auto' },
        styles: { fontSize: 32, fontWeight: 700, color: '#ffffff' }
      }
    case 'image':
      return {
        ...baseElement,
        src: '',
        size: { width: 300, height: 200 },
        styles: { borderRadius: 8 }
      }
    case 'button':
      return {
        ...baseElement,
        content: 'Boton',
        size: { width: 150, height: 45 },
        styles: {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          textAlign: 'center',
          padding: 12
        }
      }
    case 'icon':
      return {
        ...baseElement,
        icon: 'Star',
        size: { width: 48, height: 48 },
        styles: { color: '#ffffff' }
      }
    case 'container':
      return {
        ...baseElement,
        name: 'Contenedor',
        size: { width: 400, height: 300 },
        children: [],
        styles: {
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 8,
          padding: 20
        }
      }
    case 'section':
      return {
        ...baseElement,
        name: 'Seccion',
        size: { width: '100%', height: 400 },
        children: [],
        styles: {
          backgroundColor: 'transparent',
          padding: 40
        }
      }
    case 'divider':
      return {
        ...baseElement,
        size: { width: '100%', height: 2 },
        styles: { backgroundColor: 'rgba(255,255,255,0.2)' }
      }
    case 'spacer':
      return {
        ...baseElement,
        size: { width: '100%', height: 50 }
      }
    case 'video':
      return {
        ...baseElement,
        src: '',
        size: { width: 560, height: 315 }
      }
    case 'html-block':
      return {
        ...baseElement,
        name: 'Bloque HTML',
        htmlContent: '<div>HTML personalizado</div>',
        size: { width: 400, height: 200 }
      }
    case 'link':
      return {
        ...baseElement,
        content: 'Enlace',
        href: '#',
        size: { width: 'auto', height: 'auto' },
        styles: { color: '#3b82f6', textDecoration: 'underline' }
      }
    default:
      return baseElement
  }
}

function createDefaultSection(): EditorSection {
  return {
    id: generateId(),
    name: 'Nueva Seccion',
    elements: [],
    height: 'auto',
    visible: true,
    locked: false
  }
}

function createDefaultPage(name: string, slug: string): EditorPage {
  const section = createDefaultSection()
  section.name = 'Hero'
  
  return {
    id: generateId(),
    name,
    slug,
    sections: [section],
    elements: {},
    settings: {
      title: name,
      backgroundColor: '#0a0a0f'
    },
    isPublished: false,
    lastModified: new Date().toISOString()
  }
}

interface EditorStore extends EditorState {
  // Page actions
  addPage: (name: string, slug: string) => void
  deletePage: (pageId: string) => void
  setCurrentPage: (pageId: string) => void
  updatePageSettings: (pageId: string, settings: Partial<EditorPage['settings']>) => void
  duplicatePage: (pageId: string) => void
  
  // Section actions
  addSection: (pageId: string) => void
  deleteSection: (pageId: string, sectionId: string) => void
  updateSection: (pageId: string, sectionId: string, updates: Partial<EditorSection>) => void
  reorderSections: (pageId: string, newOrder: string[]) => void
  
  // Element actions
  addElement: (type: ElementType, sectionId: string, position?: { x: number; y: number }) => void
  addElementFromIcon: (iconName: string, sectionId: string, position?: { x: number; y: number }) => void
  deleteElement: (elementId: string) => void
  updateElement: (elementId: string, updates: Partial<EditorElement>) => void
  updateElementStyles: (elementId: string, styles: Partial<ElementStyles>) => void
  updateElementPosition: (elementId: string, position: { x: number; y: number }) => void
  updateElementSize: (elementId: string, size: { width: number | 'auto' | '100%'; height: number | 'auto' | '100%' }) => void
  duplicateElement: (elementId: string) => void
  moveElementToSection: (elementId: string, targetSectionId: string) => void
  
  // Selection
  selectElement: (elementId: string | null) => void
  selectSection: (sectionId: string | null) => void
  setHoveredElement: (elementId: string | null) => void
  
  // Clipboard
  copyElement: (elementId: string) => void
  pasteElement: (sectionId: string) => void
  cutElement: (elementId: string) => void
  
  // History
  undo: () => void
  redo: () => void
  saveToHistory: () => void
  
  // View
  setZoom: (zoom: number) => void
  setViewport: (viewport: 'desktop' | 'tablet' | 'mobile') => void
  togglePreviewMode: () => void
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  setGridSize: (size: number) => void
  setRightPanelTab: (tab: EditorState['rightPanelTab']) => void
  setLeftPanelTab: (tab: EditorState['leftPanelTab']) => void
  toggleGuide: () => void
  
  // Drag state
  setIsDragging: (isDragging: boolean) => void
  setIsResizing: (isResizing: boolean) => void
  
  // Import HTML
  importHTML: (html: string, css: string, sectionId: string) => void
  
  // Persistence
  saveProject: () => void
  loadProject: () => void
  exportPage: (pageId: string) => string
  hasUnsavedChanges: boolean
  setHasUnsavedChanges: (value: boolean) => void
  
  // Utils
  getCurrentPage: () => EditorPage | null
  getSelectedElement: () => EditorElement | null
  getElementsInSection: (sectionId: string) => EditorElement[]
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      pages: [],
      currentPageId: null,
      selectedElementId: null,
      selectedSectionId: null,
      hoveredElementId: null,
      clipboard: null,
      history: [],
      historyIndex: -1,
      zoom: 100,
      viewport: 'desktop',
      viewportWidth: VIEWPORT_WIDTHS.desktop,
      isPreviewMode: false,
      showGrid: false,
      snapToGrid: true,
      gridSize: 10,
      isDragging: false,
      isResizing: false,
      rightPanelTab: 'content',
      leftPanelTab: 'pages',
      showGuide: true,
      hasUnsavedChanges: false,

      // Page actions
      addPage: (name, slug) => {
        const newPage = createDefaultPage(name, slug)
        set(state => ({
          pages: [...state.pages, newPage],
          currentPageId: newPage.id
        }))
        get().saveToHistory()
      },

      deletePage: (pageId) => {
        set(state => {
          const newPages = state.pages.filter(p => p.id !== pageId)
          return {
            pages: newPages,
            currentPageId: newPages.length > 0 ? newPages[0].id : null,
            selectedElementId: null,
            selectedSectionId: null
          }
        })
        get().saveToHistory()
      },

      setCurrentPage: (pageId) => {
        set({ currentPageId: pageId, selectedElementId: null, selectedSectionId: null })
      },

      updatePageSettings: (pageId, settings) => {
        set(state => ({
          pages: state.pages.map(p =>
            p.id === pageId
              ? { ...p, settings: { ...p.settings, ...settings }, lastModified: new Date().toISOString() }
              : p
          )
        }))
        get().saveToHistory()
      },

      duplicatePage: (pageId) => {
        const state = get()
        const page = state.pages.find(p => p.id === pageId)
        if (!page) return

        const newPage: EditorPage = {
          ...JSON.parse(JSON.stringify(page)),
          id: generateId(),
          name: `${page.name} (copia)`,
          slug: `${page.slug}-copy`,
          lastModified: new Date().toISOString()
        }

        set(state => ({
          pages: [...state.pages, newPage],
          currentPageId: newPage.id
        }))
        get().saveToHistory()
      },

      // Section actions
      addSection: (pageId) => {
        const newSection = createDefaultSection()
        set(state => ({
          pages: state.pages.map(p =>
            p.id === pageId
              ? { ...p, sections: [...p.sections, newSection], lastModified: new Date().toISOString() }
              : p
          ),
          selectedSectionId: newSection.id
        }))
        get().saveToHistory()
      },

      deleteSection: (pageId, sectionId) => {
        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== pageId) return p
            // Remove elements in this section
            const sectionElements = p.sections.find(s => s.id === sectionId)?.elements || []
            const newElements = { ...p.elements }
            sectionElements.forEach(elId => delete newElements[elId])
            
            return {
              ...p,
              sections: p.sections.filter(s => s.id !== sectionId),
              elements: newElements,
              lastModified: new Date().toISOString()
            }
          }),
          selectedSectionId: null
        }))
        get().saveToHistory()
      },

      updateSection: (pageId, sectionId, updates) => {
        set(state => ({
          pages: state.pages.map(p =>
            p.id === pageId
              ? {
                  ...p,
                  sections: p.sections.map(s =>
                    s.id === sectionId ? { ...s, ...updates } : s
                  ),
                  lastModified: new Date().toISOString()
                }
              : p
          )
        }))
        get().saveToHistory()
      },

      reorderSections: (pageId, newOrder) => {
        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== pageId) return p
            const orderedSections = newOrder
              .map(id => p.sections.find(s => s.id === id))
              .filter(Boolean) as EditorSection[]
            return { ...p, sections: orderedSections, lastModified: new Date().toISOString() }
          })
        }))
        get().saveToHistory()
      },

      // Element actions
      addElement: (type, sectionId, position = { x: 50, y: 50 }) => {
        const newElement = createDefaultElement(type, position)
        const state = get()
        const currentPage = state.pages.find(p => p.id === state.currentPageId)
        if (!currentPage) return

        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            return {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId
                  ? { ...s, elements: [...s.elements, newElement.id] }
                  : s
              ),
              elements: { ...p.elements, [newElement.id]: newElement },
              lastModified: new Date().toISOString()
            }
          }),
          selectedElementId: newElement.id
        }))
        get().saveToHistory()
      },

      addElementFromIcon: (iconName, sectionId, position = { x: 50, y: 50 }) => {
        const newElement = createDefaultElement('icon', position)
        newElement.icon = iconName
        newElement.name = iconName
        
        const state = get()
        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            return {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId
                  ? { ...s, elements: [...s.elements, newElement.id] }
                  : s
              ),
              elements: { ...p.elements, [newElement.id]: newElement },
              lastModified: new Date().toISOString()
            }
          }),
          selectedElementId: newElement.id
        }))
        get().saveToHistory()
      },

      deleteElement: (elementId) => {
        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            const newElements = { ...p.elements }
            delete newElements[elementId]
            return {
              ...p,
              sections: p.sections.map(s => ({
                ...s,
                elements: s.elements.filter(id => id !== elementId)
              })),
              elements: newElements,
              lastModified: new Date().toISOString()
            }
          }),
          selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId
        }))
        get().saveToHistory()
      },

      updateElement: (elementId, updates) => {
        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            const element = p.elements[elementId]
            if (!element) return p
            return {
              ...p,
              elements: {
                ...p.elements,
                [elementId]: { ...element, ...updates }
              },
              lastModified: new Date().toISOString()
            }
          })
        }))
      },

      updateElementStyles: (elementId, styles) => {
        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            const element = p.elements[elementId]
            if (!element) return p
            return {
              ...p,
              elements: {
                ...p.elements,
                [elementId]: {
                  ...element,
                  styles: { ...element.styles, ...styles }
                }
              },
              lastModified: new Date().toISOString()
            }
          })
        }))
      },

      updateElementPosition: (elementId, position) => {
        const state = get()
        let finalPosition = position
        
        if (state.snapToGrid) {
          finalPosition = {
            x: Math.round(position.x / state.gridSize) * state.gridSize,
            y: Math.round(position.y / state.gridSize) * state.gridSize
          }
        }

        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            const element = p.elements[elementId]
            if (!element) return p
            return {
              ...p,
              elements: {
                ...p.elements,
                [elementId]: { ...element, position: finalPosition }
              }
            }
          })
        }))
      },

      updateElementSize: (elementId, size) => {
        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            const element = p.elements[elementId]
            if (!element) return p
            return {
              ...p,
              elements: {
                ...p.elements,
                [elementId]: { ...element, size }
              }
            }
          })
        }))
      },

      duplicateElement: (elementId) => {
        const state = get()
        const currentPage = state.pages.find(p => p.id === state.currentPageId)
        if (!currentPage) return
        
        const element = currentPage.elements[elementId]
        if (!element) return

        // Find which section contains this element
        const section = currentPage.sections.find(s => s.elements.includes(elementId))
        if (!section) return

        const newElement: EditorElement = {
          ...JSON.parse(JSON.stringify(element)),
          id: generateId(),
          name: `${element.name} (copia)`,
          position: {
            x: element.position.x + 20,
            y: element.position.y + 20
          }
        }

        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            return {
              ...p,
              sections: p.sections.map(s =>
                s.id === section.id
                  ? { ...s, elements: [...s.elements, newElement.id] }
                  : s
              ),
              elements: { ...p.elements, [newElement.id]: newElement },
              lastModified: new Date().toISOString()
            }
          }),
          selectedElementId: newElement.id
        }))
        get().saveToHistory()
      },

      moveElementToSection: (elementId, targetSectionId) => {
        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            return {
              ...p,
              sections: p.sections.map(s => ({
                ...s,
                elements: s.id === targetSectionId
                  ? [...s.elements.filter(id => id !== elementId), elementId]
                  : s.elements.filter(id => id !== elementId)
              })),
              lastModified: new Date().toISOString()
            }
          })
        }))
        get().saveToHistory()
      },

      // Selection
      selectElement: (elementId) => {
        set({ selectedElementId: elementId })
      },

      selectSection: (sectionId) => {
        set({ selectedSectionId: sectionId, selectedElementId: null })
      },

      setHoveredElement: (elementId) => {
        set({ hoveredElementId: elementId })
      },

      // Clipboard
      copyElement: (elementId) => {
        const state = get()
        const currentPage = state.pages.find(p => p.id === state.currentPageId)
        if (!currentPage) return
        
        const element = currentPage.elements[elementId]
        if (element) {
          set({ clipboard: JSON.parse(JSON.stringify(element)) })
        }
      },

      pasteElement: (sectionId) => {
        const state = get()
        if (!state.clipboard) return

        const newElement: EditorElement = {
          ...JSON.parse(JSON.stringify(state.clipboard)),
          id: generateId(),
          position: {
            x: state.clipboard.position.x + 20,
            y: state.clipboard.position.y + 20
          }
        }

        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            return {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId
                  ? { ...s, elements: [...s.elements, newElement.id] }
                  : s
              ),
              elements: { ...p.elements, [newElement.id]: newElement },
              lastModified: new Date().toISOString()
            }
          }),
          selectedElementId: newElement.id
        }))
        get().saveToHistory()
      },

      cutElement: (elementId) => {
        get().copyElement(elementId)
        get().deleteElement(elementId)
      },

      // History
      undo: () => {
        const state = get()
        if (state.historyIndex <= 0) return
        
        const previousState = state.history[state.historyIndex - 1]
        if (previousState) {
          set({
            ...previousState.state,
            historyIndex: state.historyIndex - 1
          })
        }
      },

      redo: () => {
        const state = get()
        if (state.historyIndex >= state.history.length - 1) return
        
        const nextState = state.history[state.historyIndex + 1]
        if (nextState) {
          set({
            ...nextState.state,
            historyIndex: state.historyIndex + 1
          })
        }
      },

      saveToHistory: () => {
        const state = get()
        const historyEntry = {
          timestamp: Date.now(),
          action: 'update',
          state: {
            pages: JSON.parse(JSON.stringify(state.pages)),
            currentPageId: state.currentPageId
          }
        }
        
        const newHistory = state.history.slice(0, state.historyIndex + 1)
        newHistory.push(historyEntry)
        
        // Keep only last 50 history entries
        if (newHistory.length > 50) {
          newHistory.shift()
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        })
      },

      // View
      setZoom: (zoom) => {
        set({ zoom: Math.max(25, Math.min(200, zoom)) })
      },

      setViewport: (viewport) => {
        set({
          viewport,
          viewportWidth: VIEWPORT_WIDTHS[viewport]
        })
      },

      togglePreviewMode: () => {
        set(state => ({ isPreviewMode: !state.isPreviewMode, selectedElementId: null }))
      },

      toggleGrid: () => {
        set(state => ({ showGrid: !state.showGrid }))
      },

      toggleSnapToGrid: () => {
        set(state => ({ snapToGrid: !state.snapToGrid }))
      },

      setGridSize: (size) => {
        set({ gridSize: size })
      },

      setRightPanelTab: (tab) => {
        set({ rightPanelTab: tab })
      },

      setLeftPanelTab: (tab) => {
        set({ leftPanelTab: tab })
      },

      toggleGuide: () => {
        set(state => ({ showGuide: !state.showGuide }))
      },

      // Drag state
      setIsDragging: (isDragging) => {
        set({ isDragging })
      },

      setIsResizing: (isResizing) => {
        set({ isResizing })
      },

      // Import HTML
      importHTML: (html, css, sectionId) => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        
        const htmlElement = createDefaultElement('html-block', { x: 0, y: 0 })
        htmlElement.htmlContent = html
        htmlElement.cssContent = css
        htmlElement.size = { width: '100%', height: 'auto' }
        htmlElement.name = 'HTML Importado'

        set(state => ({
          pages: state.pages.map(p => {
            if (p.id !== state.currentPageId) return p
            return {
              ...p,
              sections: p.sections.map(s =>
                s.id === sectionId
                  ? { ...s, elements: [...s.elements, htmlElement.id] }
                  : s
              ),
              elements: { ...p.elements, [htmlElement.id]: htmlElement },
              lastModified: new Date().toISOString()
            }
          }),
          selectedElementId: htmlElement.id
        }))
        get().saveToHistory()
      },

      // Persistence
      saveProject: () => {
        const state = get()
        localStorage.setItem('editor-project', JSON.stringify({
          pages: state.pages,
          currentPageId: state.currentPageId
        }))
      },

      loadProject: () => {
        const saved = localStorage.getItem('editor-project')
        if (saved) {
          try {
            const data = JSON.parse(saved)
            set({
              pages: data.pages || [],
              currentPageId: data.currentPageId || null
            })
          } catch (e) {
            console.error('Error loading project:', e)
          }
        }
      },

      exportPage: (pageId) => {
        const state = get()
        const page = state.pages.find(p => p.id === pageId)
        if (!page) return ''
        
        return JSON.stringify(page, null, 2)
      },

      // Utils
      getCurrentPage: () => {
        const state = get()
        return state.pages.find(p => p.id === state.currentPageId) || null
      },

      getSelectedElement: () => {
        const state = get()
        const currentPage = state.pages.find(p => p.id === state.currentPageId)
        if (!currentPage || !state.selectedElementId) return null
        return currentPage.elements[state.selectedElementId] || null
      },

      getElementsInSection: (sectionId) => {
        const state = get()
        const currentPage = state.pages.find(p => p.id === state.currentPageId)
        if (!currentPage) return []
        
        const section = currentPage.sections.find(s => s.id === sectionId)
        if (!section) return []
        
        return section.elements
          .map(id => currentPage.elements[id])
          .filter(Boolean)
      }
    }),
    {
      name: 'visual-editor-storage',
      partialize: (state) => ({
        pages: state.pages,
        currentPageId: state.currentPageId
      })
    }
  )
)
