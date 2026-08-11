import { useLocation, useNavigate } from "react-router-dom"
import HeaderSimple from "../components/HeaderSimple"

function RegistroCompra() {
  const location = useLocation()
  const producto = location.state
  const navigate = useNavigate()

  if (!producto) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderSimple />
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-slate-600">No se seleccionó ningún producto.</p>
          <button
            onClick={() => navigate("/productos")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-full transition"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  const handleConfirmar = (e) => {
    e.preventDefault()
    console.log("Compra registrada:", producto)
  }

  return (
    <div className="min-h-screen bg-mesh">
      <HeaderSimple />
      <div className="px-6 py-16 flex flex-col items-center">
        <div className="bg-white border-2 border-slate-800 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Registro de compra</h1>

          <div className="border border-slate-300 bg-slate-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-slate-400 mb-1">{producto.grupo}</p>
            <p className="font-bold text-lg text-white">{producto.monto}</p>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-300">{producto.plazo}</span>
              <span className="text-orange-400">{producto.interes}</span>
            </div>
          </div>

          <form onSubmit={handleConfirmar} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre completo"
              className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
            <input
              type="text"
              placeholder="Documento de identidad"
              className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full transition"
            >
              Confirmar compra
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistroCompra