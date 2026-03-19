"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  Target, ClipboardCheck, BookOpen, BarChart3, TrendingUp,
  Clock, Award, Zap, ChevronRight, Play, Star, Flame
} from "lucide-react"
import type { SimuladorBuilder } from "@/simuladores/types"
import { getResultadosPorSimulador, getSimuladores } from "@/simuladores/storage"

const QUICK_ACTIONS = [
  {
    icon: Target,
    title: "Simulador QSM",
    description: "Practica con preguntas reales",
    href: "/dashboard/simuladores",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: ClipboardCheck,
    title: "Evaluacion Rapida",
    description: "Test de 10 preguntas",
    href: "/dashboard/evaluaciones",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: BookOpen,
    title: "Continuar Curso",
    description: "Saberes Pedagogicos",
    href: "/dashboard/cursos",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: BarChart3,
    title: "Ver Progreso",
    description: "Estadisticas detalladas",
    href: "/dashboard/progreso",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  qsm: "Quiero Ser Maestro",
  "ser-maestro": "Ser Maestro",
  saberes: "Saberes Pedagogicos",
  razonamiento: "Razonamiento",
}

const inferCategory = (sim: SimuladorBuilder) => {
  const text = `${sim.titulo} ${sim.descripcion}`.toLowerCase()
  if (text.includes("qsm") || text.includes("quiero ser maestro")) return "qsm"
  if (text.includes("ser maestro") || text.includes("desempeno")) return "ser-maestro"
  if (text.includes("saberes") || text.includes("pedagogico") || text.includes("didactica")) return "saberes"
  if (text.includes("razonamiento") || text.includes("numerico") || text.includes("verbal")) return "razonamiento"
  return "qsm"
}

const getCategoryLabel = (sim: SimuladorBuilder) => {
  const raw = (sim.categoria || "").trim()
  if (raw) return raw
  const categoryId = inferCategory(sim)
  return CATEGORY_LABELS[categoryId] || "Simulador"
}

const inferDifficulty = (totalQuestions: number) => {
  if (totalQuestions <= 40) return "Basico"
  if (totalQuestions <= 80) return "Intermedio"
  return "Avanzado"
}

const getTotalQuestions = (sim: SimuladorBuilder) => {
  const max = sim.config?.preguntasMax ?? sim.preguntas.length
  return Math.min(max, sim.preguntas.length)
}

const getTotalMinutes = (sim: SimuladorBuilder) => {
  const totalQuestions = getTotalQuestions(sim)
  const secondsPerQuestion = sim.config?.tiempoPregunta ?? 60
  const totalMinutes = Math.max(1, Math.round((secondsPerQuestion * totalQuestions) / 60))
  return `${totalMinutes} min`
}

const getIsNew = (id: string) => {
  const stamp = Number(id.replace("sim_", ""))
  if (!Number.isFinite(stamp)) return false
  const days = (Date.now() - stamp) / (1000 * 60 * 60 * 24)
  return days <= 14
}

const RECENT_ACTIVITY = [
  { type: "quiz", title: "Completaste QSM - Seccion 3", time: "Hace 2 horas", score: 85 },
  { type: "course", title: "Avanzaste en Razonamiento Verbal", time: "Hace 5 horas", score: null },
  { type: "achievement", title: "Desbloqueaste: Racha de 7 dias", time: "Ayer", score: null },
  { type: "quiz", title: "Completaste Evaluacion Diagnostica", time: "Hace 2 dias", score: 72 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [simuladores, setSimuladores] = useState<SimuladorBuilder[]>([])

  useEffect(() => {
    setSimuladores(getSimuladores())
  }, [])

  const simuladoresUI = useMemo(() => {
    const getStamp = (id: string) => {
      const stamp = Number(id.replace("sim_", ""))
      return Number.isFinite(stamp) ? stamp : 0
    }
    return simuladores
      .filter((sim) => sim.estado === "publicado" && !sim.cursoId && sim.categoria !== "evaluacion")
      .sort((a, b) => getStamp(b.id) - getStamp(a.id))
      .slice(0, 3)
      .map((sim) => {
        const resultados = getResultadosPorSimulador(sim.id)
        const ultimo = resultados[resultados.length - 1]
        const progress = ultimo?.porcentaje ?? 0
        const totalQuestions = getTotalQuestions(sim)
        return {
          id: sim.id,
          title: sim.titulo,
          category: getCategoryLabel(sim),
          questions: totalQuestions,
          time: getTotalMinutes(sim),
          difficulty: inferDifficulty(totalQuestions),
          progress,
          isNew: getIsNew(sim.id),
        }
      })
  }, [simuladores])

  const stats = [
    { label: "Simulacros", value: "24", icon: Target, change: "+3 esta semana" },
    { label: "Promedio", value: "82%", icon: TrendingUp, change: "+5% vs anterior" },
    { label: "Tiempo Total", value: "48h", icon: Clock, change: "12h esta semana" },
    { label: "Racha", value: "7 dias", icon: Flame, change: "Sigue asi!" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-1">
            Bienvenido, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Tu progreso esta en camino. Continua practicando para alcanzar tu meta.
          </p>
        </div>
        <Link
          href="/dashboard/simuladores"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-[#ff4433] hover:-translate-y-0.5 transition-all"
        >
          <Play className="w-4 h-4" />
          Iniciar Practica
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="font-display text-3xl text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-green-500 mt-2">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Acciones Rapidas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <h3 className="font-bold text-foreground mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Simuladores */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Simuladores Disponibles</h2>
            <Link href="/dashboard/simuladores" className="text-sm text-primary font-semibold hover:text-[#ff6b5e] transition-colors flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {simuladoresUI.length === 0 ? (
              <div className="p-6 rounded-xl bg-card border border-dashed border-border text-center text-sm text-muted-foreground">
                Aun no hay simuladores publicados.
              </div>
            ) : (
              simuladoresUI.map((sim) => (
                <div
                  key={sim.id}
                  className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{sim.title}</h3>
                        {sim.isNew && (
                          <span className="px-2 py-0.5 bg-primary/15 text-primary text-[10px] font-bold rounded-full uppercase">
                            Nuevo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{sim.category}</p>
                    </div>
                    <Link
                      href={`/simulador/${sim.id}`}
                      className="px-4 py-2 bg-primary/10 text-primary font-semibold text-sm rounded-lg hover:bg-primary hover:text-white transition-all"
                    >
                      {sim.progress > 0 ? "Continuar" : "Iniciar"}
                    </Link>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      {sim.questions} preguntas
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {sim.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      {sim.difficulty}
                    </span>
                  </div>

                  {sim.progress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="text-foreground font-medium">{sim.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${sim.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-bold text-foreground mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === "quiz" ? "bg-primary/10 text-primary" :
                    activity.type === "course" ? "bg-blue-500/10 text-blue-500" :
                    "bg-[#F5C842]/10 text-[#F5C842]"
                  }`}>
                    {activity.type === "quiz" ? <Target className="w-4 h-4" /> :
                     activity.type === "course" ? <BookOpen className="w-4 h-4" /> :
                     <Award className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{activity.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      {activity.score && (
                        <span className={`text-xs font-medium ${activity.score >= 80 ? "text-green-500" : activity.score >= 60 ? "text-amber-500" : "text-primary"}`}>
                          {activity.score}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade Card */}
          {user?.plan !== "premium" && (
            <div className="p-5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-[#F5C842]" />
                <span className="font-bold text-foreground">Premium</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Accede a todos los simuladores, cursos ilimitados y soporte prioritario.
              </p>
              <Link
                href="/dashboard/planes"
                className="block w-full py-2.5 bg-primary text-white font-semibold text-sm rounded-lg text-center hover:bg-[#ff4433] transition-colors"
              >
                Actualizar Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
