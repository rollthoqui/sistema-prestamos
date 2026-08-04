import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onSuccess()
    } catch (err) {
        console.error(err)
      setError("Correo o contraseña incorrectos.")
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
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal