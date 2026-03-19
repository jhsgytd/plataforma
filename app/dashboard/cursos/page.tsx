"use client"

import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import Link from "next/link"
import {
  Search, BookOpen, Clock, Users, Star, Play,
  ChevronRight, Award, TrendingUp, Lock, CheckCircle,
  Calculator, Brain, Beaker, Languages, Globe, Monitor,
  GraduationCap, FileText, Sparkles, Key, BarChart3,
  Target, Video, Link2, Layers, Trophy, X, Check,
  AlertCircle, ChevronDown, ChevronUp, Eye, Tag, Paperclip,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { resolveCourseResourceUrl } from "@/lib/course-resource-utils"

// ─── Tipos locales ────────────────────────────────────────────────────────────

type CursoEstado = "borrador" | "en_revision" | "publicado" | "archivado"
type RecursoTipo = "video" | "documento" | "enlace" | "simulador" | "evaluacion" | "texto"
type AccesoTipo = "libre" | "clave" | "plan"

interface AdjuntoCurso {
  id: string; titulo: string; tipo: "documento" | "enlace"; url: string; archivoNombre?: string
}
interface RecursoCurso {
  id: string; tipo: RecursoTipo; titulo: string; descripcion?: string
  url?: string; simuladorId?: string; evaluacionId?: string
  archivoNombre?: string
  duracionMinutos?: number; orden: number; gratis: boolean
  adjuntos?: AdjuntoCurso[]
}
interface SeccionCurso { id: string; titulo: string; descripcion?: string; orden: number; recursos: RecursoCurso[] }
interface CursoData {
  id: string; titulo: string; subtitulo?: string; descripcion: string
  instructor: string; categoria: string; nivel: string; estado: CursoEstado
  acceso: AccesoTipo; clavematricula?: string; precio?: number; precioOriginal?: number
  colorPortada?: string; iconoPortada?: string; idioma?: string
  tags?: string[]; requisitos?: string[]; objetivos?: string[]
  secciones: SeccionCurso[]; certificado?: boolean
  mostrarSimuladoresDashboard?: boolean; mostrarEvaluacionesDashboard?: boolean
  destacado?: boolean; popular?: boolean; nuevo?: boolean; createdAt: string
}
interface MatriculaData { id: string; userId: string; cursoId: string; fechaMatricula: string; progreso: number; completado: boolean }

// ─── Storage ──────────────────────────────────────────────────────────────────

function parseSafe<T>(v: string | null, fb: T): T {
  try { return v ? JSON.parse(v) ?? fb : fb } catch { return fb }
}
const CURSOS_KEY = "he_cursos"
const MATRICULAS_KEY = "he_matriculas"

function getCursos(): CursoData[] {
  if (typeof window === "undefined") return []
  return parseSafe(localStorage.getItem(CURSOS_KEY), [])
}
function getCursosPublicados(): CursoData[] {
  return getCursos().filter(c => c.estado === "publicado")
}
function getMatriculas(): MatriculaData[] {
  if (typeof window === "undefined") return []
  return parseSafe(localStorage.getItem(MATRICULAS_KEY), [])
}
function matricular(m: MatriculaData) {
  const list = getMatriculas()
  if (list.some(x => x.userId === m.userId && x.cursoId === m.cursoId)) return
  list.push(m)
  localStorage.setItem(MATRICULAS_KEY, JSON.stringify(list))
}
function estaMatriculado(userId: string, cursoId: string) {
  return getMatriculas().some(m => m.userId === userId && m.cursoId === cursoId)
}
function getProgreso(userId: string, cursoId: string) {
  return getMatriculas().find(m => m.userId === userId && m.cursoId === cursoId)?.progreso ?? 0
}
function updateProgresoMatricula(userId: string, cursoId: string, pct: number) {
  if (typeof window === "undefined") return
  const mats = getMatriculas()
  const idx = mats.findIndex(m => m.userId === userId && m.cursoId === cursoId)
  if (idx >= 0) { mats[idx].progreso = pct; mats[idx].completado = pct === 100; localStorage.setItem(MATRICULAS_KEY, JSON.stringify(mats)) }
}

const PRG_KEY = (u: string, c: string) => `he_prg_${u}_${c}`
const VPK = (u: string, c: string, r: string) => `he_vp_${u}_${c}_${r}`

function loadProgresoLocal(uid: string, cid: string): { completados: string[]; leccionId?: string } {
  if (typeof window === "undefined") return { completados: [] }
  return parseSafe(localStorage.getItem(PRG_KEY(uid, cid)), { completados: [] })
}
function saveProgresoLocal(uid: string, cid: string, completados: string[], leccionId?: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(PRG_KEY(uid, cid), JSON.stringify({ completados, leccionId }))
}
function loadVideoPos(uid: string, cid: string, rid: string): number {
  if (typeof window === "undefined") return 0
  const v = localStorage.getItem(VPK(uid, cid, rid))
  return v ? Number(v) || 0 : 0
}
function saveVideoPos(uid: string, cid: string, rid: string, t: number) {
  if (typeof window === "undefined") return
  localStorage.setItem(VPK(uid, cid, rid), String(Math.floor(t)))
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function recursoVisibleEnDashboard(curso: CursoData, recurso: RecursoCurso) {
  if (recurso.tipo === "simulador") return curso.mostrarSimuladoresDashboard !== false
  if (recurso.tipo === "evaluacion") return curso.mostrarEvaluacionesDashboard !== false
  return true
}

function totalLecciones(c: CursoData) {
  return c.secciones.reduce((acc, sec) => acc + sec.recursos.filter((recurso) => recursoVisibleEnDashboard(c, recurso)).length, 0)
}
function totalMinutos(c: CursoData) {
  return c.secciones.reduce(
    (acc, sec) => acc + sec.recursos
      .filter((recurso) => recursoVisibleEnDashboard(c, recurso))
      .reduce((sum, recurso) => sum + (recurso.duracionMinutos || 0), 0),
    0
  )
}

const CATEGORIA_ICON: Record<string, React.ElementType> = {
  razonamiento: Calculator, pedagogia: Brain, matematicas: Calculator,
  ciencias: Beaker, idiomas: Languages, humanidades: Globe,
  digital: Monitor, "educacion-inicial": GraduationCap, sime: FileText,
  evaluacion: Award, otros: Sparkles,
}
const CATEGORIA_LABEL: Record<string, string> = {
  razonamiento: "Razonamiento", pedagogia: "Pedagogía", matematicas: "Matemáticas",
  ciencias: "Ciencias", idiomas: "Idiomas", humanidades: "Humanidades",
  digital: "Digital", "educacion-inicial": "Educación Inicial", sime: "SIME / Magisterio",
  evaluacion: "Evaluación", otros: "Otros",
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={cn("h-3.5 w-3.5", i <= Math.round(rating) ? "text-[#F5C842] fill-[#F5C842]" : "text-border")} />
      ))}
      <span className="text-xs font-semibold text-foreground ml-0.5">{rating > 0 ? rating.toFixed(1) : ""}</span>
    </div>
  )
}

// ─── Modal de Matrícula ───────────────────────────────────────────────────────

function ModalMatricula({ curso, userId, onSuccess, onClose }: {
  curso: CursoData; userId: string; onSuccess: () => void; onClose: () => void
}) {
  const [clave, setClave] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleMatricular = async () => {
    setError("")
    if (curso.acceso === "clave") {
      if (!clave.trim()) { setError("Ingresa la clave de matrícula"); return }
      if (clave.trim().toUpperCase() !== (curso.clavematricula || "").toUpperCase()) {
        setError("Clave incorrecta. Verifica e intenta nuevamente."); return
      }
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    matricular({ id: `mat_${Date.now()}`, userId, cursoId: curso.id, fechaMatricula: new Date().toISOString(), progreso: 0, completado: false })
    setLoading(false)
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {/* Header con portada mini */}
        <div className="flex items-center gap-4 mb-5">
          <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl bg-gradient-to-br", curso.colorPortada || "from-emerald-600 to-green-700")}>
            {curso.iconoPortada || "📚"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-foreground line-clamp-1">{curso.titulo}</div>
            <div className="text-xs text-muted-foreground">{curso.instructor}</div>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          {curso.acceso === "libre" && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-center">
              <div className="text-2xl mb-1">🎉</div>
              <div className="text-sm font-semibold text-emerald-400">¡Curso gratuito!</div>
              <div className="text-xs text-muted-foreground mt-1">Puedes matricularte sin ningún costo.</div>
            </div>
          )}

          {curso.acceso === "clave" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 p-3 flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-xs text-amber-400">Este curso requiere una clave de matrícula</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clave de matrícula</label>
                <input
                  type="text"
                  className="h-10 rounded-xl border border-border bg-secondary/15 px-3.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-all"
                  value={clave}
                  onChange={e => { setClave(e.target.value.toUpperCase()); setError("") }}
                  placeholder="Ingresa la clave aquí..."
                  onKeyDown={e => e.key === "Enter" && handleMatricular()}
                />
                {error && <div className="flex items-center gap-1.5 text-xs text-red-400"><AlertCircle className="h-3.5 w-3.5" />{error}</div>}
                <div className="text-[11px] text-muted-foreground">Solicita la clave a tu instructor o administrador.</div>
              </div>
            </div>
          )}

          {curso.acceso === "plan" && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/8 p-4 text-center space-y-2">
              <Lock className="h-8 w-8 text-violet-400 mx-auto" />
              <div className="text-sm font-semibold text-violet-400">Requiere plan activo</div>
              <div className="text-xs text-muted-foreground">Actualiza tu plan para acceder a este curso.</div>
              <button type="button" onClick={onClose} className="mt-2 w-full py-2 bg-violet-500 text-white text-xs font-semibold rounded-xl hover:bg-violet-600 transition-colors">Ver planes disponibles</button>
            </div>
          )}

          {/* Info del curso */}
          <div className="rounded-xl border border-border bg-secondary/8 p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><div className="text-sm font-bold text-foreground">{totalLecciones(curso)}</div><div className="text-[10px] text-muted-foreground">Lecciones</div></div>
              <div><div className="text-sm font-bold text-foreground">{Math.floor(totalMinutos(curso) / 60)}h</div><div className="text-[10px] text-muted-foreground">Duración</div></div>
              <div><div className="text-sm font-bold text-foreground">{curso.nivel}</div><div className="text-[10px] text-muted-foreground">Nivel</div></div>
            </div>
          </div>

          {curso.acceso !== "plan" && (
            <button type="button" onClick={handleMatricular} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all">
              {loading ? <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Matriculando...</> : <><Check className="h-4 w-4" />Matricularme gratis</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Vista de Curso (interior) ────────────────────────────────────────────────

function VistaCurso({ curso, userId, onVolver }: { curso: CursoData; userId: string; onVolver: () => void }) {
  const saved = useMemo(() => loadProgresoLocal(userId, curso.id), [userId, curso.id])
  const mostrarSimuladores = curso.mostrarSimuladoresDashboard !== false
  const mostrarEvaluaciones = curso.mostrarEvaluacionesDashboard !== false

  const recursoVisibleEnDashboard = useCallback((recurso: RecursoCurso) => {
    if (recurso.tipo === "simulador") return mostrarSimuladores
    if (recurso.tipo === "evaluacion") return mostrarEvaluaciones
    return true
  }, [mostrarSimuladores, mostrarEvaluaciones])

  const allRecursos = useMemo(() => curso.secciones.flatMap(s => s.recursos.filter(recursoVisibleEnDashboard)), [curso.secciones, recursoVisibleEnDashboard])
  const savedLesson = saved.leccionId ? allRecursos.find(r => r.id === saved.leccionId) ?? null : null
  const savedSec = savedLesson ? curso.secciones.find(s => s.recursos.some(r => r.id === savedLesson.id))?.id ?? null : null
  const [seccionAbierta, setSeccionAbierta] = useState<string | null>(savedSec ?? curso.secciones[0]?.id ?? null)
  const [recursoActivo, setRecursoActivo] = useState<RecursoCurso | null>(savedLesson ?? allRecursos[0] ?? null)
  const [completados, setCompletados] = useState<string[]>(saved.completados)
  const [vistaTab, setVistaTab] = useState<"curso" | "simuladores" | "evaluaciones">("curso")
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const recursosVisiblesCurso = curso.secciones.flatMap((sec) => sec.recursos).filter(recursoVisibleEnDashboard)
  const recursosVisiblesIds = new Set(recursosVisiblesCurso.map((rec) => rec.id))
  const completadosVisibles = completados.filter((recId) => recursosVisiblesIds.has(recId))
  const totalRecursosVisibles = recursosVisiblesCurso.length

  const progreso = totalRecursosVisibles > 0
    ? Math.round((completadosVisibles.length / totalRecursosVisibles) * 100)
    : 0

  // Persist progress + update matricula %
  useEffect(() => {
    saveProgresoLocal(userId, curso.id, completados, recursoActivo?.id)
    const visIds = new Set(allRecursos.map(r => r.id))
    const done = completados.filter(id => visIds.has(id)).length
    const pct = allRecursos.length > 0 ? Math.round((done / allRecursos.length) * 100) : 0
    updateProgresoMatricula(userId, curso.id, pct)
  }, [completados, recursoActivo?.id, userId, curso.id, allRecursos])

  const marcarCompletado = useCallback((recId: string) => {
    if (!completados.includes(recId)) {
      setCompletados(p => {
        const next = [...p, recId]
        saveProgresoLocal(userId, curso.id, next, recursoActivo?.id)
        return next
      })
    }
  }, [completados, userId, curso.id, recursoActivo?.id])

  // Open section when active lesson changes
  useEffect(() => {
    if (!recursoActivo) return
    const sec = curso.secciones.find(s => s.recursos.some(r => r.id === recursoActivo.id))
    if (sec) setSeccionAbierta(sec.id)
  }, [recursoActivo?.id, curso.secciones])

  // Restore native video position when active resource changes
  useEffect(() => {
    if (!recursoActivo || recursoActivo.tipo !== "video") return
    const savedTime = loadVideoPos(userId, curso.id, recursoActivo.id)
    if (videoRef.current && savedTime > 3) {
      videoRef.current.currentTime = savedTime
    }
  }, [recursoActivo?.id, userId, curso.id])

  // YouTube postMessage: detect video ended (state 0) for auto-complete
  useEffect(() => {
    if (!recursoActivo || recursoActivo.tipo !== "video") return
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "onStateChange" && data?.info === 0) marcarCompletado(recursoActivo.id)
      } catch { /* ignore */ }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [recursoActivo?.id, marcarCompletado])

  const tipoIcon = (tipo: RecursoTipo) => {
    const icons: Record<RecursoTipo, React.ReactNode> = {
      video: <Video className="h-4 w-4" />,
      documento: <FileText className="h-4 w-4" />,
      enlace: <Link2 className="h-4 w-4" />,
      texto: <BookOpen className="h-4 w-4" />,
      simulador: <Target className="h-4 w-4" />,
      evaluacion: <Award className="h-4 w-4" />,
    }
    return icons[tipo] || <FileText className="h-4 w-4" />
  }

  const seccionesVista = curso.secciones
    .map((sec) => ({
      ...sec,
      recursos:
        vistaTab === "simuladores"
          ? sec.recursos.filter((rec) => rec.tipo === "simulador" && mostrarSimuladores)
          : vistaTab === "evaluaciones"
            ? sec.recursos.filter((rec) => rec.tipo === "evaluacion" && mostrarEvaluaciones)
            : sec.recursos.filter(recursoVisibleEnDashboard),
    }))
    .filter((sec) => sec.recursos.length > 0)

  const tabsDisponibles = [
    { id: "curso" as const, label: "Curso", icon: BookOpen, visible: true },
    { id: "simuladores" as const, label: "Simuladores", icon: Target, visible: mostrarSimuladores },
    { id: "evaluaciones" as const, label: "Evaluaciones", icon: Award, visible: mostrarEvaluaciones },
  ].filter((tabItem) => tabItem.visible)

  const recursoActivoInfo = recursoActivo ? resolveCourseResourceUrl(recursoActivo.tipo, recursoActivo.url) : null
  const seccionActiva = recursoActivo
    ? curso.secciones.find((sec) => sec.recursos.some((rec) => rec.id === recursoActivo.id)) || null
    : null
  const dashboardTabHref =
    vistaTab === "simuladores"
      ? `/dashboard/simuladores?cursoId=${encodeURIComponent(curso.id)}`
      : vistaTab === "evaluaciones"
        ? `/dashboard/evaluaciones?cursoId=${encodeURIComponent(curso.id)}`
        : null

  useEffect(() => {
    if (vistaTab === "simuladores" && !mostrarSimuladores) {
      setVistaTab("curso")
      return
    }
    if (vistaTab === "evaluaciones" && !mostrarEvaluaciones) {
      setVistaTab("curso")
    }
  }, [mostrarEvaluaciones, mostrarSimuladores, vistaTab])

  useEffect(() => {
    const recursoDisponible = seccionesVista.flatMap((sec) => sec.recursos)[0] || null
    if (!recursoDisponible) {
      setSeccionAbierta(null)
      setRecursoActivo(null)
      return
    }
    setSeccionAbierta((current) => {
      if (current && seccionesVista.some((sec) => sec.id === current)) return current
      return seccionesVista[0]?.id || null
    })
    setRecursoActivo((actual) => {
      if (actual && seccionesVista.some((sec) => sec.recursos.some((rec) => rec.id === actual.id))) {
        return actual
      }
      return recursoDisponible
    })
  }, [seccionesVista, vistaTab])

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Header del curso */}
      <div className="mb-6">
        <button type="button" onClick={onVolver} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
          <ChevronRight className="h-4 w-4 rotate-180" />Volver a cursos
        </button>
        <div className="flex items-center gap-4">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl bg-gradient-to-br", curso.colorPortada || "from-emerald-600 to-green-700")}>
            {curso.iconoPortada || "📚"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-foreground text-xl line-clamp-1">{curso.titulo}</h1>
            <div className="text-sm text-muted-foreground">{curso.instructor}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-bold text-primary">{progreso}% completado</div>
            <div className="text-xs text-muted-foreground">{completadosVisibles.length}/{totalRecursosVisibles} lecciones</div>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-secondary/40 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progreso}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabsDisponibles.map((tabItem) => {
            const Icon = tabItem.icon
            return (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => setVistaTab(tabItem.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
                  vistaTab === tabItem.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                )}
              >
                <Icon className="h-4 w-4" />
                {tabItem.label}
              </button>
            )
          })}
          {dashboardTabHref && (
            <Link
              href={dashboardTabHref}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
            >
              <Eye className="h-4 w-4" />
              Ver apartado
            </Link>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panel lateral — contenido */}
        <div className="space-y-2">
          {seccionesVista.map((sec, si) => (
            <div key={sec.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button type="button" onClick={() => setSeccionAbierta(seccionAbierta === sec.id ? null : sec.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/20 transition-colors">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground shrink-0">{si + 1}</span>
                <span className="flex-1 text-sm font-semibold text-foreground min-w-0 line-clamp-1">{sec.titulo}</span>
                <span className="text-xs text-muted-foreground shrink-0">{sec.recursos.length}</span>
                {seccionAbierta === sec.id ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
              </button>
              {seccionAbierta === sec.id && (
                <div className="border-t border-border">
                  {sec.descripcion && (
                    <div className="border-b border-border bg-secondary/10 px-4 py-2 text-[11px] text-muted-foreground">
                      {sec.descripcion}
                    </div>
                  )}
                  {sec.recursos.map((rec, ri) => {
                    const done = completados.includes(rec.id)
                    const active = recursoActivo?.id === rec.id
                    return (
                      <button key={rec.id} type="button" onClick={() => setRecursoActivo(rec)}
                        className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all",
                          active ? "bg-primary/8 border-l-2 border-primary" : "hover:bg-secondary/15 border-l-2 border-transparent")}>
                        <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all",
                          done ? "bg-emerald-500 text-white" : active ? "bg-primary/15 text-primary" : "bg-secondary/50 text-muted-foreground")}>
                          {done ? <Check className="h-3 w-3" /> : tipoIcon(rec.tipo)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground line-clamp-1">{rec.titulo || "Sin título"}</div>
                          {rec.duracionMinutos && <div className="text-[10px] text-muted-foreground">{rec.duracionMinutos}min</div>}
                        </div>
                        {rec.gratis && <span className="text-[9px] text-emerald-400 font-bold shrink-0">GRATIS</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-2">
          {recursoActivo ? (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl",
                  recursoActivo.tipo === "simulador" ? "bg-primary/10 text-primary" :
                  recursoActivo.tipo === "evaluacion" ? "bg-amber-500/10 text-amber-400" :
                  recursoActivo.tipo === "video" ? "bg-blue-500/10 text-blue-400" : "bg-secondary text-muted-foreground")}>
                  {tipoIcon(recursoActivo.tipo)}
                </div>
                <div>
                  <div className="font-bold text-foreground">{recursoActivo.titulo}</div>
                  <div className="text-xs text-muted-foreground capitalize">{recursoActivo.tipo}{recursoActivo.duracionMinutos ? ` · ${recursoActivo.duracionMinutos}min` : ""}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{seccionActiva?.titulo || "General"}</span>
                {recursoActivoInfo?.provider && <span>{recursoActivoInfo.provider}</span>}
                {recursoActivoInfo?.openUrl && (recursoActivo.tipo === "video" || recursoActivo.tipo === "documento" || recursoActivo.tipo === "enlace") && (
                  <a
                    href={recursoActivoInfo.openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[10px] tracking-normal text-foreground hover:bg-secondary/20"
                  >
                    <Eye className="h-3 w-3" />
                    Abrir
                  </a>
                )}
              </div>

              {recursoActivoInfo?.message && (recursoActivo.tipo === "video" || recursoActivo.tipo === "documento" || recursoActivo.tipo === "enlace") && (
                <div className={cn(
                  "rounded-xl border px-4 py-3 text-xs",
                  recursoActivoInfo.valid
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                    : "border-red-500/20 bg-red-500/5 text-red-300"
                )}>
                  {recursoActivoInfo.message}
                </div>
              )}

              {recursoActivo.descripcion && <p className="text-sm text-muted-foreground">{recursoActivo.descripcion}</p>}

              {/* Contenido según tipo */}
              {recursoActivo.tipo === "video" && recursoActivoInfo?.valid && (
                <>
                  {recursoActivoInfo.mode === "embed" && recursoActivoInfo.embedUrl && (
                    <div className="aspect-video rounded-xl border border-border overflow-hidden bg-secondary/20">
                      <iframe
                        key={recursoActivo.id}
                        src={`${recursoActivoInfo.embedUrl}${recursoActivoInfo.embedUrl.includes("?") ? "&" : "?"}enablejsapi=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {recursoActivoInfo.mode === "native" && recursoActivoInfo.openUrl && (
                    <video
                      ref={videoRef}
                      key={recursoActivo.id}
                      controls
                      className="w-full rounded-xl border border-border bg-black"
                      src={recursoActivoInfo.openUrl}
                      onEnded={() => marcarCompletado(recursoActivo.id)}
                      onTimeUpdate={() => { if (videoRef.current) saveVideoPos(userId, curso.id, recursoActivo.id, videoRef.current.currentTime) }}
                    />
                  )}
                  {recursoActivoInfo.mode === "external" && recursoActivoInfo.openUrl && (
                    <a
                      href={recursoActivoInfo.openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-border bg-secondary/15 p-5 text-sm text-foreground transition-colors hover:bg-secondary/25"
                    >
                      <Play className="h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold">Abrir video externo</div>
                        <div className="truncate text-xs text-muted-foreground">{recursoActivoInfo.openUrl}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  )}
                </>
              )}
              {recursoActivo.tipo === "video" && recursoActivoInfo && !recursoActivoInfo.valid && (
                <div className="rounded-xl border border-dashed border-red-500/20 bg-red-500/5 p-6 text-sm text-red-200">
                  Este video todavia no tiene un enlace valido para mostrarse en el curso.
                </div>
              )}
              {recursoActivo.tipo === "texto" && recursoActivo.url && (
                <div className="rounded-xl border border-border bg-secondary/10 p-5 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {recursoActivo.url}
                </div>
              )}
              {(recursoActivo.tipo === "enlace" || recursoActivo.tipo === "documento") && recursoActivoInfo?.valid && (
                <>
                  {recursoActivoInfo.mode === "embed" && recursoActivoInfo.embedUrl && (
                    <div className="overflow-hidden rounded-xl border border-border bg-secondary/20">
                      <iframe
                        src={recursoActivoInfo.embedUrl}
                        className="h-[520px] w-full"
                        allow="autoplay"
                      />
                    </div>
                  )}
                  {(recursoActivoInfo.mode === "download" || recursoActivoInfo.mode === "external" || recursoActivoInfo.mode === "native") && recursoActivoInfo.openUrl && (
                    <a
                      href={recursoActivoInfo.openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={recursoActivo.tipo === "documento" && recursoActivoInfo.mode === "download" ? (recursoActivo.archivoNombre || recursoActivo.titulo || undefined) : undefined}
                      className="flex items-center gap-3 rounded-xl border border-border bg-secondary/15 p-4 text-sm text-foreground transition-colors hover:bg-secondary/30"
                    >
                      {recursoActivo.tipo === "documento" ? <FileText className="h-4 w-4 shrink-0 text-primary" /> : <Link2 className="h-4 w-4 shrink-0 text-primary" />}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold">
                          {recursoActivo.archivoNombre || recursoActivo.titulo || (recursoActivo.tipo === "documento" ? "Abrir documento" : "Abrir enlace")}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {recursoActivoInfo.openUrl}
                        </div>
                      </div>
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  )}
                </>
              )}
              {(recursoActivo.tipo === "enlace" || recursoActivo.tipo === "documento") && recursoActivoInfo && !recursoActivoInfo.valid && (
                <div className="rounded-xl border border-dashed border-red-500/20 bg-red-500/5 p-6 text-sm text-red-200">
                  Este recurso todavia no tiene un enlace o archivo valido.
                </div>
              )}
              {recursoActivo.tipo === "simulador" && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center space-y-3">
                  <Target className="h-10 w-10 text-primary mx-auto" />
                  <div className="font-semibold text-foreground">Simulador vinculado</div>
                  {recursoActivo.simuladorId ? (
                    <a href={`/simulador/${recursoActivo.simuladorId}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                      <Play className="h-4 w-4" />Iniciar simulador
                    </a>
                  ) : <div className="text-xs text-muted-foreground">Simulador no configurado aún.</div>}
                </div>
              )}
              {recursoActivo.tipo === "evaluacion" && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-center space-y-3">
                  <Award className="h-10 w-10 text-amber-400 mx-auto" />
                  <div className="font-semibold text-foreground">Evaluación del curso</div>
                  {recursoActivo.evaluacionId ? (
                    <a
                      href={`/simulador/${recursoActivo.evaluacionId}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors"
                    >
                      <Play className="h-4 w-4" />Iniciar evaluación
                    </a>
                  ) : (
                    <div className="text-xs text-muted-foreground">Evaluación no configurada aún.</div>
                  )}
                </div>
              )}

              {/* Materiales adjuntos */}
              {(recursoActivo.adjuntos?.length || 0) > 0 && (
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-secondary/10">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Materiales de la lección</span>
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-full">{recursoActivo.adjuntos!.length}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {recursoActivo.adjuntos!.map(adj => (
                      <a key={adj.id} href={adj.url || "#"} target="_blank" rel="noopener noreferrer"
                        className={cn("flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-sm transition-colors", adj.url ? "hover:bg-secondary/20 hover:border-primary/30" : "opacity-50 cursor-default pointer-events-none")}>
                        <div className={cn("h-8 w-8 shrink-0 flex items-center justify-center rounded-xl", adj.tipo === "documento" ? "bg-orange-500/10 text-orange-400" : "bg-cyan-500/10 text-cyan-400")}>
                          {adj.tipo === "documento" ? <FileText className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground line-clamp-1">{adj.titulo || "Material"}</div>
                          <div className="text-[11px] text-muted-foreground capitalize">{adj.tipo === "documento" ? "Documento" : "Enlace externo"}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Marcar como completado */}
              {!completados.includes(recursoActivo.id) ? (
                <button type="button" onClick={() => marcarCompletado(recursoActivo.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-emerald-500/30 bg-emerald-500/8 text-emerald-400 text-sm font-semibold rounded-xl hover:bg-emerald-500/15 transition-colors">
                  <Check className="h-4 w-4" />Marcar como completado
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2.5 text-emerald-400 text-sm">
                  <CheckCircle className="h-4 w-4" />Lección completada
                </div>
              )}
            </div>
          ) : vistaTab !== "curso" ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
              <div className={cn(
                "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl",
                vistaTab === "simuladores" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-400"
              )}>
                {vistaTab === "simuladores" ? <Target className="h-8 w-8" /> : <Award className="h-8 w-8" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {vistaTab === "simuladores" ? "Este curso aun no tiene simuladores" : "Este curso aun no tiene evaluaciones"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {vistaTab === "simuladores"
                    ? "Cuando el admin publique simuladores para este curso, apareceran aqui ordenados por seccion."
                    : "Cuando el admin publique evaluaciones para este curso, apareceran aqui ordenadas por seccion."}
                </p>
              </div>
              {dashboardTabHref && (
                <Link
                  href={dashboardTabHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/10 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/20"
                >
                  <Eye className="h-4 w-4" />
                  Abrir apartado
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
              <div className="text-5xl">{curso.iconoPortada || "📚"}</div>
              <h2 className="text-xl font-bold text-foreground">{curso.titulo}</h2>
              {curso.descripcion && <p className="text-sm text-muted-foreground max-w-md mx-auto">{curso.descripcion}</p>}
              <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{curso.secciones.length} secciones</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{totalLecciones(curso)} lecciones</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{Math.floor(totalMinutos(curso) / 60)}h estimadas</span>
                {curso.certificado && <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-yellow-400" />Incluye certificado</span>}
              </div>
              {curso.objetivos && curso.objetivos.length > 0 && (
                <div className="text-left rounded-xl border border-border bg-secondary/10 p-4 space-y-2 max-w-md mx-auto">
                  <div className="text-xs font-bold text-foreground">Lo que aprenderás:</div>
                  {curso.objetivos.map((o, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />{o}</div>
                  ))}
                </div>
              )}
              {curso.secciones.length > 0 && (
                <button type="button" onClick={() => { setSeccionAbierta(curso.secciones[0].id); if (curso.secciones[0].recursos[0]) setRecursoActivo(curso.secciones[0].recursos[0]) }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                  <Play className="h-4 w-4" />Comenzar curso
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL — DASHBOARD CURSOS
// ════════════════════════════════════════════════════════════


export default function CursosPage() {
  const { user } = useAuth()
  const userId = user?.id || "guest"

  const [cursos, setCursos] = useState<CursoData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [sortBy, setSortBy] = useState("popular")
  const [filter, setFilter] = useState<"todos" | "mis-cursos">("todos")
  const [isLoaded, setIsLoaded] = useState(false)
  const [modalCurso, setModalCurso] = useState<CursoData | null>(null)
  const [cursoDentro, setCursoDentro] = useState<CursoData | null>(null)
  const [matriculados, setMatriculados] = useState<string[]>([])
  const [successId, setSuccessId] = useState<string | null>(null)

  const refreshData = useCallback(() => {
    const publicados = getCursosPublicados()
    setCursos(publicados)
    const mat = getMatriculas().filter(m => m.userId === userId).map(m => m.cursoId)
    setMatriculados(mat)
  }, [userId])

  useEffect(() => {
    refreshData()
    setIsLoaded(true)
  }, [refreshData])

  const categoriasDisponibles = useMemo(() => {
    const cats = [...new Set(cursos.map(c => c.categoria).filter(Boolean))]
    return [
      { id: "todos", label: "Todos", icon: Sparkles },
      ...cats.map(cat => ({ id: cat, label: CATEGORIA_LABEL[cat] || cat, icon: CATEGORIA_ICON[cat] || BookOpen }))
    ]
  }, [cursos])

  const handleMatriculaSuccess = (cursoId: string) => {
    setModalCurso(null)
    setSuccessId(cursoId)
    refreshData()
    setTimeout(() => setSuccessId(null), 3000)
    // Abrir el curso directamente
    const c = cursos.find(x => x.id === cursoId)
    if (c) setTimeout(() => setCursoDentro(c), 400)
  }

  const handleEnterCurso = (c: CursoData) => {
    if (estaMatriculado(userId, c.id)) {
      setCursoDentro(c)
    } else {
      setModalCurso(c)
    }
  }

  // Si estamos dentro de un curso
  if (cursoDentro) {
    return (
      <div className="p-6 lg:p-8">
        <VistaCurso curso={cursoDentro} userId={userId} onVolver={() => setCursoDentro(null)} />
      </div>
    )
  }

  const filtered = cursos.filter(c => {
    const mq = !searchQuery || c.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || c.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
    const mc = selectedCategory === "todos" || c.categoria === selectedCategory
    const mf = filter === "todos" || (filter === "mis-cursos" && matriculados.includes(c.id))
    return mq && mc && mf
  }).sort((a, b) => {
    if (sortBy === "popular") return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === "free") return (a.precio ?? 0) - (b.precio ?? 0)
    return 0
  })

  const misCursos = cursos.filter(c => matriculados.includes(c.id))

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className={cn("text-center space-y-3 transition-all duration-700", isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        <p className="text-primary font-semibold tracking-wider text-sm uppercase">Catálogo de Cursos</p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Explora Nuestros <span className="text-primary">Cursos</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Accede a contenido especializado para tu preparación docente</p>
      </div>

      {/* Stats rápidas */}
      {misCursos.length > 0 && (
        <div className={cn("grid grid-cols-3 gap-4 transition-all duration-700 delay-100", isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-bold text-foreground">{misCursos.length}</div>
            <div className="text-xs text-muted-foreground">Cursos matriculados</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-bold text-emerald-400">{misCursos.filter(c => getProgreso(userId, c.id) === 100).length}</div>
            <div className="text-xs text-muted-foreground">Completados</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-2xl font-bold text-primary">{cursos.length}</div>
            <div className="text-xs text-muted-foreground">Cursos disponibles</div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className={cn("space-y-4 transition-all duration-700 delay-100", isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        {/* Tabs mis cursos / todos */}
        {misCursos.length > 0 && (
          <div className="flex gap-2">
            {[{ id: "todos" as const, label: "Todos los cursos" }, { id: "mis-cursos" as const, label: `Mis cursos (${misCursos.length})` }].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", filter === f.id ? "bg-primary text-white" : "bg-card border border-border text-foreground hover:border-primary/50")}>
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar por área, nivel o tema..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer text-sm">
              <option value="popular">Más populares</option>
              <option value="newest">Más recientes</option>
              <option value="free">Precio: gratuito primero</option>
            </select>
            <span className="text-muted-foreground text-sm whitespace-nowrap">{filtered.length} cursos</span>
          </div>
        </div>

        {/* Categorías dinámicas según cursos existentes */}
        {categoriasDisponibles.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {categoriasDisponibles.map(cat => {
              const Icon = cat.icon
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={cn("flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === cat.id ? "bg-primary text-white shadow-md shadow-primary/25" : "bg-card border border-border text-foreground hover:border-primary/50 hover:text-primary")}>
                  <Icon className="w-4 h-4" />{cat.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Toast éxito */}
      {successId && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-card px-5 py-3 shadow-2xl">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold text-foreground">¡Matriculado con éxito!</span>
        </div>
      )}

      {/* Grid de cursos */}
      {cursos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-foreground mb-2">Sin cursos disponibles</h3>
          <p className="text-muted-foreground">El administrador aún no ha publicado cursos. ¡Vuelve pronto!</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron cursos</h3>
          <p className="text-muted-foreground">Intenta con otros términos o categorías</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((curso, index) => {
            const matriculado = matriculados.includes(curso.id)
            const progreso = getProgreso(userId, curso.id)
            const lec = totalLecciones(curso)
            const h = Math.floor(totalMinutos(curso) / 60)
            const Icon = CATEGORIA_ICON[curso.categoria] || BookOpen
            return (
              <div key={curso.id}
                className={cn("group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1",
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
                style={{ transitionDelay: `${150 + index * 40}ms` }}>
                {/* Portada */}
                <div className={cn("relative h-36 bg-gradient-to-br flex items-center justify-center", curso.colorPortada || "from-emerald-600 to-green-700")}>
                  <div className="text-5xl">{curso.iconoPortada || "📚"}</div>
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {curso.popular && <span className="flex items-center gap-1 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full"><TrendingUp className="w-2.5 h-2.5" />Popular</span>}
                    {curso.nuevo && <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full">Nuevo</span>}
                    {curso.acceso === "clave" && <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full"><Key className="w-2.5 h-2.5" /></span>}
                    {curso.acceso === "plan" && <span className="flex items-center gap-1 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-full"><Lock className="w-2.5 h-2.5" /></span>}
                  </div>
                  {/* Progreso */}
                  {matriculado && progreso > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                      <div className="h-full bg-emerald-400 transition-all" style={{ width: `${progreso}%` }} />
                    </div>
                  )}
                  {/* Matriculado badge */}
                  {matriculado && (
                    <div className="absolute top-3 left-3">
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full"><Check className="w-2.5 h-2.5" />Matriculado</span>
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{curso.titulo}</h3>
                    {curso.subtitulo ? (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{curso.subtitulo}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{curso.descripcion}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 italic">{curso.instructor}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    {h > 0 && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{h}h</span>}
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{lec} lecciones</span>
                    <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" />{curso.nivel}</span>
                    {curso.certificado && <span className="flex items-center gap-1 text-yellow-400"><Trophy className="w-3 h-3" />Certif.</span>}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-sm font-bold">
                      {curso.precio === 0 ? <span className="text-emerald-400">Gratuito</span> : <span className="text-primary">${curso.precio}</span>}
                      {(curso.precioOriginal ?? 0) > (curso.precio ?? 0) && curso.precioOriginal && (
                        <span className="ml-1.5 text-xs text-muted-foreground line-through">${curso.precioOriginal}</span>
                      )}
                    </div>
                    {matriculado && progreso > 0 && (
                      <span className="text-xs text-primary font-medium">{progreso}% completado</span>
                    )}
                  </div>

                  {/* Botón de acción */}
                  <button type="button" onClick={() => handleEnterCurso(curso)}
                    className={cn("w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300",
                      progreso === 100 ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" :
                      matriculado && progreso > 0 ? "bg-primary text-white hover:bg-primary/90" :
                      matriculado ? "bg-primary/10 text-primary hover:bg-primary hover:text-white" :
                      curso.acceso === "plan" ? "bg-secondary text-muted-foreground cursor-not-allowed" :
                      "bg-primary/10 text-primary hover:bg-primary hover:text-white")}>
                    {progreso === 100 ? <><Award className="h-4 w-4" />Ver certificado</> :
                     matriculado && progreso > 0 ? <><Play className="h-4 w-4" />Continuar curso</> :
                     matriculado ? <><Play className="h-4 w-4" />Ir al curso</> :
                     curso.acceso === "plan" ? <><Lock className="h-4 w-4" />Ver planes</> :
                     curso.acceso === "clave" ? <><Key className="h-4 w-4" />Ingresar clave</> :
                     <><Play className="h-4 w-4" />Iniciar curso<ChevronRight className="h-4 w-4" /></>}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de matrícula */}
      {modalCurso && (
        <ModalMatricula
          curso={modalCurso}
          userId={userId}
          onSuccess={() => handleMatriculaSuccess(modalCurso.id)}
          onClose={() => setModalCurso(null)}
        />
      )}
    </div>
  )
}
