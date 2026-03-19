"use client"

import { Check, ChevronRight } from "lucide-react"

interface ImageTextSectionProps {
  data: Record<string, any>
  onCtaAction?: () => void
}

export default function ImageTextSection({ data, onCtaAction }: ImageTextSectionProps) {
  const titulo         = data.titulo         || "La mejor preparacion para docentes"
  const descripcion    = data.descripcion    || "Nuestra plataforma ofrece todo lo que necesitas para aprobar el examen QSM."
  const bullets        = (data.bullets as string[]) || []
  const imageUrl       = data.imageUrl       || ""
  const imagePosition  = data.imagePosition  || "right"
  const ctaLabel       = data.ctaLabel       || "Conocer mas"
  const ctaHref        = data.ctaHref        || "/registro"

  const contentBlock = (
    <div className="space-y-6">
      <h2 className="font-display text-4xl md:text-5xl text-foreground">{titulo}</h2>
      <p className="text-muted-foreground text-lg leading-relaxed">{descripcion}</p>
      {bullets.length > 0 && (
        <ul className="space-y-3">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-foreground">{b}</span>
            </li>
          ))}
        </ul>
      )}
      {ctaLabel && (
        onCtaAction ? (
          <button
            type="button"
            onClick={onCtaAction}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#ff4433] hover:-translate-y-0.5 transition-all"
          >
            {ctaLabel}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <a
            href={ctaHref}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#ff4433] hover:-translate-y-0.5 transition-all"
          >
            {ctaLabel}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        )
      )}
    </div>
  )

  const visualBlock = (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-video">
      {imageUrl ? (
        <img src={imageUrl} alt={titulo} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary/20">
          <div className="text-center">
            <div className="text-5xl mb-3">🖼️</div>
            <div className="text-sm text-muted-foreground">Agrega una imagen desde el editor</div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {imagePosition === "left" ? (
            <>{visualBlock}{contentBlock}</>
          ) : (
            <>{contentBlock}{visualBlock}</>
          )}
        </div>
      </div>
    </section>
  )
}
