import type {
  SimulatorConfig,
  SimulatorDefinition,
  SimulatorFormSection,
  SimulatorQuestion,
} from "@/lib/simulator/types"

export interface DocumentImportOptions {
  detectarRespuestas: boolean
  crearFormularioInicial: boolean
  generarRetroalimentacion: boolean
  tiempoPorPregunta: number
  preguntasMaximas: number
}

export interface DocumentInterpretation {
  titulo: string
  descripcion: string
  formularioInicial: SimulatorFormSection[]
  preguntas: SimulatorQuestion[]
}

export const DEFAULT_CONFIG: SimulatorConfig = {
  tiempoPorPregunta: 60,
  preguntasMaximas: 120,
  retroalimentacion: true,
  revisionFinal: true,
}

export async function extractTextFromDocument(_file: File): Promise<string> {
  // Aqui se conectara el motor real de extraccion (PDF/DOCX -> texto).
  return Promise.resolve("DOCUMENTO_SIMULADO")
}

export function interpretDocumentText(_rawText: string): DocumentInterpretation {
  // Aqui se analizara el texto para detectar preguntas, opciones y secciones.
  return {
    titulo: "Simulador Pedagogico",
    descripcion: "Prepara tu evaluacion docente con preguntas reales.",
    formularioInicial: [],
    preguntas: [],
  }
}

export function buildSimulatorFromInterpretation(
  interpretation: DocumentInterpretation,
  options: DocumentImportOptions
): SimulatorDefinition {
  return {
    id: `sim-${Date.now()}`,
    titulo: interpretation.titulo,
    descripcion: interpretation.descripcion,
    estado: "borrador",
    formularioInicial: {
      mode: options.crearFormularioInicial ? "personalizado" : "perfil",
      sections: interpretation.formularioInicial,
    },
    preguntas: interpretation.preguntas,
    configuracion: {
      tiempoPorPregunta: options.tiempoPorPregunta,
      preguntasMaximas: options.preguntasMaximas,
      retroalimentacion: options.generarRetroalimentacion,
      revisionFinal: true,
    },
  }
}
