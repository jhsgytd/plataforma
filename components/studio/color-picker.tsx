"use client"

import { useState, useRef, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pipette } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
}

const presetColors = [
  // Reds
  "#ef4444", "#dc2626", "#b91c1c",
  // Oranges
  "#f97316", "#ea580c", "#c2410c",
  // Yellows
  "#eab308", "#ca8a04", "#a16207",
  // Greens
  "#22c55e", "#16a34a", "#15803d",
  // Blues
  "#3b82f6", "#2563eb", "#1d4ed8",
  // Purples
  "#a855f7", "#9333ea", "#7c3aed",
  // Pinks
  "#ec4899", "#db2777", "#be185d",
  // Grays
  "#ffffff", "#f5f5f5", "#e5e5e5",
  "#d4d4d4", "#a3a3a3", "#737373",
  "#525252", "#404040", "#262626",
  "#171717", "#0a0a0a", "#000000",
  // Transparent
  "transparent",
]

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    // Validate hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue) || /^#[0-9A-Fa-f]{3}$/.test(newValue) || newValue === "transparent") {
      onChange(newValue)
    }
  }

  const handleColorSelect = (color: string) => {
    setInputValue(color)
    onChange(color)
  }

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setInputValue(color)
    onChange(color)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label className="text-xs text-muted-foreground">{label}</Label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-9 px-3"
          >
            <div
              className="h-4 w-4 rounded border border-border"
              style={{
                backgroundColor: value === "transparent" ? undefined : value,
                backgroundImage: value === "transparent" 
                  ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                  : undefined,
                backgroundSize: "8px 8px",
                backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
              }}
            />
            <span className="text-xs font-mono truncate flex-1 text-left">
              {value}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            {/* Color Input */}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="#000000"
                className="h-8 text-xs font-mono"
              />
              <div className="relative">
                <input
                  type="color"
                  value={value === "transparent" ? "#000000" : value}
                  onChange={handleNativePickerChange}
                  className="absolute inset-0 w-8 h-8 opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Pipette className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preset Colors */}
            <div className="grid grid-cols-6 gap-1.5">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`
                    h-6 w-6 rounded border border-border transition-transform hover:scale-110
                    ${value === color ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
                  `}
                  style={{
                    backgroundColor: color === "transparent" ? undefined : color,
                    backgroundImage: color === "transparent"
                      ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                      : undefined,
                    backgroundSize: "6px 6px",
                    backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
                  }}
                  title={color}
                />
              ))}
            </div>

            {/* Quick Presets */}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={() => handleColorSelect("transparent")}
              >
                Transparente
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={() => handleColorSelect("#ffffff")}
              >
                Blanco
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={() => handleColorSelect("#000000")}
              >
                Negro
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
