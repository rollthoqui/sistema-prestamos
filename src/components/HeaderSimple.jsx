import { Link } from "react-router-dom"
import { useAuth } from "../context/useAuth"

function HeaderSimple() {
  const { usuario, nombreUsuario } = useAuth()

  return (
    <header className="w-full sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-semibold text-white hover:opacity-80 transition">
        Presta<span className="text-orange-500">Fácil</span>
      </Link>

      {usuario && (
        <Link
          to="/perfil"
          className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold hover:bg-orange-600 transition shrink-0"
        >
          {nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : "U"}
        </Link>
      )}
    </header>
  )
}

export default HeaderSimple