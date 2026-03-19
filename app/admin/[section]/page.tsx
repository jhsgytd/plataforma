"use client"

import { useParams } from "next/navigation"
import AdminSimulatorsPanel from "@/components/admin/simulators-panel"
import AdminCursosPage from "@/components/admin/admin-cursos-page"
import AdminCMSLauncherPage from "@/components/admin/cms-launcher-page"

const TITLES: Record<string, string> = {
  usuarios: "Usuarios",
  evaluaciones: "Evaluaciones",
  planes: "Planes",
  reportes: "Reportes",
  configuracion: "Configuracion",
  notificaciones: "Notificaciones",
}

export default function AdminSectionPage() {
  const params = useParams()
  const section = Array.isArray(params.section) ? params.section[0] : params.section

  if (section === "simuladores") {
    return <AdminSimulatorsPanel />
  }

  if (section === "cursos") {
    return <AdminCursosPage />
  }

  if (section === "landing" || section === "cms") {
    return <AdminCMSLauncherPage />
  }

  const title = section ? TITLES[section] || "Admin" : "Admin"

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-foreground">{title}</h1>
      <p className="text-muted-foreground">
        Esta seccion esta conectada al panel admin y comparte el mismo estilo del dashboard.
      </p>
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Contenido en construccion.
      </div>
    </div>
  )
}
