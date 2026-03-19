import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Studio Editor - Hack Evans",
  description: "Editor visual para crear y editar landing pages",
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {children}
    </div>
  )
}
