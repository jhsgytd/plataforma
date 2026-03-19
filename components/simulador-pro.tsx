"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { RotateCcw } from "lucide-react"

interface Question {
  cat: string
  q: string
  opts: string[]
  correct: number
  exp: string
}

const QUESTIONS: Question[] = [
  {
    cat: "Saberes Pedagogicos",
    q: "Segun el constructivismo de Vygotsky, que es la Zona de Desarrollo Proximo (ZDP)?",
    opts: [
      "El nivel real que el nino alcanza de forma independiente",
      "La distancia entre lo que el alumno puede hacer solo y lo que puede hacer con ayuda",
      "El conjunto de conocimientos previos que ya posee",
      "El maximo nivel academico esperado del estudiante"
    ],
    correct: 1,
    exp: "La ZDP es la distancia entre el desarrollo real (sin ayuda) y el potencial (con guia). Es clave para disenar la mediacion pedagogica efectiva."
  },
  {
    cat: "Pensamiento Computacional",
    q: "En pensamiento computacional, que proceso implica identificar similitudes y patrones en un conjunto de datos?",
    opts: [
      "Descomposicion",
      "Abstraccion",
      "Reconocimiento de patrones",
      "Algoritmia"
    ],
    correct: 2,
    exp: "El reconocimiento de patrones identifica similitudes y tendencias. La descomposicion divide el problema, la abstraccion elimina detalles irrelevantes."
  },
  {
    cat: "Razonamiento Verbal",
    q: "Completa la analogia: DOCENTE : AULA :: MEDICO : ___",
    opts: ["Medicina", "Consultorio", "Hospital", "Paciente"],
    correct: 1,
    exp: "La relacion es profesional - espacio especifico de trabajo. Consultorio es donde ejerce el medico, asi como el aula es donde ejerce el docente."
  },
  {
    cat: "Saberes Disciplinares",
    q: "En el modelo curricular ecuatoriano, cual es el proposito de los 'criterios de evaluacion'?",
    opts: [
      "Indicar los contenidos minimos que debe ensenar el docente",
      "Establecer referencias para verificar el logro de las destrezas con criterio de desempeno",
      "Definir la metodologia que debe emplearse en cada clase",
      "Determinar los instrumentos de evaluacion estandarizados"
    ],
    correct: 1,
    exp: "Los criterios de evaluacion son referentes para verificar si el estudiante logro las DCD planificadas. No prescriben metodologia ni instrumentos."
  },
  {
    cat: "Razonamiento Numerico",
    q: "Un docente planifica una clase de 80 min. Destina el 35% a introduccion, el 45% a practica y el resto al cierre. Cuantos minutos dura el cierre?",
    opts: ["12 minutos", "16 minutos", "20 minutos", "24 minutos"],
    correct: 1,
    exp: "35% + 45% = 80%. Cierre = 100% - 80% = 20%. 20% de 80 min = 16 minutos."
  },
  {
    cat: "Saberes Pedagogicos",
    q: "Cual es la diferencia principal entre evaluacion formativa y sumativa?",
    opts: [
      "La formativa ocurre al inicio del ano y la sumativa al final",
      "La formativa retroalimenta el proceso de aprendizaje; la sumativa certifica el logro alcanzado",
      "La formativa es oral y la sumativa es escrita",
      "La formativa la aplica el docente y la sumativa el INEVAL"
    ],
    correct: 1,
    exp: "La evaluacion formativa es continua y mejora el proceso de ensenanza-aprendizaje. La sumativa valora el grado de logro al termino de una etapa."
  },
  {
    cat: "Razonamiento Abstracto",
    q: "En una secuencia: 2, 6, 18, 54, ___ Cual es el siguiente numero?",
    opts: ["108", "162", "216", "270"],
    correct: 1,
    exp: "La razon es x3 en cada paso: 2x3=6, 6x3=18, 18x3=54, 54x3=162."
  },
  {
    cat: "Saberes Pedagogicos",
    q: "Que caracteristica define a un objetivo de aprendizaje bien formulado segun el modelo ABCD?",
    opts: [
      "Describe unicamente la conducta del docente durante la clase",
      "Incluye Audiencia, Conducta, Condicion y Criterio de desempeno",
      "Se redacta en terminos de actividades de ensenanza",
      "Solo especifica los contenidos que se van a abordar"
    ],
    correct: 1,
    exp: "El modelo ABCD: Audiencia (quien aprende), Conducta (que hara), Condicion (en que circunstancias), Criterio (con que estandar de calidad)."
  }
]

export default function SimuladorPro() {
  const [qIdx, setQIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [chosen, setChosen] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [corrects, setCorrects] = useState(0)
  const [seconds, setSeconds] = useState(150)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const q = QUESTIONS[qIdx]
  const total = QUESTIONS.length

  useEffect(() => {
    if (done) return
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [qIdx, done])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  const pick = (i: number) => {
    if (answered) return
    if (timerRef.current) clearInterval(timerRef.current)
    setChosen(i)
    setAnswered(true)
    if (i === q.correct) {
      setScore((sc) => sc + 125)
      setCorrects((c) => c + 1)
    }
  }

  const next = () => {
    if (qIdx + 1 >= total) {
      setDone(true)
      return
    }
    setQIdx((qi) => qi + 1)
    setAnswered(false)
    setChosen(null)
    setSeconds(150)
  }

  const restart = () => {
    setQIdx(0)
    setScore(0)
    setAnswered(false)
    setChosen(null)
    setDone(false)
    setCorrects(0)
    setSeconds(150)
  }

  const pct = Math.round(((qIdx + (answered ? 1 : 0)) / total) * 100)
  const stars = corrects >= 7 ? 5 : corrects >= 5 ? 4 : corrects >= 3 ? 3 : corrects >= 2 ? 2 : 1
  const msg =
    corrects >= 7
      ? "Excelente! Estas listo para el examen real. Sigue practicando para mantener este nivel."
      : corrects >= 5
        ? "Muy bien! Tienes una base solida. Refuerza los temas donde fallaste."
        : corrects >= 3
          ? "Vas por buen camino. Practica mas las areas de dificultad."
          : "Necesitas reforzar tu preparacion. No te rindas, practica diariamente!"

  return (
    <section id="simulador" className="py-12 lg:py-20 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="text-[10px] font-bold uppercase tracking-[3px] text-primary mb-3">
            Simulador Interactivo
          </div>
          <h2 className="font-display text-4xl lg:text-5xl text-white leading-[0.93]">
            Practica <span className="text-primary">QSM 10</span>
          </h2>
        </div>

        <div className="bg-[#080C12] rounded-2xl border border-border overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-fade-up">
          {!done ? (
            <>
              {/* Top Bar */}
              <div className="bg-[#080C12] border-b border-border px-4 lg:px-7 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={cn("w-2.5 h-2.5 bg-primary rounded-full", seconds <= 20 && "animate-pulse-dot")} />
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Simulador Pro - QSM 10
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[13px] text-muted-foreground">
                    Pregunta <span className="text-white font-bold">{qIdx + 1}</span>/{total}
                  </span>
                  <span
                    className={cn(
                      "font-display text-lg tracking-wider min-w-[56px] text-right",
                      seconds <= 20 ? "text-primary animate-timer-warn" : "text-foreground"
                    )}
                  >
                    {formatTime(seconds)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-[#ff6b5e] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Score Strip */}
              <div className="px-4 lg:px-7 pt-4 flex items-center justify-between">
                <span className="bg-primary/13 border border-primary/32 text-[#ff6b5e] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {q.cat}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Puntaje:</span>
                  <span className="font-display text-2xl text-[#F5C842] leading-none">{score}</span>
                </div>
              </div>

              {/* Question */}
              <div className="px-4 lg:px-7 pt-5 animate-fade-up" key={qIdx}>
                <p className="text-base lg:text-lg font-semibold text-foreground leading-relaxed">{q.q}</p>
              </div>

              {/* Options */}
              <div className="px-4 lg:px-7 pt-5 flex flex-col gap-3">
                {q.opts.map((opt, i) => {
                  let optClass = ""
                  if (answered) {
                    if (i === q.correct) optClass = "correct"
                    else if (i === chosen && i !== q.correct) optClass = "wrong"
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      disabled={answered}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 border-border bg-card text-foreground text-sm font-medium text-left transition-all duration-200 flex items-center gap-4",
                        "hover:border-primary/45 hover:bg-primary/7 hover:translate-x-1",
                        "disabled:cursor-default disabled:hover:translate-x-0",
                        optClass === "correct" && "!border-green-500 !bg-green-500/12 animate-correct-pulse",
                        optClass === "wrong" && "!border-primary !bg-primary/12 animate-wrong-pulse"
                      )}
                    >
                      <span
                        className={cn(
                          "w-8 h-8 rounded-lg bg-white/6 border border-border flex items-center justify-center text-[13px] font-bold flex-shrink-0 transition-all",
                          optClass === "correct" && "!bg-green-500/25 !border-green-500 !text-green-500",
                          optClass === "wrong" && "!bg-primary/25 !border-primary !text-primary"
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* Feedback */}
              {answered && (
                <div
                  className={cn(
                    "mx-4 lg:mx-7 mt-4 p-4 rounded-xl text-sm leading-relaxed animate-fade-up",
                    chosen === q.correct
                      ? "bg-green-500/10 border border-green-500/28 text-green-300"
                      : "bg-primary/10 border border-primary/28 text-red-300"
                  )}
                >
                  {chosen === q.correct ? "✓ Correcto! " : "✗ Incorrecto. "}
                  {q.exp}
                </div>
              )}

              {/* Next Button */}
              {answered && (
                <div className="px-4 lg:px-7 pt-4 pb-6">
                  <button
                    onClick={next}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary rounded-lg text-sm font-bold text-white hover:bg-[#ff4433] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(232,57,42,0.45)] transition-all animate-fade-up"
                  >
                    {qIdx + 1 < total ? "Siguiente pregunta" : "Ver resultados"}
                    {qIdx + 1 < total ? " →" : " 🏆"}
                  </button>
                </div>
              )}

              {/* Bottom */}
              <div className="px-4 lg:px-7 py-3 border-t border-border flex items-center justify-between">
                <div className="flex gap-1.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary" />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground/60">Hack Evans - Simuladores Pro</span>
              </div>
            </>
          ) : (
            /* Results */
            <div className="py-12 px-6 text-center animate-pop-in">
              <div
                className="font-display text-7xl lg:text-[88px] text-primary leading-none"
                style={{ animation: "scoreCount 0.7s cubic-bezier(.34,1.56,.64,1) 0.2s both" }}
              >
                {score}
              </div>
              <div className="text-sm text-muted-foreground mt-1 mb-6">
                puntos obtenidos de {total * 125} posibles
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="text-3xl animate-star-pop"
                    style={{
                      animationDelay: `${0.1 + i * 0.1}s`,
                      opacity: i < stars ? 1 : 0.2
                    }}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-4 justify-center mb-7 flex-wrap">
                <div className="bg-card border border-border rounded-xl px-5 py-4 text-center min-w-[110px]">
                  <div className="font-display text-4xl text-green-500 leading-none">{corrects}</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">Correctas</div>
                </div>
                <div className="bg-card border border-border rounded-xl px-5 py-4 text-center min-w-[110px]">
                  <div className="font-display text-4xl text-primary leading-none">{total - corrects}</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">Incorrectas</div>
                </div>
                <div className="bg-card border border-border rounded-xl px-5 py-4 text-center min-w-[110px]">
                  <div className="font-display text-4xl text-[#F5C842] leading-none">
                    {Math.round((corrects / total) * 100)}%
                  </div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">Precision</div>
                </div>
              </div>

              {/* Message */}
              <div className="text-[15px] text-foreground leading-relaxed p-5 bg-card border border-border rounded-xl mb-7 max-w-md mx-auto">
                {msg}
              </div>

              {/* Restart */}
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 px-9 py-3.5 bg-primary rounded-lg text-[15px] font-bold text-white hover:bg-[#ff4433] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(232,57,42,0.5)] transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Volver a practicar
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
