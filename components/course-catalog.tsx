"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface Course {
  id: number
  area: string
  emoji: string
  title: string
  desc: string
  q: number
  hrs: number
  badge: string | null
  rating: number
  price: "Pro" | "Free"
  color: string
}

const ALL_COURSES: Course[] = [
  { id: 1, area: "Razonamiento", emoji: "🔢", title: "Razonamiento Verbal Avanzado", desc: "Domina analogias, sinonimos y comprension lectora tipo INEVAL.", q: 450, hrs: 12, badge: "hot", rating: 4.9, price: "Pro", color: "rgba(232,57,42,0.4)" },
  { id: 2, area: "Razonamiento", emoji: "📐", title: "Razonamiento Numerico y Abstracto", desc: "Series, matrices y operaciones matematicas al nivel QSM.", q: 380, hrs: 10, badge: "hot", rating: 4.8, price: "Pro", color: "rgba(232,57,42,0.35)" },
  { id: 3, area: "Pedagogia", emoji: "🧠", title: "Saberes Pedagogicos Generales", desc: "Teorias del aprendizaje, curriculo y didactica para el INEVAL.", q: 520, hrs: 15, badge: "new", rating: 4.9, price: "Pro", color: "rgba(232,57,42,0.3)" },
  { id: 4, area: "Pedagogia", emoji: "💡", title: "Pensamiento Computacional", desc: "Algoritmos, patrones y descomposicion en contexto educativo.", q: 280, hrs: 8, badge: "new", rating: 4.7, price: "Pro", color: "rgba(232,57,42,0.28)" },
  { id: 5, area: "Educacion Inicial", emoji: "🌱", title: "Educacion Inicial – Subnivel 1 y 2", desc: "Desarrollo infantil, juego y metodologias activas para 0-5 anos.", q: 360, hrs: 11, badge: null, rating: 4.8, price: "Pro", color: "rgba(232,57,42,0.25)" },
  { id: 6, area: "Ciencias", emoji: "🔬", title: "Ciencias Naturales – EGB y BGU", desc: "Biologia, quimica y fisica alineadas al perfil docente INEVAL.", q: 410, hrs: 13, badge: "hot", rating: 4.7, price: "Pro", color: "rgba(232,57,42,0.22)" },
  { id: 7, area: "Matematicas", emoji: "∑", title: "Matematicas – Educacion Basica y Bachillerato", desc: "Algebra, geometria y estadistica para docentes de matematicas.", q: 490, hrs: 14, badge: "hot", rating: 4.9, price: "Pro", color: "rgba(232,57,42,0.2)" },
  { id: 8, area: "Idiomas", emoji: "🌐", title: "Ingles – Suficiencia Linguistica B2", desc: "Grammar, reading y listening para el perfil de idiomas extranjeros.", q: 320, hrs: 12, badge: "new", rating: 4.6, price: "Pro", color: "rgba(232,57,42,0.18)" },
  { id: 9, area: "Humanidades", emoji: "📖", title: "Lengua y Literatura – EGB", desc: "Comprension lectora, escritura y literatura ecuatoriana.", q: 340, hrs: 10, badge: null, rating: 4.7, price: "Pro", color: "rgba(232,57,42,0.16)" },
  { id: 10, area: "Digital", emoji: "💻", title: "Pedagogia Digital para Docentes", desc: "Herramientas TIC, Google Classroom, Canva y recursos educativos.", q: 180, hrs: 8, badge: "free", rating: 4.8, price: "Free", color: "rgba(232,57,42,0.14)" },
  { id: 11, area: "SIME / Magisterio", emoji: "🛡️", title: "Quiero Ser Maestro – Guia Completa", desc: "Todo el proceso QSM paso a paso: inscripcion, pruebas y nombramiento.", q: 50, hrs: 6, badge: "new", rating: 5.0, price: "Pro", color: "rgba(232,57,42,0.12)" },
  { id: 12, area: "Evaluacion", emoji: "📊", title: "Evaluacion de Desempeno Ser Maestro", desc: "Preparacion para la evaluacion de desempeno docente en servicio.", q: 260, hrs: 9, badge: null, rating: 4.6, price: "Pro", color: "rgba(232,57,42,0.1)" },
]

const AREAS = [
  "Todos",
  "Razonamiento",
  "Pedagogia",
  "Educacion Inicial",
  "Ciencias",
  "Matematicas",
  "Idiomas",
  "Humanidades",
  "Digital",
  "SIME / Magisterio",
  "Evaluacion",
]

export default function CourseCatalog() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("Todos")
  const [sort, setSort] = useState("popular")

  const filtered = useMemo(() => {
    let list = ALL_COURSES
    if (filter !== "Todos") list = list.filter((c) => c.area === filter)
    if (search)
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.area.toLowerCase().includes(search.toLowerCase()) ||
          c.desc.toLowerCase().includes(search.toLowerCase())
      )
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === "questions") list = [...list].sort((a, b) => b.q - a.q)
    return list
  }, [search, filter, sort])

  return (
    <section id="cursos" className="py-12 lg:py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="text-[10px] font-bold uppercase tracking-[3px] text-primary mb-3">
            Catalogo de Cursos
          </div>
          <h2 className="font-display text-4xl lg:text-5xl text-white leading-[0.93]">
            Explora nuestros <span className="text-primary">Cursos</span>
          </h2>
        </div>

        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-3.5 mb-8 items-start sm:items-center animate-fade-up">
          <div className="flex-1 relative min-w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              className="w-full bg-card border border-border rounded-xl py-3 px-4 pl-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all"
              placeholder="Buscar por area, nivel o tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="bg-card border border-border rounded-xl py-3 px-4 text-[13px] text-foreground focus:border-primary/40 outline-none transition-colors cursor-pointer"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="popular">Mas populares</option>
            <option value="rating">Mejor valorados</option>
            <option value="questions">Mas preguntas</option>
          </select>
          <span className="text-[13px] text-muted-foreground whitespace-nowrap">{filtered.length} cursos</span>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          {AREAS.map((a) => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-semibold border border-border bg-transparent text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground",
                filter === a && "bg-primary/15 border-primary/50 text-[#ff6b5e]"
              )}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <div className="text-5xl mb-4">🔍</div>
              <div className="text-base">
                No encontramos cursos con ese criterio.
                <br />
                Intenta con otro termino.
              </div>
            </div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_20px_44px_rgba(0,0,0,0.5)] transition-all cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* Thumbnail */}
                <div
                  className="h-28 flex items-center justify-center text-5xl relative"
                  style={{
                    background: `linear-gradient(135deg, ${c.color} 0%, rgba(13,17,23,1) 100%)`,
                  }}
                >
                  {c.emoji}
                  {c.badge && (
                    <div
                      className={cn(
                        "absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full",
                        c.badge === "new" && "bg-green-500/15 text-green-500 border border-green-500/30",
                        c.badge === "hot" && "bg-primary/15 text-[#ff6b5e] border border-primary/30",
                        c.badge === "free" && "bg-[#F5C842]/15 text-[#F5C842] border border-[#F5C842]/30"
                      )}
                    >
                      {c.badge === "new" ? "Nuevo" : c.badge === "hot" ? "🔥 Popular" : "Gratis"}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">{c.area}</div>
                  <div className="text-[15px] font-bold text-white leading-tight mb-2">{c.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-4">{c.desc}</div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="text-xs text-muted-foreground">
                        📝 <span className="text-foreground font-semibold">{c.q}</span> preguntas
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ⏱ <span className="text-foreground font-semibold">{c.hrs}h</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[#F5C842] text-[10px]">★★★★★</span>
                      <span className="text-xs font-bold text-foreground">{c.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
                  <div
                    className={cn("font-display text-xl", c.price === "Free" ? "text-green-500" : "text-white")}
                  >
                    {c.price === "Free" ? "Gratis" : "Plan Pro"}
                  </div>
                  <button
                    className={cn(
                      "px-4 py-2 rounded-lg text-[11px] font-bold transition-all",
                      c.price === "Free"
                        ? "bg-green-500/15 border border-green-500/30 text-green-500 hover:bg-green-500/25"
                        : "bg-primary text-white hover:bg-[#ff4433] hover:shadow-[0_6px_18px_rgba(232,57,42,0.4)]"
                    )}
                  >
                    {c.price === "Free" ? "Acceder →" : "Ver curso →"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
