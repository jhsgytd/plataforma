'use client'

import { useState, useMemo } from 'react'
import { useEditorStore } from '@/lib/editor-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

// Organized icon categories
const ICON_CATEGORIES: Record<string, string[]> = {
  'General': [
    'Star', 'Heart', 'ThumbsUp', 'ThumbsDown', 'Check', 'X', 'Plus', 'Minus',
    'Search', 'Home', 'Settings', 'User', 'Users', 'Mail', 'Phone', 'MapPin',
    'Calendar', 'Clock', 'Bell', 'Flag', 'Bookmark', 'Tag', 'Hash', 'AtSign'
  ],
  'Flechas': [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ChevronUp', 'ChevronDown',
    'ChevronLeft', 'ChevronRight', 'ChevronsUp', 'ChevronsDown', 'ChevronsLeft',
    'ChevronsRight', 'MoveUp', 'MoveDown', 'MoveLeft', 'MoveRight', 'CornerUpLeft',
    'CornerUpRight', 'CornerDownLeft', 'CornerDownRight', 'ArrowUpRight', 'ArrowDownRight'
  ],
  'Media': [
    'Play', 'Pause', 'Stop', 'SkipBack', 'SkipForward', 'Rewind', 'FastForward',
    'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Mic', 'MicOff', 'Camera',
    'Video', 'Image', 'Music', 'Film', 'Radio', 'Tv', 'Youtube', 'Headphones'
  ],
  'Comunicacion': [
    'MessageCircle', 'MessageSquare', 'Send', 'Inbox', 'MailOpen', 'AtSign',
    'Share', 'Share2', 'ExternalLink', 'Link', 'Link2', 'Paperclip', 'Clipboard',
    'Copy', 'Scissors', 'Edit', 'Edit2', 'Edit3', 'Trash', 'Trash2'
  ],
  'Archivos': [
    'File', 'FileText', 'FilePlus', 'FileMinus', 'FileCheck', 'FileX', 'Files',
    'Folder', 'FolderOpen', 'FolderPlus', 'FolderMinus', 'Archive', 'Download',
    'Upload', 'CloudDownload', 'CloudUpload', 'Save', 'Printer', 'Book', 'BookOpen'
  ],
  'Tecnologia': [
    'Monitor', 'Laptop', 'Smartphone', 'Tablet', 'Watch', 'Wifi', 'WifiOff',
    'Bluetooth', 'Battery', 'BatteryCharging', 'BatteryLow', 'BatteryFull',
    'Cpu', 'HardDrive', 'Server', 'Database', 'Cloud', 'Code', 'Terminal', 'Globe'
  ],
  'Comercio': [
    'ShoppingCart', 'ShoppingBag', 'CreditCard', 'DollarSign', 'Wallet', 'Gift',
    'Package', 'Truck', 'Store', 'Receipt', 'BarChart', 'PieChart', 'TrendingUp',
    'TrendingDown', 'Activity', 'Target', 'Award', 'Trophy', 'Medal', 'Crown'
  ],
  'Redes Sociales': [
    'Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Github', 'Gitlab', 'Youtube',
    'Twitch', 'Slack', 'Discord', 'Dribbble', 'Figma', 'Framer', 'Chrome', 'Firefox'
  ],
  'Seguridad': [
    'Lock', 'Unlock', 'Key', 'Shield', 'ShieldCheck', 'ShieldAlert', 'ShieldOff',
    'Eye', 'EyeOff', 'AlertTriangle', 'AlertCircle', 'AlertOctagon', 'Info',
    'HelpCircle', 'XCircle', 'CheckCircle', 'MinusCircle', 'PlusCircle'
  ],
  'Naturaleza': [
    'Sun', 'Moon', 'Cloud', 'CloudRain', 'CloudSnow', 'CloudLightning', 'Wind',
    'Droplet', 'Droplets', 'Umbrella', 'Thermometer', 'Sunrise', 'Sunset', 'Rainbow',
    'Leaf', 'TreeDeciduous', 'Flower', 'Mountain', 'Waves', 'Flame'
  ]
}

// Get all unique icon names
const ALL_ICONS = [...new Set(Object.values(ICON_CATEGORIES).flat())]

export function IconsPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('General')
  const { getCurrentPage, addElementFromIcon, selectedSectionId } = useEditorStore()
  
  const currentPage = getCurrentPage()

  const filteredIcons = useMemo(() => {
    if (searchQuery) {
      return ALL_ICONS.filter(icon => 
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return ICON_CATEGORIES[selectedCategory] || []
  }, [searchQuery, selectedCategory])

  const handleIconClick = (iconName: string) => {
    if (!currentPage) return
    
    const targetSectionId = selectedSectionId || currentPage.sections[0]?.id
    if (!targetSectionId) return
    
    addElementFromIcon(iconName, targetSectionId, { x: 50, y: 50 })
  }

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
    if (!IconComponent) return null
    return <IconComponent className="h-5 w-5" />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 space-y-3 border-b border-white/10">
        <div className="text-xs font-semibold text-red-500 uppercase tracking-wider">
          BIBLIOTECA DE ICONOS
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar iconos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white/5 border-white/10"
          />
        </div>
      </div>

      {!searchQuery && (
        <div className="px-3 py-2 border-b border-white/10 overflow-x-auto">
          <div className="flex gap-1">
            {Object.keys(ICON_CATEGORIES).map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`text-xs whitespace-nowrap shrink-0 ${
                  selectedCategory === category 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className="grid grid-cols-5 gap-1">
            {filteredIcons.map((iconName) => (
              <Button
                key={iconName}
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-white/10 hover:text-red-400"
                onClick={() => handleIconClick(iconName)}
                title={iconName}
                disabled={!currentPage}
              >
                {renderIcon(iconName)}
              </Button>
            ))}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No se encontraron iconos
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-white/10">
        <p className="text-xs text-muted-foreground text-center">
          +1000 iconos de Lucide React
        </p>
      </div>
    </div>
  )
}
