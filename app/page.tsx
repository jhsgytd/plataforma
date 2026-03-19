import Link from "next/link"
import { ArrowRight, Layout, Layers, Type, Image, Code, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
              HE
            </div>
            <span className="font-semibold text-foreground">HACK EVANS</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/studio">
              <Button>
                Abrir Studio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Editor Visual Profesional
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
          Crea landing pages impresionantes sin escribir codigo. 
          Arrastra, suelta y edita como en Word. Importa HTML y editalo visualmente.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/studio">
            <Button size="lg" className="gap-2">
              <Layout className="h-5 w-5" />
              Comenzar a Crear
            </Button>
          </Link>
          <Link href="/studio?demo=true">
            <Button size="lg" variant="outline">
              Ver Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
          Herramientas Profesionales
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Layers className="h-6 w-6" />}
            title="Sistema de Capas"
            description="Organiza elementos por capas, reordena con drag & drop, bloquea y oculta como en Photoshop."
          />
          <FeatureCard
            icon={<Type className="h-6 w-6" />}
            title="Edicion Inline"
            description="Edita texto directamente haciendo clic, como en Word. Sin paneles complicados."
          />
          <FeatureCard
            icon={<Image className="h-6 w-6" />}
            title="Biblioteca de Iconos"
            description="Mas de 1000 iconos profesionales de Lucide listos para usar en tus disenos."
          />
          <FeatureCard
            icon={<Code className="h-6 w-6" />}
            title="Importar HTML"
            description="Sube archivos HTML con CSS y editalos visualmente. Convierte cualquier diseno en editable."
          />
          <FeatureCard
            icon={<Palette className="h-6 w-6" />}
            title="Panel de Estilos"
            description="Cambia colores, fuentes, espaciado y efectos sin tocar codigo."
          />
          <FeatureCard
            icon={<Layout className="h-6 w-6" />}
            title="Layout Hibrido"
            description="Secciones apiladas con elementos de posicion libre. Lo mejor de ambos mundos."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Listo para crear?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Abre el Studio y comienza a disenar tu landing page ahora mismo.
          </p>
          <Link href="/studio" className="mt-8 inline-block">
            <Button size="lg">
              Abrir Studio Editor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
