"use client"

import StudioInlineText from "@/components/studio/studio-inline-text"

interface EmbedSectionProps {
  data: Record<string, any>
  editMode?: boolean
  onActivate?: () => void
  onFieldChange?: (field: string, value: string) => void
}

function buildSrcDoc(html: string) {
  if (/<html[\s>]/i.test(html)) return html

  return [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:auto}*,*::before,*::after{box-sizing:border-box}</style>",
    "</head>",
    "<body>",
    html,
    "</body>",
    "</html>",
  ].join("\n")
}

export default function EmbedSection({
  data,
  editMode = false,
  onActivate,
  onFieldChange,
}: EmbedSectionProps) {
  const title = data.titulo || "Embed universal"
  const description = data.descripcion || "Inserta mapas, calendarios, formularios, dashboards o cualquier widget embebible."
  const mode = data.mode || "url"
  const url = data.url || ""
  const html = data.html || ""
  const height = Math.min(900, Math.max(220, Number(data.height || 460)))
  const hasContent = mode === "html" ? Boolean(html.trim()) : Boolean(url.trim())

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-12">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <StudioInlineText
            as="h2"
            value={title}
            editable={editMode}
            multiline
            onActivate={onActivate}
            onChange={(value) => onFieldChange?.("titulo", value)}
            className="font-display text-4xl text-foreground md:text-5xl"
            editorClassName="font-display text-4xl text-foreground md:text-5xl"
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
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-card/85 shadow-[0_25px_70px_rgba(0,0,0,0.28)]">
          {hasContent ? (
            mode === "html" ? (
              <iframe
                srcDoc={buildSrcDoc(html)}
                title={title}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                className={editMode ? "pointer-events-none block w-full" : "block w-full"}
                style={{ height, border: "none" }}
              />
            ) : (
              <iframe
                src={url}
                title={title}
                loading="lazy"
                allowFullScreen
                className={editMode ? "pointer-events-none block w-full" : "block w-full"}
                style={{ height, border: "none" }}
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/75">Embed</div>
              <div className="mt-3 text-2xl font-semibold text-foreground">Sin fuente configurada</div>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                Agrega una URL embebible o pega el HTML completo del widget desde el editor del Studio.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
