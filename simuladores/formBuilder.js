export function crearCampo(tipo) {
  const stamp = Date.now()
  const base = {
    id: `campo_${stamp}`,
    type: tipo,
    label: "Nuevo campo",
    name: `campo_${stamp}`,
    required: false,
  }

  if (tipo === "select" || tipo === "radio") {
    return { ...base, options: ["Opcion 1", "Opcion 2"] }
  }

  return base
}

export const MINEDUC_PRESETS = [
  { key: "provincias", label: "Provincia", name: "provincia" },
  { key: "cantones", label: "Canton", name: "canton" },
  { key: "parroquias", label: "Parroquia", name: "parroquia" },
  { key: "instituciones", label: "Institucion", name: "institucion" },
]

export function crearCampoMineduc(key) {
  const preset = MINEDUC_PRESETS.find((item) => item.key === key)
  const stamp = Date.now()
  return {
    id: `campo_${stamp}`,
    type: "select",
    label: preset?.label || "Selector MINEDUC",
    name: preset?.name || `mineduc_${stamp}`,
    required: false,
    optionsSource: "mineduc",
    optionsKey: key,
  }
}

export function actualizarCampo(campos, id, cambios) {
  return campos.map((campo) => (campo.id === id ? { ...campo, ...cambios } : campo))
}

export function eliminarCampo(campos, id) {
  return campos.filter((campo) => campo.id !== id)
}

export function actualizarOpciones(campos, id, opciones) {
  return campos.map((campo) =>
    campo.id === id ? { ...campo, options: opciones } : campo
  )
}
