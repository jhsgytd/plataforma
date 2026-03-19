"use client"

import { cn } from "@/lib/utils"
import type { SimulatorDefinition } from "@/lib/simulator/types"
import { CheckCircle2, Clock, FileText, Sparkles } from "lucide-react"

interface UniversalRendererProps {
  data: SimulatorDefinition
  compact?: boolean
  className?: string
}

export default function UniversalRenderer({
  data,
  compact = false,
  className,
}: UniversalRendererProps) {
  const sections = compact ? data.formularioInicial.sections.slice(0, 2) : data.formularioInicial.sections
  const previewQuestions = compact ? data.preguntas.slice(0, 1) : data.preguntas.slice(0, 2)

  return (
    <div className={cn("rounded-2xl border border-border bg-card/95 p-5 shadow-sm", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <FileText className="h-4 w-4" />
            Vista previa unificada
          </div>
          <h3 className="mt-2 text-xl font-semibold text-foreground">{data.titulo}</h3>
          <p className="text-sm text-muted-foreground">{data.descripcion}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {data.configuracion.tiempoPorPregunta}s por pregunta
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            {data.preguntas.length} preguntas
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold text-foreground">Formulario inicial</div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {data.formularioInicial.mode === "perfil" ? "Usar perfil guardado" : "Datos especificos"}
            </span>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {sections.flatMap((section) =>
              section.fields.slice(0, compact ? 2 : 4).map((field) => (
                <div key={field.id} className="rounded-lg border border-border bg-card px-3 py-2">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{field.label}</div>
                  <div className="mt-1 text-sm text-foreground">{field.placeholder || "Completar"}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Pregunta destacada
          </div>
          {previewQuestions.map((question) => (
            <div key={question.id} className="mt-3 rounded-xl border border-border bg-card p-3">
              <div className="text-sm font-semibold text-foreground">{question.prompt}</div>
              <div className="mt-3 grid gap-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm",
                      option.id === question.correctOptionId
                        ? "border-green-500/40 bg-green-500/10 text-green-500"
                        : "border-border bg-secondary/40 text-muted-foreground"
                    )}
                  >
                    {option.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Retroalimentacion", value: data.configuracion.retroalimentacion ? "Activa" : "Desactivada" },
            { label: "Revision final", value: data.configuracion.revisionFinal ? "Activa" : "Desactivada" },
            { label: "Estado", value: data.estado.replace("_", " ") },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
