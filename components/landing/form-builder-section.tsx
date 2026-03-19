"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, ChevronRight, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import StudioInlineText from "@/components/studio/studio-inline-text"

type FormFieldType = "text" | "email" | "tel" | "number" | "textarea" | "select" | "checkbox"

interface FormFieldConfig {
  id: string
  type: FormFieldType
  label: string
  placeholder?: string
  required?: boolean
  width?: "full" | "half"
  options?: string[]
}

interface FormBuilderSectionProps {
  data: Record<string, any>
  editMode?: boolean
  onActivate?: () => void
  onFieldChange?: (field: string, value: string) => void
  onBulletChange?: (index: number, value: string) => void
  onFormFieldChange?: (index: number, patch: Partial<FormFieldConfig>) => void
  onSubmitAction?: () => void
}

const SUBMISSIONS_KEY = "he_landing_form_submissions"

function getInitialValues(fields: FormFieldConfig[]) {
  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    acc[field.id] = field.type === "checkbox" ? false : ""
    return acc
  }, {})
}

export default function FormBuilderSection({
  data,
  editMode = false,
  onActivate,
  onFieldChange,
  onBulletChange,
  onFormFieldChange,
  onSubmitAction,
}: FormBuilderSectionProps) {
  const fields = useMemo<FormFieldConfig[]>(
    () =>
      ((data.fields as FormFieldConfig[]) || []).filter((field) => field?.label).map((field) => ({
        ...field,
        width: field.width || "full",
      })),
    [data.fields]
  )

  const [values, setValues] = useState<Record<string, string | boolean>>(() => getInitialValues(fields))
  const [submitted, setSubmitted] = useState(false)

  const title = data.titulo || "Formulario personalizado"
  const description = data.descripcion || "Captura datos y conecta este bloque al flujo comercial de tu landing."
  const badge = data.badge || "Formulario"
  const submitLabel = data.submitLabel || "Enviar"
  const successTitle = data.successTitle || "Formulario enviado"
  const successMessage = data.successMessage || "Recibimos tus datos correctamente."

  const updateValue = (fieldId: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [fieldId]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (editMode) {
      return
    }

    const payload = {
      id: `submission_${Date.now()}`,
      title,
      submittedAt: new Date().toISOString(),
      values,
    }

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(SUBMISSIONS_KEY)
      const submissions = raw ? JSON.parse(raw) : []
      submissions.push(payload)
      window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions))
      window.dispatchEvent(new CustomEvent("landing-form-submissions-updated"))
    }

    if (onSubmitAction) {
      onSubmitAction()
      setValues(getInitialValues(fields))
      return
    }

    setSubmitted(true)
    setValues(getInitialValues(fields))
  }

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="rounded-[28px] border border-white/10 bg-card/75 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.25)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <FileText className="h-4 w-4" />
              <StudioInlineText
                as="span"
                value={badge}
                editable={editMode}
                onActivate={onActivate}
                onChange={(value) => onFieldChange?.("badge", value)}
                className="text-sm font-semibold text-primary"
                editorClassName="min-w-[10rem] text-sm font-semibold text-primary"
              />
            </div>
            <StudioInlineText
              as="h2"
              value={title}
              editable={editMode}
              multiline
              onActivate={onActivate}
              onChange={(value) => onFieldChange?.("titulo", value)}
              className="mt-5 font-display text-4xl text-foreground md:text-5xl"
              editorClassName="mt-5 font-display text-4xl text-foreground md:text-5xl"
            />
            <StudioInlineText
              as="p"
              value={description}
              editable={editMode}
              multiline
              onActivate={onActivate}
              onChange={(value) => onFieldChange?.("descripcion", value)}
              className="mt-4 text-lg leading-relaxed text-muted-foreground"
              editorClassName="mt-4 text-lg leading-relaxed text-muted-foreground"
            />

            {Array.isArray(data.bullets) && data.bullets.length > 0 ? (
              <div className="mt-8 space-y-3">
                {data.bullets.map((item: string, index: number) => (
                  <div key={`${item}-${index}`} className="flex items-center gap-3 text-sm text-white/75">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <StudioInlineText
                      as="span"
                      value={item}
                      editable={editMode}
                      onActivate={onActivate}
                      onChange={(value) => onBulletChange?.(index, value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-card/80 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.28)]">
            {submitted ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="mt-5 text-2xl font-semibold text-foreground">{successTitle}</div>
                <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">{successMessage}</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 transition-all hover:border-primary/30 hover:text-white"
                >
                  Completar de nuevo
                </button>
              </div>
            ) : (
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                {fields.length === 0 ? (
                  <div className="md:col-span-2 rounded-2xl border border-dashed border-white/10 bg-secondary/10 px-6 py-10 text-center">
                    <div className="text-lg font-semibold text-foreground">Sin campos configurados</div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Agrega campos desde el editor del Studio para construir el formulario a tu medida.
                    </p>
                  </div>
                ) : (
                  fields.map((field) => {
                    const commonClass = cn(
                      "w-full rounded-2xl border border-white/10 bg-secondary/10 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/45 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                      field.width === "full" ? "md:col-span-2" : ""
                    )

                    return (
                      <label
                        key={field.id}
                        className={cn("space-y-2", field.width === "full" ? "md:col-span-2" : "")}
                      >
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                          <StudioInlineText
                            as="span"
                            value={field.label}
                            editable={editMode}
                            onActivate={onActivate}
                            onChange={(value) => onFormFieldChange?.(fields.findIndex((entry) => entry.id === field.id), { label: value })}
                            className="inline"
                            editorClassName="text-xs font-semibold uppercase tracking-[0.16em] text-white/70"
                          />
                          {field.required ? " *" : ""}
                        </span>

                        {field.type === "textarea" ? (
                          <textarea
                            className={cn(commonClass, "min-h-[128px] resize-none")}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                            value={String(values[field.id] || "")}
                            onChange={(event) => updateValue(field.id, event.target.value)}
                          />
                        ) : field.type === "select" ? (
                          <select
                            className={commonClass}
                            required={field.required}
                            value={String(values[field.id] || "")}
                            onChange={(event) => updateValue(field.id, event.target.value)}
                          >
                            <option value="">{field.placeholder || "Selecciona una opcion"}</option>
                            {(field.options || []).map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "checkbox" ? (
                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-secondary/10 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={Boolean(values[field.id])}
                              onChange={(event) => updateValue(field.id, event.target.checked)}
                              className="h-4 w-4 rounded border-white/20 bg-transparent"
                            />
                            <span className="text-sm text-white/80">{field.placeholder || field.label}</span>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            className={commonClass}
                            placeholder={field.placeholder || ""}
                            required={field.required}
                            value={String(values[field.id] || "")}
                            onChange={(event) => updateValue(field.id, event.target.value)}
                          />
                        )}
                      </label>
                    )
                  })
                )}

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary/90"
                  >
                    <StudioInlineText
                      as="span"
                      value={submitLabel}
                      editable={editMode}
                      onActivate={onActivate}
                      onChange={(value) => onFieldChange?.("submitLabel", value)}
                      className="text-sm font-semibold text-white"
                      editorClassName="min-w-[8rem] text-center text-sm font-semibold text-white"
                    />
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
