"use client"

import { cn } from "@/lib/utils"
import StudioInlineText from "@/components/studio/studio-inline-text"

interface LogoItem {
  id: string
  label: string
  subLabel?: string
  imageUrl?: string
  href?: string
}

interface LogoStripSectionProps {
  data: Record<string, any>
  editMode?: boolean
  onActivate?: () => void
  onFieldChange?: (field: string, value: string) => void
  onItemChange?: (index: number, patch: Partial<LogoItem>) => void
}

const GRID_CLASSES: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-2 md:grid-cols-3 xl:grid-cols-6",
}

export default function LogoStripSection({
  data,
  editMode = false,
  onActivate,
  onFieldChange,
  onItemChange,
}: LogoStripSectionProps) {
  const eyebrow = data.eyebrow || ""
  const title = data.titulo || "Marcas, aliados o herramientas"
  const description = data.descripcion || "Muestra clientes, partners, instituciones o tecnologias usadas en tu flujo."
  const columns = Math.min(6, Math.max(2, Number(data.columns || 4)))
  const items = ((data.items as LogoItem[]) || []).filter((item) => item?.id || item?.label)
  const gridClass = GRID_CLASSES[columns] || GRID_CLASSES[4]

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          {eyebrow ? (
            <StudioInlineText
              as="span"
              value={eyebrow}
              editable={editMode}
              onActivate={onActivate}
              onChange={(value) => onFieldChange?.("eyebrow", value)}
              className="inline-flex rounded-full border border-primary/18 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary"
              editorClassName="inline-flex min-w-[10rem] rounded-full text-center text-xs font-bold uppercase tracking-[0.24em] text-primary"
            />
          ) : null}

          <StudioInlineText
            as="h2"
            value={title}
            editable={editMode}
            multiline
            onActivate={onActivate}
            onChange={(value) => onFieldChange?.("titulo", value)}
            className="mt-4 font-display text-4xl text-foreground md:text-5xl"
            editorClassName="mt-4 font-display text-4xl text-foreground md:text-5xl"
          />

          <StudioInlineText
            as="p"
            value={description}
            editable={editMode}
            multiline
            onActivate={onActivate}
            onChange={(value) => onFieldChange?.("descripcion", value)}
            className="mt-4 text-lg leading-relaxed text-muted-foreground"
            editorClassName="mt-4 text-lg leading-relaxed text-muted-foreground"
          />
        </div>

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-card/35 px-6 py-14 text-center text-sm text-muted-foreground">
            Agrega logos o marcas desde el editor del Studio
          </div>
        ) : (
          <div className={cn("grid gap-4", gridClass)}>
            {items.map((item, index) => {
              const content = (
                <div className="group flex h-full min-h-[178px] flex-col items-center justify-center rounded-[26px] border border-white/10 bg-card/75 px-5 py-6 text-center transition-all hover:border-primary/25 hover:bg-card">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-secondary/10">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.label || `Logo ${index + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold uppercase text-white/45">
                        {(item.label || `L${index + 1}`).slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <StudioInlineText
                    as="h3"
                    value={item.label || `Logo ${index + 1}`}
                    editable={editMode}
                    multiline
                    onActivate={onActivate}
                    onChange={(value) => onItemChange?.(index, { label: value })}
                    className="mt-4 text-sm font-semibold text-foreground"
                    editorClassName="mt-4 text-center text-sm font-semibold text-foreground"
                  />

                  {item.subLabel ? (
                    <StudioInlineText
                      as="p"
                      value={item.subLabel}
                      editable={editMode}
                      multiline
                      onActivate={onActivate}
                      onChange={(value) => onItemChange?.(index, { subLabel: value })}
                      className="mt-1 text-xs uppercase tracking-[0.18em] text-white/42"
                      editorClassName="mt-1 text-center text-xs uppercase tracking-[0.18em] text-white/60"
                    />
                  ) : null}
                </div>
              )

              if (!item.href || editMode) {
                return <div key={item.id || `logo-${index}`}>{content}</div>
              }

              return (
                <a key={item.id || `logo-${index}`} href={item.href} className="block">
                  {content}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
