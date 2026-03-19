"use client"

import AdminCMSPage from "@/components/admin/cms-page"

export default function EditorStudioPage() {
  return (
    <div className="h-screen overflow-hidden">
      <AdminCMSPage studioMode />
    </div>
  )
}
