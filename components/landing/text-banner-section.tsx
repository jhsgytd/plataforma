"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextBannerSectionProps {
  data: Record<string, any>
  onCtaAction?: () => void
}

export default function TextBannerSection({ data, onCtaAction }: TextBannerSectionProps) {
  const titulo      = data.titulo      || "Tu titulo aqui"
  const subtitulo   = data.subtitulo   || ""
  const descripcion = data.descripcion || ""
  const ctaLabel    = data.ctaLabel    || ""
  const ctaHref     = data.ctaHref     || "#"
  const alignment   = data.alignment   || "center"

  const alignCls = alignment === "left" ? "text-left" : alignment === "right" ? "text-right" : "text-center"
  const itemsCls = alignment === "left" ? "items-start" : alignment === "right" ? "items-end" : "items-center"

  return (
    <section className="py-20 relative">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className={cn("flex flex-col gap-4", alignCls, itemsCls)}>
          {subtitulo && (
            <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">{subtitulo}</span>
          )}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">{titulo}</h2>
          {descripcion && (
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">{descripcion}</p>
          )}
          {ctaLabel && (
            onCtaAction ? (
              <button
                type="button"
                onClick={onCtaAction}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-[#ff4433] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(232,57,42,0.4)] transition-all duration-300 mt-2"
              >
                {ctaLabel}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <a
                href={ctaHref}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-[#ff4433] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(232,57,42,0.4)] transition-all duration-300 mt-2"
              >
                {ctaLabel}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )
          )}
        </div>
      </div>
    </section>
  )
}
