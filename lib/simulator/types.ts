export type SimulatorStatus = "borrador" | "en_revision" | "publicado" | "archivado"

export type SimulatorFormMode = "perfil" | "personalizado"

export type SimulatorFieldType =
  | "text"
  | "email"
  | "phone"
  | "date"
  | "select"
  | "number"

export interface SimulatorFormField {
  id: string
  label: string
  type: SimulatorFieldType
  placeholder?: string
  options?: string[]
  required?: boolean
}

export interface SimulatorFormSection {
  id: string
  title: string
  fields: SimulatorFormField[]
}

export interface SimulatorQuestionOption {
  id: string
  text: string
}

export interface SimulatorQuestion {
  id: string
  prompt: string
  options: SimulatorQuestionOption[]
  correctOptionId?: string
}

export interface SimulatorConfig {
  tiempoPorPregunta: number
  preguntasMaximas: number
  retroalimentacion: boolean
  revisionFinal: boolean
}

export interface SimulatorDefinition {
  id: string
  titulo: string
  descripcion: string
  estado: SimulatorStatus
  formularioInicial: {
    mode: SimulatorFormMode
    sections: SimulatorFormSection[]
  }
  preguntas: SimulatorQuestion[]
  configuracion: SimulatorConfig
  metadata?: {
    fuente?: string
    version?: string
  }
}
