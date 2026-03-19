"use client"

import { useEffect, useRef, useState } from "react"
import { 
  Mail, Phone, MapPin, Clock, Send, 
  MessageSquare, HelpCircle, FileText
} from "lucide-react"

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "soporte@hackevans.com" },
  { icon: Phone, label: "Telefono", value: "+593 99 123 4567" },
  { icon: MapPin, label: "Ubicacion", value: "Quito, Ecuador" },
  { icon: Clock, label: "Horario", value: "Lun - Vie: 8am - 6pm" },
]

const FAQ = [
  {
    question: "Como funcionan los simuladores?",
    answer: "Los simuladores replican exactamente las condiciones del examen real: mismo tiempo, formato de preguntas y estructura. Al finalizar, recibiras un analisis detallado de tu rendimiento.",
  },
  {
    question: "Puedo acceder desde cualquier dispositivo?",
    answer: "Si, nuestra plataforma es 100% responsive. Puedes practicar desde tu computadora, tablet o celular en cualquier momento.",
  },
  {
    question: "Con que frecuencia se actualizan las preguntas?",
    answer: "Actualizamos nuestro banco de preguntas mensualmente, basandonos en las ultimas convocatorias y cambios en el curriculo nacional.",
  },
  {
    question: "Ofrecen garantia de aprobacion?",
    answer: "Aunque no podemos garantizar resultados, el 98% de nuestros usuarios que completan el programa de preparacion aprueban sus evaluaciones.",
  },
]

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="contacto" className="py-24 bg-transparent relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 relative">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Contacto</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            Estamos aqui para
            <span className="text-primary"> ayudarte</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Nuestro equipo de soporte esta disponible para resolver todas tus dudas
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Enviar mensaje</h3>
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Asunto</label>
                  <input
                    type="text"
                    placeholder="Como podemos ayudarte?"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Mensaje</label>
                  <textarea
                    rows={4}
                    placeholder="Escribe tu mensaje..."
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-xl hover:bg-[#ff4433] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,57,42,0.35)] transition-all"
                >
                  <Send className="w-5 h-5" />
                  Enviar Mensaje
                </button>
              </form>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border">
                {CONTACT_INFO.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm font-medium text-foreground">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Preguntas Frecuentes</h3>
                <p className="text-sm text-muted-foreground">Respuestas rapidas a dudas comunes</p>
              </div>
            </div>

            <div className="space-y-4">
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border overflow-hidden transition-colors hover:border-primary/30"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-foreground pr-4">{item.question}</span>
                    <FileText className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-muted-foreground animate-fade-in">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Help */}
            <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
              <h4 className="font-bold text-foreground mb-2">Necesitas mas ayuda?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Nuestro equipo de soporte esta disponible para asistirte personalmente.
              </p>
              <a 
                href="https://wa.me/593991234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-[#ff4433] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Chat en WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
