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
      <div className="min-h-screen bg-mesh flex flex-col">
        <HeaderSimple />
        <p className="text-center text-slate-500 py-20 flex-1">Cargando factura...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <HeaderSimple />
      <div className="flex-1 px-6 py-16 flex flex-col items-center">
        <div className="w-full max-w-xl">
          <Link to="/admin" className="text-sm text-orange-600 hover:underline mb-4 inline-block">
            ← Volver al panel
          </Link>

          <div className="bg-white border-2 border-slate-800 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Factura #{prestamo.id.substring(0, 8).toUpperCase()}
            </h1>
            <p className="text-slate-500 text-sm mb-6">Detalle completo del préstamo</p>

            {/* Resumen del préstamo, mismo estilo que la caja oscura de Registro de compra */}
            <div className="bg-slate-900 rounded-lg p-5 mb-8 grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Responsable</p>
                <p className="text-white font-semibold">{prestamo.responsable}</p>
              </div>
              <div>
                <p className="text-slate-400">Correo</p>
                <p className="text-white font-semibold">{prestamo.correo || "-"}</p>
              </div>
              <div>
                <p className="text-slate-400">Documento</p>
                <p className="text-white font-semibold">{prestamo.documento || "-"}</p>
              </div>
              <div>
                <p className="text-slate-400">Monto</p>
                <p className="text-white font-semibold">{prestamo.monto}</p>
              </div>
              <div>
                <p className="text-slate-400">Plazo</p>
                <p className="text-white font-semibold">{prestamo.plazo}</p>
              </div>
              <div>
                <p className="text-slate-400">Interés</p>
                <p className="text-orange-400 font-semibold">{prestamo.interes}</p>
              </div>
              <div>
                <p className="text-slate-400">Fecha inicio</p>
                <p className="text-white font-semibold">{formatFecha(prestamo.fecha)}</p>
              </div>
              <div>
                <p className="text-slate-400">Fecha final</p>
                <p className="text-white font-semibold">{formatFecha(prestamo.fechaFinalizacion)}</p>
              </div>
            </div>

            {/* Pagos realizados */}
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Pagos realizados</h2>
            {pagos.length === 0 ? (
              <p className="text-slate-500 text-sm">No se registraron pagos adelantados para este préstamo.</p>
            ) : (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="py-2 px-4">Fecha</th>
                      <th className="py-2 px-4">Cuotas</th>
                      <th className="py-2 px-4">Monto</th>
                      <th className="py-2 px-4">Método</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((pago) => (
                      <tr key={pago.id} className="border-t border-slate-100">
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
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-500 text-center py-4 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} PrestaFácil. Todos los derechos reservados.
      </footer>
    </div>
  )
}

export default Factura