"use client"

interface GallerySectionProps {
  data: Record<string, any>
}

export default function GallerySection({ data }: GallerySectionProps) {
  const titulo      = data.titulo      || ""
  const descripcion = data.descripcion || ""
  const columns     = data.columns     || 3
  const images      = (data.images as { id: string; url: string; alt: string; caption: string }[]) || []

  const gridCls =
    columns === 2 ? "grid-cols-1 sm:grid-cols-2" :
    columns === 4 ? "grid-cols-2 sm:grid-cols-4" :
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {(titulo || descripcion) && (
          <div className="text-center mb-12">
            {titulo && <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">{titulo}</h2>}
            {descripcion && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{descripcion}</p>}
          </div>
        )}
        {images.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
            Agrega imágenes desde el editor de Landing Page
          </div>
        ) : (
          <div className={`grid gap-4 ${gridCls}`}>
            {images.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card aspect-square">
                {img.url ? (
                  <img src={img.url} alt={img.alt || titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/20 text-muted-foreground text-sm">Sin imagen</div>
                )}
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-sm font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
