"use client"

interface SpacerSectionProps {
  data: Record<string, any>
  editMode?: boolean
}

export default function SpacerSection({ data, editMode = false }: SpacerSectionProps) {
  const height = Math.min(320, Math.max(24, Number(data.height || 96)))

  return (
    <section className="relative" aria-hidden="true">
      <div style={{ height }} />
      {editMode ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-dashed border-white/15 bg-[#08111b]/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
            Espaciador {height}px
          </div>
        </div>
      ) : null}
    </section>
  )
}
