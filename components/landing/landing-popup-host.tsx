"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, ChevronRight, X } from "lucide-react"
import type { CMSActionConfig, CMSFormFieldConfig, CMSPopup } from "@/hooks/use-cms"

const SUBMISSIONS_KEY = "he_landing_popup_submissions"

function getInitialValues(fields: CMSFormFieldConfig[]) {
  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    acc[field.id] = field.type === "checkbox" ? false : ""
    return acc
  }, {})
}

interface LandingPopupHostProps {
  popup: CMSPopup | null
  onClose: () => void
  onAction: (action?: CMSActionConfig) => void
  fallbackSubmitAction?: CMSActionConfig
}

export default function LandingPopupHost({ popup, onClose, onAction, fallbackSubmitAction }: LandingPopupHostProps) {
  const fields = useMemo(() => (popup?.fields ?? []).map((field) => ({ ...field, width: field.width || "full" })), [popup])
  const [values, setValues] = useState<Record<string, string | boolean>>(() => getInitialValues(fields))
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setValues(getInitialValues(fields))
    setSubmitted(false)
  }, [fields, popup?.id])

  if (!popup) return null

  const updateValue = (fieldId: string, value: string | boolean) => {
    setValues((current) => ({ ...current, [fieldId]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      id: `popup_submission_${Date.now()}`,
      popupId: popup.id,
      popupName: popup.name,
      submittedAt: new Date().toISOString(),
      values,
    }

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(SUBMISSIONS_KEY)
      const submissions = raw ? JSON.parse(raw) : []
      submissions.push(payload)
      window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions))
    }

    const submitAction =
      popup.submitAction?.type && popup.submitAction.type !== "none"
        ? popup.submitAction
        : fallbackSubmitAction

    if (submitAction?.type && submitAction.type !== "none") {
      onClose()
      window.setTimeout(() => onAction(submitAction), 40)
      return
    }

    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#02060d]/80 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0b121c] shadow-[0_30px_80px_rgba(0,0,0,0.55)]" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-white/50 transition-all hover:border-white/20 hover:text-white"
          aria-label="Cerrar popup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-white/8 px-6 py-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Popup</div>
          <div className="mt-2 text-2xl font-semibold text-white">{popup.title}</div>
          {popup.description ? <p className="mt-2 max-w-xl text-sm leading-7 text-white/55">{popup.description}</p> : null}
        </div>

        <div className="px-6 py-6">
          {popup.type === "form" ? (
            submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="mt-5 text-2xl font-semibold text-white">{popup.successTitle || "Enviado correctamente"}</div>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/55">{popup.successMessage || "Tu informacion fue registrada."}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 inline-flex h-11 items-center rounded-2xl border border-white/10 px-5 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                {fields.map((field) => (
                  <label key={field.id} className={field.width === "full" ? "space-y-2 md:col-span-2" : "space-y-2"}>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                      {field.label}
                      {field.required ? " *" : ""}
                    </span>
                    {field.type === "textarea" ? (
                      <textarea
                        className="min-h-[132px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        value={String(values[field.id] || "")}
                        onChange={(event) => updateValue(field.id, event.target.value)}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        required={field.required}
                        value={String(values[field.id] || "")}
                        onChange={(event) => updateValue(field.id, event.target.value)}
                      >
                        <option value="">{field.placeholder || "Selecciona una opcion"}</option>
                        {(field.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <input type="checkbox" checked={Boolean(values[field.id])} onChange={(event) => updateValue(field.id, event.target.checked)} className="h-4 w-4 rounded border-white/20 bg-transparent" />
                        <span className="text-sm text-white/80">{field.placeholder || field.label}</span>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={field.placeholder || ""}
                        required={field.required}
                        value={String(values[field.id] || "")}
                        onChange={(event) => updateValue(field.id, event.target.value)}
                      />
                    )}
                  </label>
                ))}
                <div className="pt-2 md:col-span-2">
                  <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary/90">
                    {popup.submitLabel || "Continuar"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-6">
              <p className="text-sm leading-7 text-white/60">{popup.description}</p>
              <div className="flex flex-wrap gap-3">
                {popup.primaryLabel ? (
                  <button type="button" onClick={() => onAction(popup.primaryAction)} className="inline-flex h-11 items-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary/90">
                    {popup.primaryLabel}
                  </button>
                ) : null}
                {popup.secondaryLabel ? (
                  <button type="button" onClick={() => onAction(popup.secondaryAction)} className="inline-flex h-11 items-center rounded-2xl border border-white/10 px-5 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:text-white">
                    {popup.secondaryLabel}
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
