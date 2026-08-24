import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function RutaProtegida({ children, rolRequerido }) {
  const { usuario, rol, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Cargando...
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/" replace />
  }

  if (rolRequerido && rol !== rolRequerido) {
    return <Navigate to="/productos" replace />
  }

  return children
}

export default RutaProtegida