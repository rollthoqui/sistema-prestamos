import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { db, auth } from "../firebase"
import { useAuth } from "../context/useAuth"
import HeaderSimple from "../components/HeaderSimple"

function Perfil() {
  const { usuario, nombreUsuario } = useAuth()
  const [compras, setCompras] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!usuario) return
    const q = query(
      collection(db, "compras"),
      where("usuarioId", "==", usuario.uid),
      orderBy("fecha", "desc")
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCompras(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsubscribe()
  }, [usuario])

  const handleCerrarSesion = async () => {
    await signOut(auth)
    navigate("/")
  }

  const proximaCuota = compras.length > 0 ? compras[0] : null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderSimple />
      <div className="px-6 py-10 max-w-3xl mx-auto w-full flex-1">
        {/* Encabezado del perfil */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center text-2xl font-bold">
            {nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {nombreUsuario || "Usuario"}
            </h1>
            <p className="text-sm text-slate-500">{usuario?.email}</p>
          </div>
        </div>

        {/* Historial */}
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Historial</h2>
        {compras.length === 0 ? (
          <p className="text-slate-500 text-sm mb-10">
            Todavía no tienes préstamos registrados.
          </p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-10">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="py-2 px-4">Producto</th>
                  <th className="py-2 px-4">Monto</th>
                  <th className="py-2 px-4">Plazo</th>
                  <th className="py-2 px-4">Interés</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-2 px-4">{c.producto?.grupo}</td>
                    <td className="py-2 px-4">{c.producto?.monto}</td>
                    <td className="py-2 px-4">{c.producto?.plazo}</td>
                    <td className="py-2 px-4 text-orange-600">{c.producto?.interes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formas de pago de la próxima cuota */}
        {proximaCuota && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Formas de pago — próxima cuota
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-slate-900 mb-1">Transferencia bancaria</p>
                <p className="text-slate-500">Cuenta de ahorros PrestaFácil — Banco Ejemplo.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-slate-900 mb-1">PSE</p>
                <p className="text-slate-500">Pago en línea desde tu banco.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-slate-900 mb-1">Punto físico</p>
                <p className="text-slate-500">Corresponsal autorizado más cercano.</p>
              </div>
            </div>
          </>
        )}

        {/* Cerrar sesión */}
        <button
          onClick={handleCerrarSesion}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full transition"
        >
          Cerrar sesión
        </button>
      </div>

      <footer className="bg-slate-900 text-slate-500 text-center py-4 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} PrestaFácil. Todos los derechos reservados.
      </footer>
    </div>
  )
}

export default Perfil