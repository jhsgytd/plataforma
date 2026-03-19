"use client"

import { getSimuladores } from "@/simuladores/storage"
import type { SimuladorBuilder } from "@/simuladores/types"

const CURSOS_KEY = "he_cursos"

type CursoEstado = "borrador" | "en_revision" | "publicado" | "archivado"

export interface LandingCourseItem {
  id: string
  titulo: string
  subtitulo?: string
  descripcion: string
  instructor: string
  categoria: string
  colorPortada?: string
  iconoPortada?: string
  tags?: string[]
  secciones: Array<{ recursos: Array<unknown> }>
  estado: CursoEstado
  createdAt: string
  destacado?: boolean
  popular?: boolean
  nuevo?: boolean
}

function parseSafe<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

export function getPublishedCourses(): LandingCourseItem[] {
  if (typeof window === "undefined") return []
  const cursos = parseSafe<LandingCourseItem[]>(localStorage.getItem(CURSOS_KEY), [])
  return cursos.filter((curso) => curso.estado === "publicado")
}

export function getPublishedSimulators(): SimuladorBuilder[] {
  return getSimuladores().filter((simulador: SimuladorBuilder) => {
    const categoria = (simulador.categoria || "").toLowerCase()
    return simulador.estado === "publicado" && categoria !== "evaluacion" && categoria !== "evaluaciones"
  })
}

export function getPublishedEvaluations(): SimuladorBuilder[] {
  return getSimuladores().filter((simulador: SimuladorBuilder) => {
    const categoria = (simulador.categoria || "").toLowerCase()
    return simulador.estado === "publicado" && (categoria === "evaluacion" || categoria === "evaluaciones")
  })
}
