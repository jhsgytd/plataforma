"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface PlanFeature {
  icon: "check" | "x"
  txt: string
  ok: boolean
}

interface Plan {
  name: string
  desc: string
  monthly: number
  yearly: number
  period: string
  featured: boolean
  popular: boolean
  origYearly?: number
  cta: string
  ctaCls: "primary" | "outline"
  features: PlanFeature[]
}

const PLANS: Plan[] = [
  {
    name: "Gratuito",
    desc: "Para empezar tu preparacion sin costo.",
    monthly: 0,
    yearly: 0,
    period: "/mes",
    featured: false,
    popular: false,
    cta: "Comenzar Gratis",
    ctaCls: "outline",
    features: [
      { icon: "check", txt: "10 preguntas de practica diarias", ok: true },
      { icon: "check", txt: "1 simulador de diagnostico", ok: true },
      { icon: "check", txt: "Resultados basicos sin explicacion", ok: true },
      { icon: "check", txt: "Acceso a blog educativo", ok: true },
      { icon: "x", txt: "Simuladores cronometrados Pro", ok: false },
      { icon: "x", txt: "Banco completo de preguntas", ok: false },
      { icon: "x", txt: "Explicaciones detalladas", ok: false },
      { icon: "x", txt: "Cursos de especialidad", ok: false },
    ],
  },
  {
    name: "Pro",
    desc: "El plan ideal para prepararte a fondo para el QSM.",
    monthly: 12,
    yearly: 8,
    period: "/mes",
    featured: true,
    popular: true,
    origYearly: 12,
    cta: "Empezar Ahora — 7 dias gratis",
    ctaCls: "primary",
    features: [
      { icon: "check", txt: "Simuladores cronometrados ilimitados", ok: true },
      { icon: "check", txt: "Banco completo: 5,000+ preguntas", ok: true },
      { icon: "check", txt: "Explicaciones detalladas por respuesta", ok: true },
      { icon: "check", txt: "Estadisticas y progreso detallado", ok: true },
      { icon: "check", txt: "Cursos de especialidad (17 areas)", ok: true },
      { icon: "check", txt: "Modo examen oficial simulado", ok: true },
      { icon: "check", txt: "Acceso 24/7 desde cualquier dispositivo", ok: true },
      { icon: "x", txt: "Asesoria personalizada SIME", ok: false },
    ],
  },
  {
    name: "Magisterio",
    desc: "Preparacion completa mas asesoria experta.",
    monthly: 24,
    yearly: 16,
    period: "/mes",
    featured: false,
    popular: false,
    origYearly: 24,
    cta: "Contactar Asesor",
    ctaCls: "outline",
    features: [
      { icon: "check", txt: "Todo lo del plan Pro", ok: true },
      { icon: "check", txt: "Asesoria personalizada SIME", ok: true },
      { icon: "check", txt: "Guia de ascenso de categoria", ok: true },
      { icon: "check", txt: "Mentoria grupal semanal en vivo", ok: true },
      { icon: "check", txt: "Acceso a material exclusivo", ok: true },
      { icon: "check", txt: "Soporte prioritario WhatsApp", ok: true },
      { icon: "check", txt: "Certificado de preparacion", ok: true },
      { icon: "check", txt: "Acceso de por vida al material", ok: true },
    ],
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  const price = (p: Plan) => (annual ? p.yearly : p.monthly)

  return (
    <section id="pricing" className="py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-[11px] font-bold uppercase tracking-[3px] text-primary mb-3">
            Planes y Precios
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[0.93] mb-4">
            Invierte en tu <span className="text-primary">Carrera Docente</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
            Elige el plan que se adapta a tu nivel de preparacion. Sin sorpresas, cancela cuando quieras.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3.5 bg-card border border-border rounded-full px-5 py-1.5">
            <span
              onClick={() => setAnnual(false)}
              className={cn(
                "text-sm font-semibold cursor-pointer transition-colors",
                !annual ? "text-white" : "text-muted-foreground"
              )}
            >
              Mensual
            </span>
            <button
              onClick={() => setAnnual((a) => !a)}
              className={cn(
                "w-12 h-7 rounded-full relative transition-colors",
                annual ? "bg-primary" : "bg-border"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
                  annual ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
            <span
              onClick={() => setAnnual(true)}
              className={cn(
                "text-sm font-semibold cursor-pointer transition-colors",
                annual ? "text-white" : "text-muted-foreground"
              )}
            >
              Anual
              {annual && (
                <span className="ml-1.5 text-[11px] font-bold bg-green-500/15 text-green-500 border border-green-500/30 px-2 py-0.5 rounded-full animate-pop-in">
                  Ahorras 33%
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={cn(
                "relative bg-card border border-border rounded-2xl p-8 overflow-hidden transition-all duration-300 animate-fade-up",
                "hover:-translate-y-1.5 hover:shadow-[0_28px_56px_rgba(0,0,0,0.5)]",
                plan.featured && "border-primary/50 shadow-[0_0_0_1px_rgba(232,57,42,0.15),0_24px_60px_rgba(232,57,42,0.15)]",
                plan.featured && "hover:shadow-[0_28px_56px_rgba(232,57,42,0.25)]"
              )}
              style={{ animationDelay: `${0.1 + i * 0.12}s` }}
            >
              {/* Top line */}
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-0.5",
                  plan.featured
                    ? "bg-gradient-to-r from-transparent via-primary to-transparent"
                    : "bg-border"
                )}
              />

              {/* Shimmer effect for featured */}
              {plan.featured && <div className="absolute inset-0 pointer-events-none animate-shimmer" />}

              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide animate-pop-in">
                  ⭐ Mas Popular
                </div>
              )}

              <div className="font-display text-3xl tracking-wide text-white mb-1.5">{plan.name}</div>
              <div className="text-[13px] text-muted-foreground leading-relaxed mb-6">{plan.desc}</div>

              {/* Price */}
              <div className="flex items-end gap-1 mb-2">
                <span className="text-xl font-bold text-muted-foreground mb-2">$</span>
                <span className="font-display text-6xl text-white leading-none">{price(plan)}</span>
                <span className="text-sm text-muted-foreground mb-2">{plan.period}</span>
              </div>

              {annual && plan.origYearly && (
                <div className="text-[13px] text-muted-foreground line-through mb-5">
                  Antes ${plan.origYearly}/mes
                  <span className="text-green-500 no-underline ml-1.5 font-bold">
                    Ahorras ${(plan.origYearly - plan.yearly) * 12}/ano
                  </span>
                </div>
              )}
              {!annual && <div className="h-6" />}

              {/* Features */}
              <div className="flex flex-col gap-2.5 mb-7 border-t border-border pt-6">
                {plan.features.map((f, j) => (
                  <div
                    key={j}
                    className={cn(
                      "flex items-start gap-2.5 text-sm",
                      !f.ok && "text-muted-foreground line-through opacity-50"
                    )}
                  >
                    {f.ok ? (
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    {f.txt}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                className={cn(
                  "w-full py-3.5 rounded-xl text-[15px] font-bold transition-all",
                  plan.ctaCls === "primary" &&
                    "bg-primary text-white hover:bg-[#ff4433] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(232,57,42,0.5)]",
                  plan.ctaCls === "outline" &&
                    "bg-transparent border-2 border-border text-foreground hover:border-primary/40 hover:bg-primary/6 hover:text-white"
                )}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
