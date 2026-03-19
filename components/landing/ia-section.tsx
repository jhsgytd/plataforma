"use client"

import { useEffect, useState } from "react"
import { BarChart3, Brain, CheckCircle2, Sparkles, Zap } from "lucide-react"

interface IASectionProps {
  onGetStarted?: () => void
  onWatchDemo?: () => void
}

const FEATURES = [
  {
    icon: Brain,
    title: "Rutas inteligentes",
    description: "La IA detecta tus debilidades y prioriza temas clave.",
  },
  {
    icon: Sparkles,
    title: "Generacion de preguntas",
    description: "Banco dinamico con variaciones y explicaciones claras.",
  },
  {
    icon: BarChart3,
    title: "Analisis avanzado",
    description: "Reportes visuales con progreso por competencia.",
  },
]

const CHECKS = [
  "Recomendaciones personalizadas",
  "Feedback inmediato por pregunta",
  "Ajuste automatico del nivel",
]

export default function IASection({ onGetStarted, onWatchDemo }: IASectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(64,120,255,0.12),transparent_55%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 mb-4">
            <Zap className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-xs font-bold tracking-[0.2em] text-[#3b82f6] uppercase">IA</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-4">
            Inteligencia Artificial para tu preparacion
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Automatiza el estudio con asistentes inteligentes, diagnosticos rapidos y planes
            ajustados a tu nivel.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`rounded-2xl border border-border bg-card/80 p-6 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/15 text-[#3b82f6] flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
          <div className="space-y-3">
            {CHECKS.map((item) => (
              <div key={item} className="flex items-center gap-3 text-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={onGetStarted}
              className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-[#3b82f6] text-white font-bold rounded-xl hover:bg-[#2563eb] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] transition-all duration-300"
            >
              Probar IA
            </button>
            <button
              onClick={onWatchDemo}
              className="group flex items-center justify-center gap-2 px-7 py-3.5 border border-border text-foreground font-semibold rounded-xl hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all"
            >
              Ver Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
