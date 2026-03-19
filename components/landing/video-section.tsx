"use client"

import { Play } from "lucide-react"

interface VideoSectionProps {
  data: Record<string, any>
}

function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vi = url.match(/vimeo\.com\/(\d+)/)
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`
  return url
}

export default function VideoSection({ data }: VideoSectionProps) {
  const titulo      = data.titulo      || "Conoce como funciona la plataforma"
  const descripcion = data.descripcion || "Mira como nuestros simuladores te ayudan a prepararte para el examen."
  const videoUrl    = data.videoUrl    || ""
  const embedUrl    = videoUrl ? toEmbedUrl(videoUrl) : ""

  return (
    <section className="py-20 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">{titulo}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{descripcion}</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-video shadow-2xl">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={titulo}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/20">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
                <div className="text-sm text-muted-foreground">Agrega una URL de YouTube o Vimeo desde el editor</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
