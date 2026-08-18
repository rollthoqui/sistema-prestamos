import { useLocation, useNavigate } from "react-router-dom"
import HeaderSimple from "../components/HeaderSimple"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db, auth } from "../firebase"
import { useState } from "react"


function RegistroCompra() {
  const location = useLocation()
  const producto = location.state
  const navigate = useNavigate()
  const [nombre, setNombre] = useState("")
  const [documento, setDocumento] = useState("")
  const [cargando, setCargando] = useState(false)

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

  const handleConfirmar = async (e) => {
    e.preventDefault()
    setCargando(true)
    try {
      await addDoc(collection(db, "compras"), {
        usuarioId: auth.currentUser.uid,
        nombre,
        documento,
        producto: {
          grupo: producto.grupo,
          monto: producto.monto,
          plazo: producto.plazo,
          interes: producto.interes,
        },
        fecha: serverTimestamp(),
    })
    navigate("/perfil")
  } catch (error) {
    console.error("Error al registrar la compra:", error)
  } finally {
    setCargando(false)
  }
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
            <input
              type="text"
              placeholder="Documento de identidad"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              required
            />
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full transition"
            >
              {cargando ? "Registrando..." : "Confirmar compra"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistroCompra