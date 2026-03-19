export type CursoResourceType =
  | "video"
  | "documento"
  | "enlace"
  | "simulador"
  | "evaluacion"
  | "texto"

export interface CourseResourceResolution {
  valid: boolean
  normalizedUrl: string
  openUrl?: string
  embedUrl?: string
  provider?: string
  mode: "none" | "embed" | "native" | "external" | "download" | "text"
  message?: string
}

const MEDIA_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m3u8"]
const DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".txt",
]

export function isDataUrl(value: string) {
  return /^data:/i.test(value.trim())
}

export function ensureProtocol(rawValue: string) {
  const value = rawValue.trim()
  if (!value) return ""
  if (/^(https?:|mailto:|tel:|data:|blob:)/i.test(value)) return value
  return `https://${value}`
}

function parseUrlSafe(value: string) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function getYoutubeId(url: URL) {
  const host = url.hostname.replace(/^www\./, "")
  if (host === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] || null
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") return url.searchParams.get("v")
    const parts = url.pathname.split("/").filter(Boolean)
    if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") {
      return parts[1] || null
    }
  }
  return null
}

function getVimeoId(url: URL) {
  const host = url.hostname.replace(/^www\./, "")
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null
  const parts = url.pathname.split("/").filter(Boolean)
  const lastPart = parts[parts.length - 1]
  return /^\d+$/.test(lastPart || "") ? lastPart : null
}

function getLoomId(url: URL) {
  const host = url.hostname.replace(/^www\./, "")
  if (host !== "loom.com") return null
  const parts = url.pathname.split("/").filter(Boolean)
  if (parts[0] === "share" || parts[0] === "embed") {
    return parts[1] || null
  }
  return null
}

function getDriveId(url: URL) {
  const host = url.hostname.replace(/^www\./, "")
  if (host !== "drive.google.com") return null
  const parts = url.pathname.split("/").filter(Boolean)
  const fileIndex = parts.indexOf("d")
  if (fileIndex >= 0 && parts[fileIndex + 1]) return parts[fileIndex + 1]
  return url.searchParams.get("id")
}

function getGoogleDocsId(url: URL) {
  const host = url.hostname.replace(/^www\./, "")
  if (host !== "docs.google.com") return null
  const parts = url.pathname.split("/").filter(Boolean)
  const fileIndex = parts.indexOf("d")
  if (fileIndex >= 0 && parts[fileIndex + 1]) {
    return {
      id: parts[fileIndex + 1],
      kind: parts[0] || "document",
    }
  }
  return null
}

function getExtension(pathname: string) {
  const value = pathname.toLowerCase()
  return [...MEDIA_EXTENSIONS, ...DOCUMENT_EXTENSIONS].find((ext) => value.endsWith(ext)) || ""
}

export function resolveCourseResourceUrl(tipo: CursoResourceType, rawValue?: string | null): CourseResourceResolution {
  const initialValue = (rawValue || "").trim()

  if (tipo === "texto") {
    return {
      valid: true,
      normalizedUrl: initialValue,
      mode: "text",
    }
  }

  if (!initialValue) {
    return {
      valid: false,
      normalizedUrl: "",
      mode: "none",
      message: "Agrega un enlace o archivo para este recurso.",
    }
  }

  if (isDataUrl(initialValue)) {
    const isPdfData = /^data:application\/pdf/i.test(initialValue)
    return {
      valid: true,
      normalizedUrl: initialValue,
      openUrl: initialValue,
      embedUrl: tipo === "documento" && isPdfData ? initialValue : undefined,
      mode: tipo === "video" ? "native" : tipo === "documento" && isPdfData ? "embed" : "download",
      provider: "archivo",
      message:
        tipo === "video"
          ? "Video local cargado en el curso."
          : tipo === "documento" && isPdfData
            ? "PDF local listo para vista previa."
            : "Archivo cargado en el curso.",
    }
  }

  const normalizedUrl = ensureProtocol(initialValue)
  const parsed = parseUrlSafe(normalizedUrl)

  if (!parsed) {
    return {
      valid: false,
      normalizedUrl,
      mode: "none",
      message: "El enlace no tiene un formato valido.",
    }
  }

  const host = parsed.hostname.replace(/^www\./, "")
  const extension = getExtension(parsed.pathname)

  if (tipo === "video") {
    const youtubeId = getYoutubeId(parsed)
    if (youtubeId) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
        provider: "youtube",
        mode: "embed",
        message: "Se publicara embebido como video de YouTube.",
      }
    }

    const vimeoId = getVimeoId(parsed)
    if (vimeoId) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: `https://vimeo.com/${vimeoId}`,
        embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
        provider: "vimeo",
        mode: "embed",
        message: "Se publicara embebido como video de Vimeo.",
      }
    }

    const loomId = getLoomId(parsed)
    if (loomId) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: `https://www.loom.com/share/${loomId}`,
        embedUrl: `https://www.loom.com/embed/${loomId}`,
        provider: "loom",
        mode: "embed",
        message: "Se publicara embebido como video de Loom.",
      }
    }

    const driveId = getDriveId(parsed)
    if (driveId) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: `https://drive.google.com/file/d/${driveId}/view`,
        embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
        provider: "drive",
        mode: "embed",
        message: "Se publicara embebido desde Google Drive.",
      }
    }

    const googleDoc = getGoogleDocsId(parsed)
    if (googleDoc) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: normalizedUrl,
        embedUrl: `https://docs.google.com/${googleDoc.kind}/d/${googleDoc.id}/preview`,
        provider: "google-docs",
        mode: "embed",
        message: "Se publicara embebido desde Google Docs.",
      }
    }

    if (MEDIA_EXTENSIONS.includes(extension)) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: normalizedUrl,
        provider: host || "archivo",
        mode: "native",
        message: "Se reproducira como archivo de video directo.",
      }
    }

    return {
      valid: true,
      normalizedUrl,
      openUrl: normalizedUrl,
      provider: host || "externo",
      mode: "external",
      message: "El video se abrira en una nueva pestaña porque el proveedor no garantiza iframe.",
    }
  }

  if (tipo === "documento") {
    if (extension === ".pdf") {
      return {
        valid: true,
        normalizedUrl,
        openUrl: normalizedUrl,
        embedUrl: normalizedUrl,
        provider: host || "pdf",
        mode: "embed",
        message: "PDF listo para vista previa dentro del curso.",
      }
    }

    if (DOCUMENT_EXTENSIONS.includes(extension)) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: normalizedUrl,
        provider: host || "documento",
        mode: "download",
        message: "Documento listo para abrir o descargar.",
      }
    }

    const driveId = getDriveId(parsed)
    if (driveId) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: `https://drive.google.com/file/d/${driveId}/view`,
        embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
        provider: "drive",
        mode: "embed",
        message: "Documento de Drive listo para vista previa.",
      }
    }

    const googleDoc = getGoogleDocsId(parsed)
    if (googleDoc) {
      return {
        valid: true,
        normalizedUrl,
        openUrl: normalizedUrl,
        embedUrl: `https://docs.google.com/${googleDoc.kind}/d/${googleDoc.id}/preview`,
        provider: "google-docs",
        mode: "embed",
        message: "Documento de Google listo para vista previa.",
      }
    }

    return {
      valid: true,
      normalizedUrl,
      openUrl: normalizedUrl,
      provider: host || "documento",
      mode: "external",
      message: "El documento se abrira mediante enlace externo.",
    }
  }

  if (tipo === "enlace") {
    return {
      valid: true,
      normalizedUrl,
      openUrl: normalizedUrl,
      provider: host || "externo",
      mode: "external",
      message: "Enlace valido para publicacion.",
    }
  }

  return {
    valid: true,
    normalizedUrl,
    openUrl: normalizedUrl,
    mode: "external",
  }
}
