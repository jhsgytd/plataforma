"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import StudioInlineText from "@/components/studio/studio-inline-text"

interface FAQSectionProps {
  data: Record<string, any>
  editMode?: boolean
  onActivate?: () => void
  onFieldChange?: (field: "titulo" | "descripcion", value: string) => void
  onItemChange?: (index: number, patch: { pregunta?: string; respuesta?: string }) => void
}

export default function FAQSection({
  data,
  editMode = false,
  onActivate,
  onFieldChange,
  onItemChange,
}: FAQSectionProps) {
  const titulo      = data.titulo      || "Preguntas frecuentes"
  const descripcion = data.descripcion || "Todo lo que necesitas saber sobre la plataforma."
  const items       = (data.items as { id: string; pregunta: string; respuesta: string }[]) || []
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="py-20 relative">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <StudioInlineText
            as="h2"
            value={titulo}
            editable={editMode}
            multiline
            onActivate={onActivate}
            onChange={(value) => onFieldChange?.("titulo", value)}
            className="font-display text-4xl md:text-5xl text-foreground mb-4"
            editorClassName="mx-auto max-w-3xl font-display text-4xl md:text-5xl text-foreground text-center"
          />
          <StudioInlineText
            as="p"
            value={descripcion}
            editable={editMode}
            multiline
            onActivate={onActivate}
            onChange={(value) => onFieldChange?.("descripcion", value)}
            className="text-muted-foreground text-lg"
            editorClassName="mx-auto max-w-2xl text-center text-lg text-muted-foreground"
          />
        </div>
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border border-dashed border-border rounded-2xl text-sm">
              Agrega preguntas desde el editor de Landing Page
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30">
                <button
                  onClick={() => {
                    if (editMode) return
                    setOpenId(openId === item.id ? null : item.id)
                  }}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-secondary/20 transition-colors"
                >
                  <StudioInlineText
                    as="span"
                    value={item.pregunta}
                    editable={editMode}
                    multiline
                    onActivate={onActivate}
                    onChange={(value) => onItemChange?.(items.findIndex((entry) => entry.id === item.id), { pregunta: value })}
                    className="font-semibold text-foreground"
                    editorClassName="font-semibold text-foreground"
                  />
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform", (editMode || openId === item.id) && "rotate-180")} />
                </button>
                {(editMode || openId === item.id) && (
                  <div className="px-6 pb-5 pt-0">
                    <div className="h-px bg-border mb-4" />
                    <StudioInlineText
                      as="p"
                      value={item.respuesta}
                      editable={editMode}
                      multiline
                      onActivate={onActivate}
                      onChange={(value) => onItemChange?.(items.findIndex((entry) => entry.id === item.id), { respuesta: value })}
                      className="text-muted-foreground leading-relaxed"
                      editorClassName="text-muted-foreground leading-relaxed"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
