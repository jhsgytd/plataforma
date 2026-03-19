"use client"

import { useEffect, useRef, useState } from "react"
import { withAlpha } from "@/lib/color-utils"

interface StatItem {
  id: string
  numero: string
  label: string
  icono: string
}

interface StatsSectionProps {
  data: Record<string, any>
}

export default function StatsSection({ data }: StatsSectionProps) {
  const titulo  = data.titulo  || ""
  const items   = (data.items as StatItem[]) || []
  const appearance = (data.appearance as Record<string, any>) || {}
  const accentColor = appearance.accentColor || "#E8392A"
  const titleColor = appearance.titleColor
  const numberColor = appearance.numberColor
  const labelColor = appearance.labelColor
  const cardBg = appearance.cardBg
  const cardBorder = appearance.cardBorder
  const cardPadding = Math.min(64, Math.max(0, Number(appearance.cardPadding || 0)))
  const paddingY = Math.min(180, Math.max(40, Number(appearance.sectionPaddingY || 64)))
  const [vis, setVis] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const cols = items.length <= 2 ? "grid-cols-2" : items.length === 3 ? "grid-cols-3" : items.length === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"

  return (
    <section ref={ref} className="relative" style={{ paddingTop: paddingY, paddingBottom: paddingY }}>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, ${withAlpha(accentColor, 0.08)}, ${withAlpha(accentColor, 0.04)}, ${withAlpha(accentColor, 0.08)})` }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {titulo && (
          <h2
            className={`font-display text-3xl md:text-4xl text-foreground text-center mb-10 transition-all duration-700 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ color: titleColor }}
          >
            {titulo}
          </h2>
        )}
        {items.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
            Agrega estadísticas desde el editor de Landing Page
          </div>
        ) : (
          <div className={`grid ${cols} gap-6`}>
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`text-center group transition-all duration-700 rounded-2xl ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  style={{
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    padding: cardPadding ? `${cardPadding}px` : undefined,
                    borderWidth: cardBorder ? 1 : undefined,
                    borderStyle: cardBorder ? "solid" : undefined,
                  }}
                  className={cardBg || cardBorder || cardPadding ? "rounded-2xl" : undefined}
                >
                  {item.icono && (
                    <div className="text-4xl mb-3">{item.icono}</div>
                  )}
                  <div className="font-display text-4xl md:text-5xl text-foreground mb-1" style={{ color: numberColor }}>{item.numero}</div>
                  <div className="text-sm text-muted-foreground" style={{ color: labelColor }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
