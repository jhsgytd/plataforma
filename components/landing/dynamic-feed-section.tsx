"use client"

import Link from "next/link"
import { BookOpen, ChevronRight, ClipboardCheck, Clock3, GraduationCap, LayoutGrid, Sparkles, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CMSSection } from "@/hooks/use-cms"
import type { LandingBuilderItem } from "@/hooks/use-landing-builder-data"
import StudioInlineText from "@/components/studio/studio-inline-text"

const SECTION_COPY = {
  simulatorsFeed: {
    badge: "Simuladores",
    title: "Simuladores destacados",
    description: "Muestra simuladores publicados conectados directamente desde el admin.",
    button: "Abrir simulador",
    cta: "Ver simuladores",
    href: "/dashboard/simuladores",
    icon: Target,
  },
  coursesFeed: {
    badge: "Cursos",
    title: "Cursos destacados",
    description: "Expone los cursos activos para convertir la landing en un catalogo modular.",
    button: "Ver curso",
    cta: "Explorar cursos",
    href: "/dashboard/cursos",
    icon: GraduationCap,
  },
  evaluationsFeed: {
    badge: "Evaluaciones",
    title: "Evaluaciones activas",
    description: "Conecta evaluaciones publicadas para mostrarlas como parte del embudo principal.",
    button: "Abrir evaluacion",
    cta: "Ver evaluaciones",
    href: "/dashboard/evaluaciones",
    icon: ClipboardCheck,
  },
} as const

function cardColumns(columns: number) {
  if (columns === 2) return "lg:grid-cols-2"
  if (columns === 4) return "lg:grid-cols-4"
  return "lg:grid-cols-3"
}

interface DynamicFeedSectionProps {
  section: CMSSection
  items: LandingBuilderItem[]
  editing?: boolean
  editMode?: boolean
  onActivate?: () => void
  onFieldChange?: (field: string, value: string) => void
  onCtaAction?: () => void
}

export default function DynamicFeedSection({
  section,
  items,
  editing = false,
  editMode = false,
  onActivate,
  onFieldChange,
  onCtaAction,
}: DynamicFeedSectionProps) {
  const copy = SECTION_COPY[section.type as keyof typeof SECTION_COPY]
  if (!copy) return null

  const source = section.settings?.source
  const title = section.data?.titulo || copy.title
  const description = section.data?.descripcion || copy.description
  const badge = section.data?.badge || copy.badge
  const ctaLabel = section.data?.ctaLabel || copy.cta
  const ctaHref = section.data?.ctaHref || copy.href
  const display = source?.display || "grid"
  const columns = Math.min(4, Math.max(2, Number(source?.columns || 3)))
  const showMeta = source?.showMeta !== false
  const showButton = source?.showButton !== false
  const showBadge = source?.showBadge !== false
  const Icon = copy.icon

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Icon className="h-4 w-4" />
              <StudioInlineText
                as="span"
                value={badge}
                editable={editMode}
                onActivate={onActivate}
                onChange={(value) => onFieldChange?.("badge", value)}
                className="text-sm font-semibold text-primary"
                editorClassName="min-w-[10rem] text-sm font-semibold text-primary"
              />
            </div>
            <StudioInlineText
              as="h2"
              value={title}
              editable={editMode}
              multiline
              onActivate={onActivate}
              onChange={(value) => onFieldChange?.("titulo", value)}
              className="mt-5 font-display text-4xl text-foreground md:text-5xl lg:text-6xl"
              editorClassName="mt-5 font-display text-4xl text-foreground md:text-5xl lg:text-6xl"
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

          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-white/10 bg-card/60 px-4 py-3 text-sm text-white/55 lg:flex">
              <LayoutGrid className="mr-2 h-4 w-4 text-primary" />
              {items.length} bloque{items.length === 1 ? "" : "s"} conectados
            </div>
            {onCtaAction ? (
              <button
                type="button"
                onClick={onCtaAction}
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90"
              >
                <StudioInlineText
                  as="span"
                  value={ctaLabel}
                  editable={editMode}
                  onActivate={onActivate}
                  onChange={(value) => onFieldChange?.("ctaLabel", value)}
                  className="text-sm font-semibold text-white"
                  editorClassName="min-w-[10rem] text-sm font-semibold text-white"
                />
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <Link
                href={ctaHref}
                onClick={editing ? (event) => event.preventDefault() : undefined}
                className="inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90"
              >
                <StudioInlineText
                  as="span"
                  value={ctaLabel}
                  editable={editMode}
                  onActivate={onActivate}
                  onChange={(value) => onFieldChange?.("ctaLabel", value)}
                  className="text-sm font-semibold text-white"
                  editorClassName="min-w-[10rem] text-sm font-semibold text-white"
                />
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-card/60 px-8 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div className="mt-4 text-xl font-semibold text-foreground">
              {editing ? "Este bloque todavia no tiene datos conectados" : "Sin contenido disponible"}
            </div>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
              {editing
                ? "Configura la fuente en modo automatico o manual y publica simuladores, cursos o evaluaciones para llenar el bloque."
                : "El administrador aun no ha publicado contenido suficiente para este bloque."}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              display === "carousel"
                ? "flex snap-x gap-5 overflow-x-auto pb-2"
                : `grid gap-5 md:grid-cols-2 ${cardColumns(columns)}`
            )}
          >
            {items.map((item) => (
              <article
                key={item.id}
                className={cn(
                  "group relative overflow-hidden rounded-[28px] border border-white/10 bg-card/75 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.25)]",
                  display === "carousel" && "min-w-[320px] snap-start md:min-w-[360px]"
                )}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: item.accentColor || "#E8392A" }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                    style={{ backgroundColor: `${item.accentColor || "#E8392A"}18` }}
                  >
                    {item.emoji || "✨"}
                  </div>
                  {showBadge && item.badge ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5">
                  {item.category ? (
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                      {item.category}
                    </div>
                  ) : null}
                  <h3 className="mt-2 text-2xl font-semibold text-foreground">{item.title}</h3>
                  {item.subtitle ? <div className="mt-2 text-sm text-white/55">{item.subtitle}</div> : null}
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>

                {showMeta ? (
                  <div className="mt-6 grid gap-2">
                    {item.metrics.slice(0, 3).map((metric) => (
                      <div key={metric.key} className="flex items-center gap-2 text-sm text-white/60">
                        <Clock3 className="h-3.5 w-3.5 text-primary/70" />
                        <span className="font-medium text-white/90">{metric.value}</span>
                        <span className="text-white/45">{metric.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                {showButton ? (
                  <div className="mt-6">
                    <Link
                      href={item.href}
                      onClick={editing ? (event) => event.preventDefault() : undefined}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-primary/30 hover:bg-primary/10"
                    >
                      {copy.button}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
