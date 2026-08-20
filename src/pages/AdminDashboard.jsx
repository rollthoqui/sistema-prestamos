import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import HeaderSimple from "../components/HeaderSimple"

function formatFecha(fecha) {
  if (!fecha) return "-"
  if (typeof fecha === "string") return fecha
  if (fecha.toDate) return fecha.toDate().toLocaleDateString("es-CO")
  return "-"
}

function calcularProximaCuota(fechaPrestamo, cuotasAdelantadas) {
  if (!fechaPrestamo?.toDate) return "-"
  const proxima = fechaPrestamo.toDate()
  proxima.setMonth(proxima.getMonth() + (cuotasAdelantadas || 0) + 1)
  return proxima.toLocaleDateString("es-CO")
}

function calcularTotales(p) {
  const tasa = parseFloat(p.interes) || 0
  const montoConInteres = (p.montoNumerico || 0) * (1 + tasa / 100)
  const pagado = p.montoAdelantado || 0
  const falta = Math.max(montoConInteres - pagado, 0)
  return { pagado, falta }
}

function AdminDashboard() {
  const [prestamos, setPrestamos] = useState([])
  const [tab, setTab] = useState("activos")

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "prestamos"), (snapshot) => {
      setPrestamos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsubscribe()
  }, [])

  const activos = prestamos.filter((p) => !p.devuelto)
  const historial = prestamos.filter((p) => p.devuelto)

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <HeaderSimple />
      <div className="px-6 py-10 flex-1">
        <h1 className="text-2xl font-semibold text-slate-900 mb-6">Panel de Administrador</h1>

        <div className="flex gap-2 mb-6 border-b border-slate-300">
          <button
            onClick={() => setTab("activos")}
            className={`px-5 py-2.5 font-medium text-sm rounded-t-lg transition ${
              tab === "activos" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Préstamos Activos
          </button>
          <button
            onClick={() => setTab("historial")}
            className={`px-5 py-2.5 font-medium text-sm rounded-t-lg transition ${
              tab === "historial" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Historial
          </button>
        </div>

        {tab === "activos" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Objeto</th>
                  <th className="py-2 px-4">Responsable</th>
                  <th className="py-2 px-4">Fecha préstamo</th>
                  <th className="py-2 px-4">Cuotas</th>
                  <th className="py-2 px-4">Próxima cuota</th>
                  <th className="py-2 px-4">Pagado</th>
                  <th className="py-2 px-4">Falta por pagar</th>
                </tr>
              </thead>
              <tbody>
                {activos.map((p) => {
                  const { pagado, falta } = calcularTotales(p)
                  return (
                    <tr key={p.id} className="border-b border-slate-100">
                      <td className="py-2 px-4 font-mono text-xs text-slate-400">#{p.id.substring(0, 8).toUpperCase()}</td>
                      <td className="py-2 px-4">{p.monto}</td>
                      <td className="py-2 px-4">{p.responsable}</td>
                      <td className="py-2 px-4">{formatFecha(p.fecha)}</td>
                      <td className="py-2 px-4">{p.plazoMeses || "-"}</td>
                      <td className="py-2 px-4">{calcularProximaCuota(p.fecha, p.cuotasAdelantadas)}</td>
                      <td className="py-2 px-4 text-green-600 font-medium">${pagado.toLocaleString("es-CO")}</td>
                      <td className="py-2 px-4 text-orange-600 font-medium">${falta.toLocaleString("es-CO")}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "historial" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Objeto</th>
                  <th className="py-2 px-4">Responsable</th>
                  <th className="py-2 px-4">Fecha Inicio</th>
                  <th className="py-2 px-4">Fecha Final</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100">
                    <td className="py-2 px-4 font-mono text-xs">
                      <Link to={`/admin/factura/${p.id}`} className="text-orange-600 hover:underline">
                        #{p.id.substring(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-2 px-4">{p.monto}</td>
                    <td className="py-2 px-4">{p.responsable}</td>
                    <td className="py-2 px-4">{formatFecha(p.fecha)}</td>
                    <td className="py-2 px-4">{formatFecha(p.fechaFinalizacion)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="bg-slate-900 text-slate-500 text-center py-4 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} PrestaFácil. Todos los derechos reservados.
      </footer>
    </div>
  )
}

export default AdminDashboard