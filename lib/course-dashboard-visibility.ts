"use client"

const CURSOS_KEY = "he_cursos"

type CursoDashboardSettings = {
  id: string
  mostrarSimuladoresDashboard?: boolean
  mostrarEvaluacionesDashboard?: boolean
}

function parseSafe<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) ?? fallback : fallback
  } catch {
    return fallback
  }
}

export function getCourseDashboardVisibility(cursoId?: string | null) {
  if (!cursoId || typeof window === "undefined") {
    return {
      mostrarSimuladoresDashboard: true,
      mostrarEvaluacionesDashboard: true,
    }
  }

  const cursos = parseSafe<CursoDashboardSettings[]>(localStorage.getItem(CURSOS_KEY), [])
  const curso = cursos.find((item) => item.id === cursoId)

  return {
    mostrarSimuladoresDashboard: curso?.mostrarSimuladoresDashboard !== false,
    mostrarEvaluacionesDashboard: curso?.mostrarEvaluacionesDashboard !== false,
  }
}

export function isCourseActivityVisibleInDashboard(
  cursoId: string | undefined,
  tipo: "simulador" | "evaluacion"
) {
  if (!cursoId) return true
  const visibility = getCourseDashboardVisibility(cursoId)
  return tipo === "simulador"
    ? visibility.mostrarSimuladoresDashboard
    : visibility.mostrarEvaluacionesDashboard
}
