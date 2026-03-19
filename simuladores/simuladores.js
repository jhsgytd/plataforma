export function crearSimuladorBase() {
  const stamp = Date.now()
  return {
    id: `sim_${stamp}`,
    titulo: "Simulador Pedagogico",
    descripcion: "Preparacion docente",
    categoria: "",
    estado: "borrador",
    config: {
      tiempoPregunta: 60,
      preguntasMax: 120,
      retroalimentacion: true,
      revisionFinal: true,
      modoIA: false,
      detectarDuplicadas: true,
      intentosMax: 3,
      cooldownMinutos: 30,
    },
    formulario: [],
    preguntas: [],
    formMode: "personalizado",
  }
}

export function calcularErrores(simulador) {
  const camposInvalidos = simulador.formulario.filter(
    (campo) => !campo.label || !campo.name
  )
  const preguntasInvalidas = simulador.preguntas.filter(
    (pregunta) =>
      !pregunta.pregunta ||
      pregunta.opciones.filter((opcion) => opcion && opcion.trim()).length < 2
  )

  return {
    camposInvalidos: camposInvalidos.length,
    preguntasInvalidas: preguntasInvalidas.length,
  }
}
