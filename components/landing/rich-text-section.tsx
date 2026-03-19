"use client"

import { CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import StudioInlineText from "@/components/studio/studio-inline-text"

interface RichTextSectionProps {
  data: Record<string, any>
  editMode?: boolean
  onActivate?: () => void
  onFieldChange?: (field: string, value: string) => void
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
}

const WIDTH_CLASSES: Record<string, string> = {
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
}

export default function RichTextSection({
  data,
  editMode = false,
  onActivate,
  onFieldChange,
  onPrimaryAction,
  onSecondaryAction,
}: RichTextSectionProps) {
  const eyebrow = data.eyebrow || ""
  const title = data.titulo || "Construye cualquier seccion"
  const description = data.descripcion || "Usa este bloque para titulares, descripcion, listas, llamados a la accion y contenido editorial sin tocar codigo."
  const body = data.body || ""
  const bullets = ((data.bullets as string[]) || []).filter(Boolean)
  const alignment = data.alignment || "left"
  const maxWidth = WIDTH_CLASSES[data.maxWidth || "lg"] || WIDTH_CLASSES.lg
  const primaryLabel = data.primaryLabel || ""
  const primaryHref = data.primaryHref || "/registro"
  const secondaryLabel = data.secondaryLabel || ""
  const secondaryHref = data.secondaryHref || "/simulador"

  const isCentered = alignment === "center"
  const isRight = alignment === "right"
  const blockAlignment = isCentered ? "items-center text-center mx-auto" : isRight ? "items-end text-right ml-auto" : "items-start text-left"
  const contentWidth = isCentered ? `${maxWidth} mx-auto` : isRight ? `${maxWidth} ml-auto` : maxWidth
  const bulletsWidth = isCentered ? "mx-auto" : isRight ? "ml-auto" : ""
  const buttonsAlignment = isCentered ? "justify-center" : isRight ? "justify-end" : "justify-start"

  const runAction = (action?: () => void, fallbackHref?: string) => {
    if (editMode) return
    if (action) {
      action()
      return
    }
    if (fallbackHref) {
      window.location.href = fallbackHref
    }
  }

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className={cn("flex flex-col gap-5", contentWidth, blockAlignment)}>
          {eyebrow ? (
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <StudioInlineText
                as="span"
                value={eyebrow}
                editable={editMode}
                onActivate={onActivate}
                onChange={(value) => onFieldChange?.("eyebrow", value)}
                className="text-xs font-bold uppercase tracking-[0.24em] text-primary"
                editorClassName="min-w-[10rem] text-xs font-bold uppercase tracking-[0.24em] text-primary"
              />
            </div>
          ) : null}

          <StudioInlineText
            as="h2"
            value={title}
            editable={editMode}
            multiline
            onActivate={onActivate}
            onChange={(value) => onFieldChange?.("titulo", value)}
            className="font-display text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl"
            editorClassName="font-display text-4xl leading-tight text-foreground md:text-5xl"
          />

          <StudioInlineText
            as="p"
            value={description}
            editable={editMode}
            multiline
            onActivate={onActivate}
            onChange={(value) => onFieldChange?.("descripcion", value)}
            className="max-w-3xl text-lg leading-relaxed text-muted-foreground"
            editorClassName="max-w-3xl text-lg leading-relaxed text-muted-foreground"
          />

          {body ? (
            <StudioInlineText
              as="div"
              value={body}
              editable={editMode}
              multiline
              onActivate={onActivate}
              onChange={(value) => onFieldChange?.("body", value)}
              className="max-w-3xl whitespace-pre-line text-base leading-8 text-white/78"
              editorClassName="max-w-3xl whitespace-pre-line text-base leading-8 text-white/78"
            />
          ) : null}

          {bullets.length > 0 ? (
            <div className={cn("grid w-full gap-3 pt-2", bulletsWidth)}>
              {bullets.map((item, index) => (
                <div key={`${item}-${index}`} className={cn("flex items-start gap-3", isRight && "flex-row-reverse")}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="max-w-2xl text-sm leading-7 text-white/76">{item}</span>
                </div>
              ))}
            </div>
          ) : null}

          {primaryLabel || secondaryLabel ? (
            <div className={cn("flex w-full flex-col gap-3 pt-3 sm:flex-row", buttonsAlignment)}>
              {primaryLabel ? (
                <button
                  type="button"
                  onClick={() => runAction(onPrimaryAction, primaryHref)}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90"
                >
                  <StudioInlineText
                    as="span"
                    value={primaryLabel}
                    editable={editMode}
                    onActivate={onActivate}
                    onChange={(value) => onFieldChange?.("primaryLabel", value)}
                    allowLink={false}
                    className="text-sm font-semibold text-white"
                    editorClassName="min-w-[9rem] text-center text-sm font-semibold text-white"
                  />
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : null}

              {secondaryLabel ? (
                <button
                  type="button"
                  onClick={() => runAction(onSecondaryAction, secondaryHref)}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-white/78 transition-all hover:border-primary/30 hover:text-white"
                >
                  <StudioInlineText
                    as="span"
                    value={secondaryLabel}
                    editable={editMode}
                    onActivate={onActivate}
                    onChange={(value) => onFieldChange?.("secondaryLabel", value)}
                    allowLink={false}
                    className="text-sm font-semibold text-white/78"
                    editorClassName="min-w-[9rem] text-center text-sm font-semibold text-white"
                  />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
