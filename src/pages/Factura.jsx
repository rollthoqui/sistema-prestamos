import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import HeaderSimple from "../components/HeaderSimple"

function formatFecha(fecha) {
  if (!fecha) return "-"
  if (typeof fecha === "string") return fecha
  if (fecha.toDate) return fecha.toDate().toLocaleDateString("es-CO")
  return "-"
}

function Factura() {
  const { id } = useParams()
  const [prestamo, setPrestamo] = useState(null)
  const [pagos, setPagos] = useState([])

  useEffect(() => {
    const cargarPrestamo = async () => {
      const docSnap = await getDoc(doc(db, "prestamos", id))
      if (docSnap.exists()) setPrestamo({ id: docSnap.id, ...docSnap.data() })
    }
    cargarPrestamo()

    const q = query(collection(db, "pagos"), where("prestamoId", "==", id))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPagos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsubscribe()
  }, [id])

  if (!prestamo) {
    return (
      <div className="min-h-screen bg-slate-50">
        <HeaderSimple />
        <p className="text-center text-slate-500 py-20">Cargando factura...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderSimple />
      <div className="px-6 py-10 max-w-2xl mx-auto w-full flex-1">
        <Link to="/admin" className="text-sm text-orange-600 hover:underline">← Volver al panel</Link>

        <h1 className="text-2xl font-semibold text-slate-900 mt-4 mb-1">
          Factura #{prestamo.id.substring(0, 8).toUpperCase()}
        </h1>
        <p className="text-slate-500 text-sm mb-8">Detalle completo del préstamo</p>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 grid sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500">Responsable:</span> <p className="font-medium text-slate-900">{prestamo.responsable}</p></div>
          <div><span className="text-slate-500">Correo:</span> <p className="font-medium text-slate-900">{prestamo.correo || "-"}</p></div>
          <div><span className="text-slate-500">Documento:</span> <p className="font-medium text-slate-900">{prestamo.documento || "-"}</p></div>
          <div><span className="text-slate-500">Monto:</span> <p className="font-medium text-slate-900">{prestamo.monto}</p></div>
          <div><span className="text-slate-500">Plazo:</span> <p className="font-medium text-slate-900">{prestamo.plazo}</p></div>
          <div><span className="text-slate-500">Interés:</span> <p className="font-medium text-slate-900">{prestamo.interes}</p></div>
          <div><span className="text-slate-500">Fecha inicio:</span> <p className="font-medium text-slate-900">{formatFecha(prestamo.fecha)}</p></div>
          <div><span className="text-slate-500">Fecha final:</span> <p className="font-medium text-slate-900">{formatFecha(prestamo.fechaFinalizacion)}</p></div>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-3">Pagos realizados</h2>
        {pagos.length === 0 ? (
          <p className="text-slate-500 text-sm">No se registraron pagos adelantados para este préstamo.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Cuotas</th>
                  <th className="py-2 px-4">Monto</th>
                  <th className="py-2 px-4">Método</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id} className="border-b border-slate-100">
                    <td className="py-2 px-4">{formatFecha(pago.fecha)}</td>
                    <td className="py-2 px-4">{pago.cuotas}</td>
                    <td className="py-2 px-4">${pago.monto.toLocaleString("es-CO")}</td>
                    <td className="py-2 px-4">{pago.metodo}</td>
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

export default Factura