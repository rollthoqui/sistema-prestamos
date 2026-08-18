import { useEffect, useState } from "react"
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import HeaderSimple from "../components/HeaderSimple"

function formatFecha(fecha) {
  if(!fecha) return "-"
  if(typeof fecha === "string") return fecha
  if (fecha.toDate) return fecha.toDate().toLocaleDateString("es-CO")
  return "-"
}

function AdminDashboard() {
  const [prestamos, setPrestamos] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "prestamos"), (snapshot) => {
      setPrestamos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsubscribe()
  }, [])

  const marcarDevuelto = async (id) => {
    await updateDoc(doc(db, "prestamos", id), { devuelto: true })
  }

  const activos = prestamos.filter((p) => !p.devuelto)
  const devueltos = prestamos.filter((p) => p.devuelto)

  return (
  <div className="min-h-screen bg-mesh flex flex-col">
    <HeaderSimple />
    <div className="px-6 py-10 flex-1">
      <h1 className="text-2xl font-semibold text-slate-900 mb-8">Panel de Administrador</h1>

      <h2 className="text-lg font-semibold text-slate-800 mb-3">Préstamos activos</h2>
      <table className="w-full text-left mb-10 bg-white rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Objeto</th>
            <th className="py-2 px-4">Responsable</th>
            <th className="py-2 px-4">Fecha préstamo</th>
            <th className="py-2 px-4">Acción</th>
          </tr>
        </thead>
        <tbody>
          {activos.map((p) => (
            <tr key={p.id} className="border-b border-slate-100">
              <td className="py-2 px-4 font-mono text-xs text-slate-400">#{p.id.substring(0, 8).toUpperCase()}</td>
              <td className="py-2 px-4">{p.objeto}</td>
              <td className="py-2 px-4">{p.responsable}</td>
              <td className="py-2 px-4">{formatFecha(p.fecha)}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => marcarDevuelto(p.id)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-1.5 rounded-full transition"
                >
                  Registrar devolución
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-orange-500 to-slate-900 rounded-full mb-10" />

      <h2 className="text-lg font-semibold text-slate-800 mb-3">Historial de devoluciones</h2>
      <table className="w-full text-left bg-white rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Objeto</th>
            <th className="py-2 px-4">Responsable</th>
            <th className="py-2 px-4">Estado</th>
          </tr>
        </thead>
        <tbody>
          {devueltos.map((p) => (
            <tr key={p.id} className="border-b border-slate-100">
              <td className="py-2 px-4 font-mono text-xs text-slate-400">#{p.id.substring(0, 8).toUpperCase()}</td>
              <td className="py-2 px-4">{p.objeto}</td>
              <td className="py-2 px-4">{p.responsable}</td>
              <td className="py-2 px-4 text-green-600 font-medium">Devuelto</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <footer className="bg-slate-900 text-slate-500 text-center py-4 text-sm border-t border-slate-800">
      © {new Date().getFullYear()} PrestaFácil. Todos los derechos reservados.
    </footer>
  </div>
  )
}

export default AdminDashboard