"use client"

import { useEffect, useState, useRef } from "react"
import {
  Target, BarChart3, Clock, Shield, Zap, Users,
  CheckCircle, TrendingUp, Award, BookOpen
} from "lucide-react"
import { useCMS, type CMSBenefitsConfig } from "@/hooks/use-cms"

const BENEFIT_ICONS = [Target, BarChart3, Clock, Shield, Zap, Users]
const STAT_ICONS = [Award, Users, BookOpen, CheckCircle]

export default function BenefitsSection({ dataOverride }: { dataOverride?: CMSBenefitsConfig }) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { config } = useCMS()
  const benefits = dataOverride ?? config.benefits

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="beneficios-section" 
      className="py-24 bg-transparent relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(232,57,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(232,57,42,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block text-primary text-sm font-bold tracking-[0.2em] uppercase mb-4">
            {benefits.sectionLabel}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {benefits.titulo}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {benefits.descripcion}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {benefits.items.map((benefit, i) => {
            const Icon = BENEFIT_ICONS[i] ?? Target
            return (
              <div
                key={i}
                className={`group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Icon Container */}
                <div className="relative mb-5">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 group-hover:border-primary/30 transition-all">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute inset-0 w-14 h-14 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-foreground font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {benefit.description}
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  {benefit.highlight}
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-3xl rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className={`relative bg-gradient-to-r from-card via-card/80 to-card border border-border rounded-3xl p-8 lg:p-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "600ms" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl" />

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.stats.map((stat, i) => {
              const Icon = STAT_ICONS[i] ?? Award
              return (
                <div key={i} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 group-hover:scale-110 group-hover:bg-primary/15 transition-all">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="font-display text-4xl lg:text-5xl text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        </div>
      </div>
    </section>
  )
}
