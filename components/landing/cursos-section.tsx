"use client"

import { useEffect, useState } from "react"
import { 
  BookOpen, Play, Clock, Users, Star, 
  GraduationCap, ArrowRight, CheckCircle, Sparkles
} from "lucide-react"

interface CursosSectionProps {
  onStartNow: () => void
}

export default function CursosSection({ onStartNow }: CursosSectionProps) {
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

    const element = document.getElementById("cursos-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const courses = [
    {
      title: "Razonamiento Logico",
      category: "Razonamiento",
      image: "/images/curso-razonamiento.jpg",
      lessons: 24,
      hours: 12,
      students: 2847,
      rating: 4.9,
      instructor: "Dr. Carlos Mendez",
      color: "from-primary to-[#ff6b5e]",
      icon: "calc",
      popular: true
    },
    {
      title: "Saberes Pedagogicos",
      category: "Pedagogia",
      image: "/images/curso-pedagogia.jpg",
      lessons: 32,
      hours: 18,
      students: 3521,
      rating: 4.8,
      instructor: "Msc. Ana Rodriguez",
      color: "from-primary/80 to-primary",
      icon: "book",
      popular: true
    },
    {
      title: "Curriculo Nacional",
      category: "Educacion",
      image: "/images/curso-curriculo.jpg",
      lessons: 18,
      hours: 8,
      students: 1923,
      rating: 4.7,
      instructor: "Lic. Maria Torres",
      color: "from-[#1e2a38] to-[#2a3a4d]",
      icon: "file",
      popular: false
    },
    {
      title: "Matematicas Aplicadas",
      category: "Especialidad",
      image: "/images/curso-matematicas.jpg",
      lessons: 28,
      hours: 15,
      students: 2156,
      rating: 4.9,
      instructor: "Ing. Roberto Luna",
      color: "from-[#2a3a4d] to-[#3a4a5d]",
      icon: "ruler",
      popular: false
    }
  ]

  const categories = [
    "Todos",
    "Razonamiento",
    "Pedagogia",
    "Educacion Inicial",
    "Ciencias",
    "Matematicas",
    "Idiomas"
  ]

  const benefits = [
    "Acceso ilimitado a todos los cursos",
    "Certificados de finalizacion",
    "Material descargable",
    "Soporte de instructores"
  ]

  return (
    <section id="cursos-section" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-20 w-80 h-80 bg-[#3b82f6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-sm font-semibold mb-6">
            <GraduationCap className="w-4 h-4" />
            Catalogo de Cursos
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            EXPLORA NUESTROS <span className="text-primary">CURSOS</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cursos especializados disenados por expertos para ayudarte a dominar 
            cada area del examen QSM y alcanzar el puntaje que necesitas.
          </p>
        </div>

        {/* Categories - Static Display */}
        <div className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
          {categories.map((cat, i) => (
            <span
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === 0 
                  ? "bg-primary text-white" 
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              {/* Course Image/Header */}
              <div className={`h-36 bg-gradient-to-br ${course.color} relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20" />
                {course.popular && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </div>
                )}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {course.icon === "calc" && (
                    <div className="text-white text-2xl font-bold">
                      <span className="text-lg">1</span><span className="text-lg">2</span><br/>
                      <span className="text-lg">3</span><span className="text-lg">4</span>
                    </div>
                  )}
                  {course.icon === "book" && <BookOpen className="w-8 h-8 text-white" />}
                  {course.icon === "file" && <GraduationCap className="w-8 h-8 text-white" />}
                  {course.icon === "ruler" && (
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zm-1 16H5V5h14v14zM7 7h2v10H7V7zm4 4h2v6h-2v-6zm4-2h2v8h-2V9z"/>
                    </svg>
                  )}
                </div>
              </div>

              {/* Course Content */}
              <div className="p-5">
                <span className="text-xs text-primary font-semibold uppercase tracking-wide">
                  {course.category}
                </span>
                <h3 className="text-foreground font-bold text-lg mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">{course.instructor}</p>

                {/* Stats */}
                <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {course.lessons} lecciones
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.hours}h
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                    <span className="text-foreground font-semibold">{course.rating}</span>
                    <span className="text-muted-foreground text-xs">({course.students.toLocaleString()})</span>
                  </div>
                  <button
                    onClick={onStartNow}
                    className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-white transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`bg-gradient-to-r from-[#141b24] to-[#1e2a38] rounded-3xl p-8 lg:p-12 border border-border transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "700ms" }}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display text-3xl lg:text-4xl text-foreground mb-4">
                ACCEDE A <span className="text-primary">TODOS LOS CURSOS</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                Desbloquea mas de 50 cursos especializados, material de estudio 
                exclusivo y acceso ilimitado a nuestra plataforma.
              </p>
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-[#22c55e] flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <button
                onClick={onStartNow}
                className="px-8 py-4 bg-primary rounded-xl text-white font-bold flex items-center gap-2 hover:bg-[#ff4433] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(232,57,42,0.3)] transition-all"
              >
                <Users className="w-5 h-5" />
                Unirme Ahora
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Display */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "50+", label: "Cursos Disponibles", icon: BookOpen },
                { value: "300+", label: "Horas de Contenido", icon: Clock },
                { value: "15K+", label: "Estudiantes Activos", icon: Users },
                { value: "98%", label: "Tasa de Aprobacion", icon: Star }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border text-center">
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <div className="font-display text-3xl text-foreground mb-1">{stat.value}</div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
