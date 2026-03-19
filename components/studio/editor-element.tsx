'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { useEditorStore } from '@/lib/editor-store'
import type { EditorElement as EditorElementType } from '@/lib/editor-types'
import * as LucideIcons from 'lucide-react'

interface EditorElementProps {
  element: EditorElementType
  isSelected: boolean
  isHovered: boolean
  isPreview: boolean
  isDragOverlay?: boolean
  onSelect?: () => void
  onHover?: (hovered: boolean) => void
}

export function EditorElement({
  element,
  isSelected,
  isHovered,
  isPreview,
  isDragOverlay = false,
  onSelect,
  onHover
}: EditorElementProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(element.content || '')
  const contentRef = useRef<HTMLDivElement>(null)
  const { updateElement, updateElementSize, setIsResizing } = useEditorStore()

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    disabled: element.locked || isPreview || isEditing
  })

  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: typeof element.size.width === 'number' ? element.size.width : element.size.width,
    height: typeof element.size.height === 'number' ? element.size.height : element.size.height,
    transform: CSS.Transform.toString(transform),
    zIndex: element.styles.zIndex || (isSelected ? 100 : 1),
    opacity: isDragging ? 0.5 : element.styles.opacity || 1,
    cursor: element.locked ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
    // Apply element styles
    fontFamily: element.styles.fontFamily,
    fontSize: element.styles.fontSize,
    fontWeight: element.styles.fontWeight,
    lineHeight: element.styles.lineHeight,
    letterSpacing: element.styles.letterSpacing,
    textAlign: element.styles.textAlign,
    textDecoration: element.styles.textDecoration,
    textTransform: element.styles.textTransform as React.CSSProperties['textTransform'],
    color: element.styles.color,
    backgroundColor: element.styles.backgroundColor,
    backgroundImage: element.styles.backgroundImage,
    backgroundSize: element.styles.backgroundSize,
    backgroundPosition: element.styles.backgroundPosition,
    padding: element.styles.padding,
    margin: element.styles.margin,
    borderWidth: element.styles.borderWidth,
    borderStyle: element.styles.borderStyle,
    borderColor: element.styles.borderColor,
    borderRadius: element.styles.borderRadius,
    boxShadow: element.styles.boxShadow,
    display: element.styles.display,
    flexDirection: element.styles.flexDirection as React.CSSProperties['flexDirection'],
    justifyContent: element.styles.justifyContent,
    alignItems: element.styles.alignItems,
    gap: element.styles.gap
  }

  const handleDoubleClick = useCallback(() => {
    if (isPreview || element.locked) return
    if (element.type === 'text' || element.type === 'heading' || element.type === 'button' || element.type === 'link') {
      setIsEditing(true)
      setEditContent(element.content || '')
    }
  }, [element, isPreview])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    if (editContent !== element.content) {
      updateElement(element.id, { content: editContent })
    }
  }, [editContent, element, updateElement])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setEditContent(element.content || '')
    }
  }, [handleBlur, element.content])

  // Render icon from lucide-react
  const renderIcon = () => {
    if (element.type !== 'icon' || !element.icon) return null
    const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[element.icon]
    if (!IconComponent) return <span className="text-muted-foreground">?</span>
    return <IconComponent size={Number(element.size.width) || 24} color={element.styles.color || 'white'} />
  }

  // Render element content based on type
  const renderContent = () => {
    switch (element.type) {
      case 'text':
      case 'heading':
        if (isEditing) {
          return (
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onInput={(e) => setEditContent(e.currentTarget.textContent || '')}
              className="outline-none w-full h-full"
              style={{ minHeight: '1em' }}
            >
              {editContent}
            </div>
          )
        }
        return <span>{element.content}</span>

      case 'button':
        if (isEditing) {
          return (
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-center w-full"
              autoFocus
            />
          )
        }
        return (
          <span className="flex items-center justify-center w-full h-full">
            {element.content}
          </span>
        )

      case 'image':
        return element.src ? (
          <img
            src={element.src}
            alt={element.name}
            className="w-full h-full object-cover"
            style={{ borderRadius: element.styles.borderRadius }}
            crossOrigin="anonymous"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 border border-dashed border-white/20 rounded">
            <LucideIcons.Image className="w-8 h-8 text-muted-foreground" />
          </div>
        )

      case 'icon':
        return (
          <div className="flex items-center justify-center w-full h-full">
            {renderIcon()}
          </div>
        )

      case 'video':
        return element.src ? (
          <iframe
            src={element.src}
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 border border-dashed border-white/20 rounded">
            <LucideIcons.Video className="w-8 h-8 text-muted-foreground" />
          </div>
        )

      case 'divider':
        return <div className="w-full h-full" style={{ backgroundColor: element.styles.backgroundColor }} />

      case 'spacer':
        return <div className="w-full h-full" />

      case 'html-block':
        return (
          <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: element.htmlContent || '' }}
          />
        )

      case 'link':
        if (isEditing) {
          return (
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none w-full"
              autoFocus
            />
          )
        }
        return <a href={isPreview ? element.href : '#'}>{element.content}</a>

      case 'container':
        return (
          <div className="w-full h-full">
            {/* Container children would be rendered here */}
          </div>
        )

      default:
        return <span>{element.content || element.name}</span>
    }
  }

  // Resize handles
  const ResizeHandles = () => {
    if (isPreview || element.locked || !isSelected) return null

    const handleResize = (direction: string) => (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      
      const startX = e.clientX
      const startY = e.clientY
      const startWidth = typeof element.size.width === 'number' ? element.size.width : 100
      const startHeight = typeof element.size.height === 'number' ? element.size.height : 100
      
      setIsResizing(true)
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        const deltaY = moveEvent.clientY - startY
        
        let newWidth = startWidth
        let newHeight = startHeight
        
        if (direction.includes('e')) newWidth = Math.max(20, startWidth + deltaX)
        if (direction.includes('w')) newWidth = Math.max(20, startWidth - deltaX)
        if (direction.includes('s')) newHeight = Math.max(20, startHeight + deltaY)
        if (direction.includes('n')) newHeight = Math.max(20, startHeight - deltaY)
        
        updateElementSize(element.id, { width: newWidth, height: newHeight })
      }
      
      const handleMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return (
      <>
        {/* Corner handles */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full cursor-nw-resize hover:scale-125 transition-transform" onMouseDown={handleResize('nw')} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full cursor-ne-resize hover:scale-125 transition-transform" onMouseDown={handleResize('ne')} />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500 rounded-full cursor-sw-resize hover:scale-125 transition-transform" onMouseDown={handleResize('sw')} />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full cursor-se-resize hover:scale-125 transition-transform" onMouseDown={handleResize('se')} />
        
        {/* Edge handles */}
        <div className="absolute top-1/2 -left-1 w-2 h-6 -translate-y-1/2 bg-red-500 rounded cursor-w-resize hover:scale-110 transition-transform" onMouseDown={handleResize('w')} />
        <div className="absolute top-1/2 -right-1 w-2 h-6 -translate-y-1/2 bg-red-500 rounded cursor-e-resize hover:scale-110 transition-transform" onMouseDown={handleResize('e')} />
        <div className="absolute -top-1 left-1/2 w-6 h-2 -translate-x-1/2 bg-red-500 rounded cursor-n-resize hover:scale-110 transition-transform" onMouseDown={handleResize('n')} />
        <div className="absolute -bottom-1 left-1/2 w-6 h-2 -translate-x-1/2 bg-red-500 rounded cursor-s-resize hover:scale-110 transition-transform" onMouseDown={handleResize('s')} />
      </>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-shadow",
        !isPreview && !isDragOverlay && "hover:ring-1 hover:ring-blue-400/50",
        isSelected && !isDragOverlay && "ring-2 ring-red-500",
        isHovered && !isSelected && !isDragOverlay && "ring-1 ring-blue-400/50",
        isDragOverlay && "shadow-2xl"
      )}
      onClick={(e) => {
        e.stopPropagation()
        if (!isPreview && onSelect) onSelect()
      }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      {...(!isEditing && !isDragOverlay ? { ...attributes, ...listeners } : {})}
    >
      {renderContent()}
      <ResizeHandles />
      
      {/* Element label on hover/select */}
      {!isPreview && (isSelected || isHovered) && !isDragOverlay && (
        <div className="absolute -top-6 left-0 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
          {element.name}
        </div>
      )}
    </div>
  )
}
