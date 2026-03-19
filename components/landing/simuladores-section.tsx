"use client"

import { useEffect, useState } from "react"
import { 
  Target, Clock, BarChart3, CheckCircle, Award, 
  Brain, Sparkles, Play, ArrowRight, Monitor
} from "lucide-react"

interface SimuladoresSectionProps {
  onStartNow: () => void
}

export default function SimuladoresSection({ onStartNow }: SimuladoresSectionProps) {
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

    const element = document.getElementById("simuladores-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Target,
      title: "Preguntas Actualizadas",
      description: "Banco de mas de 5,000 preguntas basadas en examenes reales QSM"
    },
    {
      icon: Clock,
      title: "Modo Examen Real",
      description: "Simula las condiciones exactas del examen con temporizador"
    },
    {
      icon: BarChart3,
      title: "Estadisticas Detalladas",
      description: "Analisis completo de tu rendimiento por area y tema"
    },
    {
      icon: Brain,
      title: "Aprendizaje Adaptativo",
      description: "El sistema se adapta a tus areas de mejora"
    }
  ]

  const simulators = [
    {
      name: "QSM 10 - 2026",
      description: "Quiero Ser Maestro",
      questions: 150,
      time: "180 min",
      badge: "Actualizado",
      color: "from-primary to-[#ff6b5e]"
    },
    {
      name: "Ser Maestro",
      description: "Evaluacion de Desempeno",
      questions: 100,
      time: "120 min",
      badge: "Popular",
      color: "from-primary/80 to-primary"
    },
    {
      name: "Diagnostico",
      description: "Test de Nivel Gratuito",
      questions: 30,
      time: "45 min",
      badge: "Gratis",
      color: "from-[#1e2a38] to-[#2a3a4d]"
    }
  ]

  return (
    <section id="simuladores-section" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Simuladores Profesionales
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            PRACTICA CON <span className="text-primary">SIMULADORES REALES</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Preparate con simuladores identicos al examen real. Miles de preguntas actualizadas 
            y retroalimentacion instantanea para maximizar tu aprendizaje.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-foreground font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Simulators Preview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {simulators.map((sim, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(232,57,42,0.15)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${400 + i * 100}ms` }}
            >
              {/* Card Header with Gradient */}
              <div className={`h-32 bg-gradient-to-br ${sim.color} relative`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                    {sim.badge}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Monitor className="w-10 h-10 text-white/80" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-foreground font-bold text-xl mb-1">{sim.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{sim.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{sim.questions} preguntas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">{sim.time}</span>
                  </div>
                </div>

                <button
                  onClick={onStartNow}
                  className="w-full py-3 rounded-xl bg-secondary text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all group"
                >
                  <Play className="w-4 h-4" />
                  Comenzar Ahora
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Preview */}
        <div className={`relative rounded-3xl overflow-hidden border border-border bg-card transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "700ms" }}>
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-xs font-bold w-fit mb-4">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                En Vivo
              </div>
              <h3 className="font-display text-3xl lg:text-4xl text-foreground mb-4">
                EXPERIENCIA DE <span className="text-primary">EXAMEN REAL</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Nuestros simuladores replican exactamente el formato y dificultad del examen oficial. 
                Practica con preguntas de opcion multiple, temporizador y retroalimentacion inmediata.
              </p>
              
              <ul className="space-y-3 mb-8">
                {[
                  "Interfaz identica al examen INEVAL",
                  "Retroalimentacion instantanea",
                  "Explicaciones detalladas",
                  "Guardado automatico de progreso"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={onStartNow}
                className="w-fit px-8 py-4 bg-primary rounded-xl text-white font-bold flex items-center gap-2 hover:bg-[#ff4433] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,57,42,0.3)] transition-all"
              >
                <Award className="w-5 h-5" />
                Probar Simulador Gratis
              </button>
            </div>

            {/* Right Side - Preview Image */}
            <div className="relative bg-[#0a0e14] p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
              <div className="w-full max-w-md">
                {/* Simulator Preview Card */}
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-[#ff6b5e] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-white" />
                      <span className="text-white font-bold">Simulador QSM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-white/20 text-white text-xs font-bold">15/20</span>
                      <span className="text-white/80 text-sm">05:32</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1 bg-secondary">
                    <div className="h-full w-3/4 bg-primary" />
                  </div>

                  {/* Question */}
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground mb-2">Pregunta 15 de 20</p>
                    <p className="text-foreground font-medium mb-4">
                      Segun el curriculo nacional, cual es el enfoque pedagogico principal en la educacion basica?
                    </p>

                    {/* Options */}
                    <div className="space-y-2">
                      {[
                        { letter: "A", text: "Constructivismo", correct: true },
                        { letter: "B", text: "Conductismo", correct: false },
                        { letter: "C", text: "Cognitivismo", correct: false },
                        { letter: "D", text: "Conectivismo", correct: false }
                      ].map((opt, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                            opt.correct 
                              ? "border-[#22c55e] bg-[#22c55e]/10" 
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            opt.correct ? "bg-[#22c55e] text-white" : "bg-secondary text-foreground"
                          }`}>
                            {opt.letter}
                          </span>
                          <span className={`text-sm ${opt.correct ? "text-[#22c55e] font-medium" : "text-muted-foreground"}`}>
                            {opt.text}
                          </span>
                          {opt.correct && <CheckCircle className="w-4 h-4 text-[#22c55e] ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
