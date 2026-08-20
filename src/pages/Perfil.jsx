import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { signOut } from "firebase/auth"
import { db, auth } from "../firebase"
import { useAuth } from "../context/useAuth"
import HeaderSimple from "../components/HeaderSimple"

function formatFecha(fecha) {
  if (!fecha) return "-"
  if (typeof fecha === "string") return fecha
  if (fecha.toDate) return fecha.toDate().toLocaleDateString("es-CO")
  return "-"
}

function Perfil() {
  const { usuario, nombreUsuario } = useAuth()
  const [compras, setCompras] = useState([])
  const [montoAdelanto, setMontoAdelanto] = useState("")
  const [cuotasAdelanto, setCuotasAdelanto] = useState("")
  const [metodoPago, setMetodoPago] = useState("Transferencia bancaria")
  const [mensajeAdelanto, setMensajeAdelanto] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!usuario) return
    const q = query(
      collection(db, "prestamos"),
      where("usuarioId", "==", usuario.uid),
      where("devuelto", "==", false),
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

  const plazoMeses = proximaCuota?.plazoMeses || 0
  const cuotasAdelantadas = proximaCuota?.cuotasAdelantadas || 0
  const montoAdelantado = proximaCuota?.montoAdelantado || 0
  const mesesRestantes = Math.max(plazoMeses - cuotasAdelantadas, 0)

  const tasaInteres = parseFloat(proximaCuota?.interes) || 0
  const montoBase = proximaCuota?.montoNumerico || 0
  const montoConInteres = montoBase * (1 + tasaInteres / 100)
  const montoRestante = Math.max(montoConInteres - montoAdelantado, 0)
  const cuotaMensual = mesesRestantes > 0 ? montoRestante / mesesRestantes : 0

  const handleAdelantarCuotas = async (e) => {
    e.preventDefault()
    setMensajeAdelanto("")

    const monto = parseFloat(montoAdelanto)
    const cuotas = parseInt(cuotasAdelanto, 10)

    if (isNaN(monto) || monto <= 0) {
      setMensajeAdelanto("Ingresa un monto válido mayor a 0.")
      return
    }
    if (isNaN(cuotas) || cuotas <= 0) {
      setMensajeAdelanto("Ingresa una cantidad válida de cuotas.")
      return
    }
    if (cuotas > mesesRestantes) {
      setMensajeAdelanto(`Solo puedes adelantar hasta ${mesesRestantes} cuota(s) restantes.`)
      return
    }
    const topeMonto = cuotaMensual * cuotas
    if (monto > topeMonto) {
      setMensajeAdelanto(`El monto máximo para ${cuotas} cuota(s) es $${topeMonto.toLocaleString("es-CO")}.`)
      return
    }

    const nuevasCuotas = cuotasAdelantadas + cuotas
    const completado = nuevasCuotas >= plazoMeses

    try {
      await addDoc(collection(db, "pagos"), {
        prestamoId: proximaCuota.id,
        usuarioId: usuario.uid,
        monto,
        cuotas,
        metodo: metodoPago,
        fecha: serverTimestamp(),
      })
      await updateDoc(doc(db, "prestamos", proximaCuota.id), {
        montoAdelantado: montoAdelantado + monto,
        cuotasAdelantadas: nuevasCuotas,
        ...(completado ? { devuelto: true, fechaFinalizacion: serverTimestamp() } : {}),
      })
      setMensajeAdelanto(
        completado ? "¡Felicidades, terminaste de pagar este préstamo!" : "¡Adelanto registrado correctamente!"
      )
      setMontoAdelanto("")
      setCuotasAdelanto("")
    } catch (err) {
      console.error("Error al adelantar cuotas:", err)
      setMensajeAdelanto("No se pudo registrar el adelanto. Intenta de nuevo.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <HeaderSimple />
      <div className="px-6 py-10 max-w-3xl mx-auto w-full flex-1">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center text-2xl font-bold">
            {nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{nombreUsuario || "Usuario"}</h1>
            <p className="text-sm text-slate-500">{usuario?.email}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-3">Préstamos activos</h2>
        {compras.length === 0 ? (
          <p className="text-slate-500 text-sm mb-10">No tienes préstamos activos en este momento.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-10">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="py-2 px-4">Producto</th>
                  <th className="py-2 px-4">Monto</th>
                  <th className="py-2 px-4">Plazo</th>
                  <th className="py-2 px-4">Interés</th>
                  <th className="py-2 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-2 px-4">{c.objeto}</td>
                    <td className="py-2 px-4">{c.monto}</td>
                    <td className="py-2 px-4">{c.plazo}</td>
                    <td className="py-2 px-4 text-orange-600">{c.interes}</td>
                    <td className="py-2 px-4 text-slate-500">{formatFecha(c.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {proximaCuota && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Formas de pago — próxima cuota</h2>
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

            <h2 className="text-lg font-semibold text-slate-800 mb-3">Adelantar cuotas</h2>
            <p className="text-sm text-slate-500 mb-3">
              Total con interés: <span className="font-semibold text-slate-800">${montoConInteres.toLocaleString("es-CO")}</span>
              {" · "}
              Cuota mensual aproximada: <span className="font-semibold text-slate-800">${cuotaMensual.toLocaleString("es-CO")}</span>
              {" · "}
              Meses restantes: <span className="font-semibold text-slate-800">{mesesRestantes}</span>
            </p>
            <form onSubmit={handleAdelantarCuotas} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row gap-3 mb-2">
              <input
                type="number"
                min="1"
                step="any"
                placeholder="Monto a adelantar"
                value={montoAdelanto}
                onChange={(e) => setMontoAdelanto(e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              />
              <input
                type="number"
                min="1"
                max={mesesRestantes}
                step="1"
                placeholder="N° de cuotas"
                value={cuotasAdelanto}
                onChange={(e) => setCuotasAdelanto(e.target.value)}
                className="w-full sm:w-32 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              />
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              >
                <option>Transferencia bancaria</option>
                <option>PSE</option>
                <option>Punto físico</option>
              </select>
              <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-full transition">
                Adelantar
              </button>
            </form>
            {mensajeAdelanto && <p className="text-sm text-slate-600 mb-10">{mensajeAdelanto}</p>}
          </>
        )}

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