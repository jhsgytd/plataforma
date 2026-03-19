"use client"

import { useEffect, useState } from "react"
import { 
  ClipboardCheck, TrendingUp, Target, Award,
  FileText, PieChart, Calendar, CheckCircle2, ArrowRight
} from "lucide-react"

interface EvaluacionesSectionProps {
  onStartNow: () => void
}

export default function EvaluacionesSection({ onStartNow }: EvaluacionesSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById("evaluaciones-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const evaluationTypes = [
    {
      icon: FileText,
      title: "Evaluaciones Diagnosticas",
      description: "Identifica tu nivel actual y areas de mejora antes de comenzar",
      stats: "30 min"
    },
    {
      icon: Target,
      title: "Evaluaciones por Tema",
      description: "Practica especifica por cada area del examen oficial",
      stats: "15 areas"
    },
    {
      icon: ClipboardCheck,
      title: "Evaluaciones Finales",
      description: "Simula el examen completo con todas las condiciones reales",
      stats: "180 min"
    },
    {
      icon: TrendingUp,
      title: "Seguimiento de Progreso",
      description: "Visualiza tu evolucion con graficos y metricas detalladas",
      stats: "En tiempo real"
    }
  ]

  const stats = [
    { value: "15+", label: "Areas de Evaluacion" },
    { value: "98%", label: "Precision en Preguntas" },
    { value: "24/7", label: "Disponibilidad" },
    { value: "5K+", label: "Usuarios Activos" }
  ]

  return (
    <section id="evaluaciones-section" className="py-24 bg-[#0a0e14] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(232,57,42,0.15) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-sm font-semibold mb-6">
            <ClipboardCheck className="w-4 h-4" />
            Sistema de Evaluaciones
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            EVALUA TU <span className="text-primary">CONOCIMIENTO</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sistema integral de evaluaciones que te permite medir tu progreso, 
            identificar debilidades y fortalecer tus conocimientos de manera sistematica.
          </p>
        </div>

        {/* Stats Bar */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-card/50 border border-border">
              <div className="font-display text-3xl md:text-4xl text-primary mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left - Evaluation Types */}
          <div className="space-y-4">
            {evaluationTypes.map((type, i) => (
              <div
                key={i}
                className={`group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/15 transition-all">
                    <type.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-foreground font-bold text-lg">{type.title}</h3>
                      <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium">
                        {type.stats}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Dashboard Preview */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{ transitionDelay: "600ms" }}>
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl">
              {/* Dashboard Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">Tu Progreso</p>
                    <p className="text-xs text-muted-foreground">Ultima semana</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Marzo 2026</span>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="p-6 space-y-6">
                {/* Progress Rings */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Completado", value: 78, color: "#E8392A" },
                    { label: "Precision", value: 85, color: "#ff6b5e" },
                    { label: "Velocidad", value: 72, color: "#E8392A" }
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-2">
                        <svg className="w-full h-full -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-secondary"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${item.value * 2.01} 201`}
                            className="transition-all duration-1000"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-foreground font-bold">
                          {item.value}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Actividad Reciente</p>
                  <div className="space-y-2">
                    {[
                      { name: "Saberes Pedagogicos", score: 92 },
                      { name: "Razonamiento Verbal", score: 78 },
                      { name: "Curriculo Nacional", score: 88 }
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground">{activity.name}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {activity.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={onStartNow}
                  className="w-full py-4 bg-primary rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-[#ff4433] transition-all group"
                >
                  <Award className="w-5 h-5" />
                  Comenzar Evaluacion
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
