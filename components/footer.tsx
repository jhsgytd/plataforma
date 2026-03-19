"use client"

import Image from "next/image"
import { Facebook, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-border pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/images/logo.png" alt="Hack Evans" width={44} height={44} />
              <div>
                <div className="font-display text-2xl text-white">Hack Evans</div>
                <div className="text-[9px] text-muted-foreground tracking-widest uppercase">
                  Consultoria Educativa
                </div>
              </div>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-6">
              Plataforma #1 para docentes ecuatorianos. Preparacion integral para QSM, 
              evaluaciones y ascenso de categoria.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/HackrEvans"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/40 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@planificacionecu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/40 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="mailto:contacto@hackevans.com"
                className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/40 transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Navegacion</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Inicio", href: "/" },
                { label: "Beneficios", href: "#beneficios" },
                { label: "Testimonios", href: "#testimonios" },
                { label: "Precios", href: "#precios" },
                { label: "Contacto", href: "#contacto" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[13px] text-muted-foreground hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Terminos de Servicio", href: "#contacto" },
                { label: "Politica de Privacidad", href: "#contacto" },
                { label: "Politica de Cookies", href: "#contacto" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[13px] text-muted-foreground hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            (c) {new Date().getFullYear()} Hack Evans. Todos los derechos reservados.
          </p>
          
        </div>
      </div>
    </footer>
  )
}


