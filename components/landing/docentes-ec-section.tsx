"use client"

import { useEffect, useState } from "react"
import { Award, BookOpen, CheckCircle2, Users } from "lucide-react"

interface DocentesECSectionProps {
  onGetStarted?: () => void
  onWatchDemo?: () => void
}

const HIGHLIGHTS = [
  "Simuladores por area y perfil docente",
  "Rutas de estudio personalizadas",
  "Seguimiento real de progreso",
  "Banco de preguntas actualizado",
]

const STATS = [
  { value: "15K+", label: "Docentes EC", icon: Users },
  { value: "98%", label: "Tasa de aprobacion", icon: Award },
  { value: "5,000+", label: "Preguntas reales", icon: BookOpen },
]

export default function DocentesECSection({ onGetStarted, onWatchDemo }: DocentesECSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,57,42,0.12),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 mb-6">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">Docentes EC</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-5">
              Preparacion enfocada en
              <span className="text-primary"> docentes ecuatorianos</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              Accede a simuladores actualizados, evaluaciones por perfil y reportes claros para tu
              avance. Todo alineado al proceso oficial en Ecuador.
            </p>

            <ul className="space-y-3 mb-8">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="group flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-[#ff4433] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,57,42,0.4)] transition-all duration-300"
              >
                Comenzar Ahora
              </button>
              <button
                onClick={onWatchDemo}
                className="group flex items-center justify-center gap-2 px-7 py-3.5 border border-border text-foreground font-semibold rounded-xl hover:border-primary hover:text-primary transition-all"
              >
                Ver Demo
              </button>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-150 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-[0.2em]">
                Resultados reales
              </div>
              <div className="space-y-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-border/70 bg-secondary/20 px-4 py-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
