"use client"

import { ChevronRight } from "lucide-react"
import { withAlpha } from "@/lib/color-utils"

interface CTASectionProps {
  data: Record<string, any>
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
}

export default function CTASection({ data, onPrimaryAction, onSecondaryAction }: CTASectionProps) {
  const titulo         = data.titulo         || "Comienza tu preparacion hoy"
  const descripcion    = data.descripcion    || "Unete a mas de 15,000 docentes que confian en nuestra plataforma."
  const ctaPrimario    = data.ctaPrimario    || "Crear cuenta gratis"
  const ctaPrimarioHref = data.ctaPrimarioHref || "/registro"
  const ctaSecundario  = data.ctaSecundario  || ""
  const ctaSecundarioHref = data.ctaSecundarioHref || "#precios"
  const appearance = (data.appearance as Record<string, any>) || {}
  const accentColor = appearance.accentColor || "#E8392A"
  const titleColor = appearance.titleColor
  const descriptionColor = appearance.descriptionColor
  const primaryButtonBg = appearance.primaryButtonBg || accentColor
  const primaryButtonText = appearance.primaryButtonText || "#ffffff"
  const secondaryButtonText = appearance.secondaryButtonText
  const secondaryButtonBorder = appearance.secondaryButtonBorder
  const paddingY = Math.min(220, Math.max(56, Number(appearance.sectionPaddingY || 80)))

  return (
    <section className="relative overflow-hidden" style={{ paddingTop: paddingY, paddingBottom: paddingY }}>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, ${withAlpha(accentColor, 0.14)}, ${withAlpha(accentColor, 0.06)}, ${withAlpha(accentColor, 0.14)})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${withAlpha(accentColor, 0.03)} 1px, transparent 1px), linear-gradient(90deg, ${withAlpha(accentColor, 0.03)} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: withAlpha(accentColor, 0.1) }}
      />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4" style={{ color: titleColor }}>{titulo}</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto" style={{ color: descriptionColor }}>{descripcion}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onPrimaryAction ? (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl hover:-translate-y-1 hover:brightness-110 transition-all duration-300"
              style={{
                backgroundColor: primaryButtonBg,
                color: primaryButtonText,
                boxShadow: `0 10px 30px ${withAlpha(primaryButtonBg, 0.35)}`,
              }}
            >
              {ctaPrimario}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <a
              href={ctaPrimarioHref}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-xl hover:-translate-y-1 hover:brightness-110 transition-all duration-300"
              style={{
                backgroundColor: primaryButtonBg,
                color: primaryButtonText,
                boxShadow: `0 10px 30px ${withAlpha(primaryButtonBg, 0.35)}`,
              }}
            >
              {ctaPrimario}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
          {ctaSecundario && (
            onSecondaryAction ? (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-xl hover:-translate-y-0.5 transition-all"
                style={{ borderColor: secondaryButtonBorder, color: secondaryButtonText }}
              >
                {ctaSecundario}
              </button>
            ) : (
              <a
                href={ctaSecundarioHref}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-semibold rounded-xl hover:-translate-y-0.5 transition-all"
                style={{ borderColor: secondaryButtonBorder, color: secondaryButtonText }}
              >
                {ctaSecundario}
              </a>
            )
          )}
        </div>
      </div>
    </section>
  )
}
