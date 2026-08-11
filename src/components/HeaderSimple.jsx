import { Link } from "react-router-dom"

function HeaderSimple() {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4">
      <Link to="/" className="text-xl font-semibold text-white hover:opacity-80 transition">
        Presta<span className="text-orange-500">Fácil</span>
      </Link>
    </header>
  )
}

export default HeaderSimple