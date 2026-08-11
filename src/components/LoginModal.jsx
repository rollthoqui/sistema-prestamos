import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setCargando(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      try {
        const docSnap = await getDoc(doc(db, "usuarios", cred.user.uid))
        const rol = docSnap.exists() ? docSnap.data().rol : "usuario"
        onSuccess(rol)
      } catch (firestoreErr) {
        console.error("Error de Firestore:", firestoreErr)
        setError("Inicio de sesión correcto, pero no se pudo verificar el rol. Revisa las reglas de Firestore.")
      }
    } catch (authErr) {
      console.error("Error de autenticación:", authErr)
      setError("Correo o contraseña incorrectos.")
    } finally {
      setCargando(false)
    }
  }


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 px-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            required
          />
          <div className="relative">
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 focus:outline-none focus:border-orange-500"
              required
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-orange-500"
            >
              {mostrarPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={cargando}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            {cargando ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal