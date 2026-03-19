"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, X, Loader2, Mail, Chrome } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "register"
}

function PasswordStrength({ password }: { password: string }) {
  const score = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const cls = ["", "bg-primary", "bg-[#F5C842]", "bg-green-500"][score]

  return (
    <div className="flex gap-1 mt-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("flex-1 h-0.5 rounded bg-border transition-colors", i < score && cls)}
        />
      ))}
    </div>
  )
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const router = useRouter()
  const { login, register, isLoading } = useAuth()
  const [tab, setTab] = useState<"login" | "register">(defaultTab)
  const [success, setSuccess] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    province: "",
  })

  useEffect(() => {
    setTab(defaultTab)
  }, [defaultTab])

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const submit = async () => {
    if (!form.email || !form.password) {
      setError("Por favor completa todos los campos.")
      return
    }
    if (tab === "register" && !form.name) {
      setError("Ingresa tu nombre completo.")
      return
    }
    setError("")

    if (tab === "login") {
      const success = await login(form.email, form.password)
      if (success) {
        const isAdmin = form.email.toLowerCase() === "admin@hackevans.com"
        setSuccess(true)
        setTimeout(() => {
          onClose()
          router.push(isAdmin ? "/admin" : "/dashboard")
        }, 1500)
      } else {
        setError("Credenciales incorrectas.")
      }
    } else {
      const success = await register(`${form.name} ${form.lastName}`.trim(), form.email, form.password)
      if (success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          router.push("/dashboard")
        }, 1500)
      } else {
        setError("Este correo ya esta registrado.")
      }
    }
  }

  const resetAndClose = () => {
    setSuccess(false)
    setForm({ name: "", lastName: "", email: "", password: "", province: "" })
    setError("")
    onClose()
  }

  if (!isOpen) return null

  if (success) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/88 backdrop-blur-lg flex items-center justify-center p-5 animate-fade-in">
        <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-slide-up relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="py-10 px-7 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="font-display text-4xl text-white mb-3">
              {tab === "login" ? "Bienvenido!" : "Cuenta creada!"}
            </div>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              {tab === "login"
                ? "Accediendo a tu panel de preparacion..."
                : "Tu cuenta en Hack Evans esta lista. Redirigiendo..."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/88 backdrop-blur-lg flex items-center justify-center p-5 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden animate-slide-up relative">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center pt-8 px-7">
          <div className="flex items-center gap-2.5 mb-2">
            <Image src="/images/logo.png" alt="Hack Evans" width={46} height={46} />
            <div className="font-display text-3xl tracking-wide text-white">Hack Evans</div>
          </div>
          <div className="text-[11px] text-muted-foreground tracking-[2px] uppercase">
            Consultoria Educativa - Ecuador
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mx-7 mt-6 bg-white/[0.04] rounded-xl p-1 gap-1">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t)
                setError("")
              }}
              className={cn(
                "flex-1 py-2.5 rounded-lg text-sm font-bold transition-all",
                tab === t ? "bg-primary text-white shadow-[0_4px_16px_rgba(232,57,42,0.4)]" : "text-muted-foreground"
              )}
            >
              {t === "login" ? "Iniciar Sesion" : "Registrarse"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="p-7 flex flex-col gap-0">
          {error && (
            <div className="bg-primary/10 border border-primary/30 text-red-300 rounded-lg px-4 py-3 text-[13px] mb-4">
              {error}
            </div>
          )}

          {tab === "register" && (
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Nombres</label>
                <input
                  className="bg-white/5 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/12 outline-none transition-all"
                  placeholder="Juan Carlos"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Apellidos</label>
                <input
                  className="bg-white/5 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/12 outline-none transition-all"
                  placeholder="Perez Mora"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Correo electronico
            </label>
            <input
              className={cn(
                "bg-white/5 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/12 outline-none transition-all",
                error && !form.email && "border-primary animate-shake"
              )}
              type="email"
              placeholder="docente@gmail.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          {tab === "register" && (
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Provincia</label>
              <select
                className="bg-white/5 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/12 outline-none transition-all appearance-none cursor-pointer"
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
              >
                <option value="">Selecciona tu provincia</option>
                {[
                  "Pichincha",
                  "Guayas",
                  "Azuay",
                  "Manabi",
                  "Loja",
                  "Tungurahua",
                  "Imbabura",
                  "El Oro",
                  "Los Rios",
                  "Cotopaxi",
                  "Chimborazo",
                  "Santo Domingo",
                  "Esmeraldas",
                ].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Contrasena</label>
            <div className="relative">
              <input
                className={cn(
                  "w-full bg-white/5 border border-border rounded-lg px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/12 outline-none transition-all",
                  error && !form.password && "border-primary animate-shake"
                )}
                type={showPw ? "text" : "password"}
                placeholder={tab === "login" ? "Tu contrasena" : "Minimo 8 caracteres"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {tab === "register" && <PasswordStrength password={form.password} />}
          </div>

          {tab === "login" && (
            <div className="text-right -mt-2 mb-4">
              <a href="#" className="text-[13px] text-primary font-semibold hover:text-[#ff6b5e] transition-colors">
                Olvidaste tu contrasena?
              </a>
            </div>
          )}

          <button
            onClick={submit}
            disabled={isLoading}
            className="w-full py-3.5 bg-primary rounded-xl text-[15px] font-bold text-white flex items-center justify-center gap-2.5 hover:bg-[#ff4433] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(232,57,42,0.5)] transition-all disabled:bg-[#5A2520] disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {tab === "login" ? "Ingresando..." : "Creando cuenta..."}
              </>
            ) : tab === "login" ? (
              "Ingresar a mi cuenta"
            ) : (
              "Crear cuenta gratuita"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">O continua con</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <button className="w-full py-3 bg-transparent border border-border rounded-xl text-sm font-semibold text-foreground flex items-center justify-center gap-2.5 hover:border-white/25 hover:bg-white/4 transition-all mb-2.5">
            <Chrome className="w-4 h-4" />
            Google
          </button>
          <button className="w-full py-3 bg-transparent border border-border rounded-xl text-sm font-semibold text-foreground flex items-center justify-center gap-2.5 hover:border-white/25 hover:bg-white/4 transition-all">
            <Mail className="w-4 h-4 text-[#1877f2]" />
            Facebook
          </button>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-border text-center">
          <p className="text-[13px] text-muted-foreground">
            {tab === "login" ? (
              <>
                No tienes cuenta?{" "}
                <button
                  onClick={() => setTab("register")}
                  className="text-primary font-semibold hover:text-[#ff6b5e] transition-colors"
                >
                  Registrate gratis
                </button>
              </>
            ) : (
              <>
                Ya tienes cuenta?{" "}
                <button
                  onClick={() => setTab("login")}
                  className="text-primary font-semibold hover:text-[#ff6b5e] transition-colors"
                >
                  Inicia sesion
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
