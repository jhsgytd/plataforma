"use client"

export default function CampoSelect({ label, options = [] }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <select className="mt-1 w-full bg-transparent text-sm text-foreground focus:outline-none">
        {options.length === 0 ? (
          <option>Selecciona una opcion</option>
        ) : (
          options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
        )}
      </select>
    </div>
  )
}
