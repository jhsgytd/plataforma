"use client"

export default function CampoRadio({ label, options = [] }) {
  const listado = options.length ? options : ["Opcion A", "Opcion B"]
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 space-y-2">
        {listado.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm text-foreground">
            <input type="radio" name={label} className="accent-[var(--primary)]" />
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}
