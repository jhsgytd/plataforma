// Editor Element Types
export type ElementType = 
  | 'text' 
  | 'heading' 
  | 'image' 
  | 'button' 
  | 'icon' 
  | 'container' 
  | 'section'
  | 'divider'
  | 'spacer'
  | 'video'
  | 'html-block'
  | 'link'
  | 'list'
  | 'form'
  | 'input'

export interface ElementPosition {
  x: number
  y: number
}

export interface ElementSize {
  width: number | 'auto' | '100%'
  height: number | 'auto' | '100%'
}

export interface ElementStyles {
  // Typography
  fontFamily?: string
  fontSize?: number
  fontWeight?: number | string
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  textDecoration?: string
  textTransform?: string
  color?: string
  
  // Background
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  
  // Spacing
  padding?: number | string
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  margin?: number | string
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  
  // Border
  borderWidth?: number
  borderStyle?: string
  borderColor?: string
  borderRadius?: number | string
  borderTopLeftRadius?: number
  borderTopRightRadius?: number
  borderBottomRightRadius?: number
  borderBottomLeftRadius?: number
  
  // Effects
  opacity?: number
  boxShadow?: string
  transform?: string
  transition?: string
  
  // Layout
  display?: string
  flexDirection?: string
  justifyContent?: string
  alignItems?: string
  gap?: number
  
  // Position
  position?: 'relative' | 'absolute'
  zIndex?: number
}

export interface EditorElement {
  id: string
  type: ElementType
  name: string
  content?: string
  src?: string
  href?: string
  icon?: string
  position: ElementPosition
  size: ElementSize
  styles: ElementStyles
  children?: string[]
  parentId?: string | null
  locked?: boolean
  visible?: boolean
  htmlContent?: string
  cssContent?: string
}

export interface EditorSection {
  id: string
  name: string
  elements: string[]
  height: number | 'auto'
  backgroundColor?: string
  backgroundImage?: string
  locked?: boolean
  visible?: boolean
}

export interface EditorPage {
  id: string
  name: string
  slug: string
  sections: EditorSection[]
  elements: Record<string, EditorElement>
  settings: PageSettings
  isHome?: boolean
  isPublished?: boolean
  lastModified: string
}

export interface PageSettings {
  title: string
  description?: string
  favicon?: string
  ogImage?: string
  backgroundColor?: string
  maxWidth?: number
}

export interface EditorState {
  pages: EditorPage[]
  currentPageId: string | null
  selectedElementId: string | null
  selectedSectionId: string | null
  hoveredElementId: string | null
  clipboard: EditorElement | null
  history: HistoryEntry[]
  historyIndex: number
  zoom: number
  viewport: 'desktop' | 'tablet' | 'mobile'
  viewportWidth: number
  isPreviewMode: boolean
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  isDragging: boolean
  isResizing: boolean
  rightPanelTab: 'content' | 'style' | 'actions' | 'dev'
  leftPanelTab: 'pages' | 'layers' | 'components' | 'icons'
  showGuide: boolean
}

export interface HistoryEntry {
  timestamp: number
  action: string
  state: Partial<EditorState>
}

export interface DragItem {
  id: string
  type: 'element' | 'new-element' | 'icon'
  elementType?: ElementType
  iconName?: string
}

// Icon categories for the icon library
export interface IconCategory {
  name: string
  icons: string[]
}

// HTML Import types
export interface ParsedHTMLElement {
  tag: string
  attributes: Record<string, string>
  styles: Record<string, string>
  children: ParsedHTMLElement[]
  textContent?: string
}

export interface HTMLImportResult {
  elements: EditorElement[]
  css: string
}
