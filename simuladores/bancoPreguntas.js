export function crearPreguntaBase() {
  const stamp = Date.now()
  return {
    id: `preg_${stamp}`,
    pregunta: "",
    opciones: ["", "", "", ""],
    respuesta: 0,
    categoria: "",
    tema: "",
    dificultad: "basico",
    anio: new Date().getFullYear(),
    institucion: "",
  }
}

export function actualizarPregunta(pregunta, cambios) {
  return { ...pregunta, ...cambios }
}

export function actualizarOpcion(pregunta, indice, valor) {
  const opciones = [...pregunta.opciones]
  opciones[indice] = valor
  return { ...pregunta, opciones }
}
