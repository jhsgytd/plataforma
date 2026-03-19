"use client"

import Image from "next/image"
import { Play } from "lucide-react"

interface HeroProps {
  onSimuladorClick?: () => void
}

export default function Hero({ onSimuladorClick }: HeroProps) {
  return (
    <section className="relative py-10 lg:py-16 px-6 lg:px-12 overflow-hidden">
      {/* Background Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Red Glow Blob */}
      <div 
        className="absolute right-0 top-0 w-[60%] h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 60% 50%, rgba(232,57,42,0.08), transparent 70%)'
        }}
      />

      <div className="relative z-10 grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-5 items-center max-w-7xl mx-auto">
        {/* Content */}
        <div className="animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/12 border border-primary/35 px-3 py-1 rounded-full text-[10px] font-bold text-[#ff6b5e] uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            Plataforma #1 para Docentes Ecuatorianos
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-wide text-white mb-4">
            Domina tu
            <br />
            <span className="text-primary">Evaluacion</span>
            <br />
            Docente
          </h1>

          {/* Description */}
          <p className="text-[13px] lg:text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
            Simuladores actualizados, bancos de preguntas historicos y capacitacion continua 
            para asegurar tu exito profesional en el Magisterio Nacional.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button 
              onClick={onSimuladorClick}
              className="flex items-center gap-2 px-6 py-3 bg-primary rounded-lg text-[13px] font-bold text-white hover:bg-[#ff4433] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,57,42,0.45)] transition-all"
            >
              🎯 Ver Simuladores
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-border rounded-lg text-[13px] font-semibold text-foreground hover:border-primary/50 hover:text-white transition-all">
              <Play className="w-4 h-4" />
              Como Funciona
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 lg:gap-7">
            <div>
              <div className="font-display text-3xl lg:text-4xl text-white leading-none">
                41,910<span className="text-primary">+</span>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Docentes comunidad
              </div>
            </div>
            <div className="w-px bg-border self-stretch hidden sm:block" />
            <div>
              <div className="font-display text-3xl lg:text-4xl text-white leading-none">
                700<span className="text-primary">/1000</span>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Meta puntaje QSM
              </div>
            </div>
            <div className="w-px bg-border self-stretch hidden sm:block" />
            <div>
              <div className="font-display text-3xl lg:text-4xl text-white leading-none">
                17<span className="text-primary">+</span>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                Especialidades
              </div>
            </div>
          </div>
        </div>

        {/* Logo Side */}
        <div className="relative flex items-center justify-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {/* Floating Chip - Top Left */}
          <div className="absolute top-[10%] left-0 lg:-left-[10%] bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2 z-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
            <div>
              <div className="font-display text-lg text-white leading-none">41K+</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">Docentes</div>
            </div>
          </div>

          {/* Main Logo Image */}
          <div className="relative w-[200px] h-[220px] lg:w-[260px] lg:h-[280px]">
            <Image
              src="/images/logo.png"
              alt="Hack Evans - White Hat Security"
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(232,57,42,0.3)]"
              priority
            />
          </div>

          {/* Floating Chip - Bottom Right */}
          <div className="absolute bottom-[12%] right-0 lg:-right-[6%] bg-card border border-green-500/30 rounded-lg px-3 py-2 flex items-center gap-2 z-10 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <div>
              <div className="font-display text-lg text-white leading-none">98%</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">Satisfaccion</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
