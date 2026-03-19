const SIMULADORES_KEY = "simuladores"
const BANCO_PREGUNTAS_KEY = "simuladores_banco_preguntas"
const RESULTADOS_KEY = "simuladores_resultados"
const SIMULADORES_EVENT = "simuladores-updated"

function notifySimuladoresUpdated() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(SIMULADORES_EVENT))
}

function safeParse(value, fallback) {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function getSimuladores() {
  if (typeof window === "undefined") return []
  return safeParse(localStorage.getItem(SIMULADORES_KEY), [])
}

export function getSimuladorById(id) {
  return getSimuladores().find((item) => item.id === id)
}

export function guardarSimulador(simulador) {
  if (typeof window === "undefined") return []
  const simuladores = getSimuladores()
  simuladores.push(simulador)
  localStorage.setItem(SIMULADORES_KEY, JSON.stringify(simuladores))
  notifySimuladoresUpdated()
  return simuladores
}

export function actualizarSimulador(simulador) {
  if (typeof window === "undefined") return []
  const simuladores = getSimuladores().map((item) =>
    item.id === simulador.id ? simulador : item
  )
  localStorage.setItem(SIMULADORES_KEY, JSON.stringify(simuladores))
  notifySimuladoresUpdated()
  return simuladores
}

export function eliminarSimulador(id) {
  if (typeof window === "undefined") return []
  const simuladores = getSimuladores().filter((item) => item.id !== id)
  localStorage.setItem(SIMULADORES_KEY, JSON.stringify(simuladores))
  notifySimuladoresUpdated()
  return simuladores
}

export function getBancoPreguntas() {
  if (typeof window === "undefined") return []
  return safeParse(localStorage.getItem(BANCO_PREGUNTAS_KEY), [])
}

export function guardarPregunta(pregunta) {
  if (typeof window === "undefined") return []
  const banco = getBancoPreguntas()
  banco.push(pregunta)
  localStorage.setItem(BANCO_PREGUNTAS_KEY, JSON.stringify(banco))
  return banco
}

export function eliminarPregunta(id) {
  if (typeof window === "undefined") return []
  const banco = getBancoPreguntas().filter((item) => item.id !== id)
  localStorage.setItem(BANCO_PREGUNTAS_KEY, JSON.stringify(banco))
  return banco
}

export function getResultados() {
  if (typeof window === "undefined") return []
  return safeParse(localStorage.getItem(RESULTADOS_KEY), [])
}

export function guardarResultado(resultado) {
  if (typeof window === "undefined") return []
  const resultados = getResultados()
  resultados.push(resultado)
  localStorage.setItem(RESULTADOS_KEY, JSON.stringify(resultados))
  return resultados
}

export function getResultadosPorSimulador(simuladorId) {
  return getResultados().filter((item) => item.simuladorId === simuladorId)
}
