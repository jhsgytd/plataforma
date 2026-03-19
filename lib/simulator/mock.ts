import type { SimulatorDefinition, SimulatorStatus } from "@/lib/simulator/types"

export interface SimulatorListItem {
  id: string
  titulo: string
  estado: SimulatorStatus
  preguntas: number
  tiempo: number
  actualizado: string
}

export const SIMULATOR_LIST: SimulatorListItem[] = [
  {
    id: "sim-001",
    titulo: "Simulador Pedagogico",
    estado: "publicado",
    preguntas: 120,
    tiempo: 60,
    actualizado: "Hace 2 horas",
  },
  {
    id: "sim-002",
    titulo: "QSM 2026",
    estado: "borrador",
    preguntas: 85,
    tiempo: 45,
    actualizado: "Hace 1 dia",
  },
  {
    id: "sim-003",
    titulo: "Simulador de Razonamiento",
    estado: "en_revision",
    preguntas: 60,
    tiempo: 75,
    actualizado: "Ayer",
  },
  {
    id: "sim-004",
    titulo: "Diagnostico Inicial 2026",
    estado: "archivado",
    preguntas: 40,
    tiempo: 50,
    actualizado: "Hace 2 semanas",
  },
]

export const SIMULATOR_PREVIEW: SimulatorDefinition = {
  id: "sim-preview",
  titulo: "Simulador Pedagogico",
  descripcion: "Prepara tu evaluacion docente con preguntas reales.",
  estado: "borrador",
  formularioInicial: {
    mode: "personalizado",
    sections: [
      {
        id: "datos-personales",
        title: "Datos Personales",
        fields: [
          { id: "nombre", label: "Tus nombres", type: "text", placeholder: "Juan Carlos", required: true },
          { id: "apellido", label: "Tus apellidos", type: "text", placeholder: "Perez Mora", required: true },
          { id: "telefono", label: "Telefono", type: "phone", placeholder: "09 999 9999" },
          { id: "correo", label: "Correo", type: "email", placeholder: "tucorreo@gmail.com", required: true },
        ],
      },
      {
        id: "ubicacion",
        title: "Ubicacion",
        fields: [
          { id: "provincia", label: "Provincia", type: "select", options: ["Pichincha", "Guayas", "Manabi"] },
          { id: "canton", label: "Canton", type: "text" },
          { id: "parroquia", label: "Parroquia", type: "text" },
        ],
      },
      {
        id: "academico",
        title: "Informacion Academica",
        fields: [
          { id: "subnivel", label: "Subnivel", type: "select", options: ["Inicial", "Basica", "Bachillerato"] },
          { id: "especialidad", label: "Especialidad", type: "text" },
        ],
      },
    ],
  },
  preguntas: [
    {
      id: "q1",
      prompt: "Segun el curriculo nacional, cual es el enfoque pedagogico principal en la educacion basica?",
      options: [
        { id: "a", text: "Constructivismo" },
        { id: "b", text: "Conductismo" },
        { id: "c", text: "Humanismo" },
        { id: "d", text: "Tecnocentrismo" },
      ],
      correctOptionId: "a",
    },
    {
      id: "q2",
      prompt: "Que instrumento permite evaluar el logro de los objetivos de aprendizaje?",
      options: [
        { id: "a", text: "Rubricas" },
        { id: "b", text: "Lecturas dirigidas" },
        { id: "c", text: "Mapas mentales" },
        { id: "d", text: "Debates abiertos" },
      ],
      correctOptionId: "a",
    },
  ],
  configuracion: {
    tiempoPorPregunta: 60,
    preguntasMaximas: 120,
    retroalimentacion: true,
    revisionFinal: true,
  },
  metadata: {
    fuente: "Documento PDF",
    version: "QSM 2026",
  },
}


