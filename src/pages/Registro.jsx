import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase"
import HeaderSimple from "../components/HeaderSimple"

function Registro() {
  const [nombreUsuario, setNombreUsuario] = useState("")
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setCargando(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, correo, password)
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombreUsuario,
        correo,
        rol: "usuario",
      })
      navigate("/productos")
    } catch (err) {
      console.error("Error de registro:", err)
      if (err.code === "auth/email-already-in-use") {
        setError("Ese correo ya está registrado.")
      } else if (err.code === "auth/invalid-email") {
        setError("El correo no es válido.")
      } else {
        setError("No se pudo completar el registro. Intenta de nuevo.")
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderSimple />
      <div className="px-6 py-16 flex flex-col items-center">
        <div className="bg-white border-2 border-slate-800 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Crear cuenta</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
            <div className="relative">
              <input 
              type={mostrarPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
            >
              {mostrarPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <div className="relative">
            <input
              type={mostrarConfirmar ? "text" : "password"}
              placeholder="Verificar contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
            >
              {mostrarConfirmar ? "Ocultar" : "Mostrar"}
            </button>
          </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={cargando}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full transition disabled:opacity-60"
            >
              {cargando ? "Creando cuenta..." : "Registrarme"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registro