import { useNavigate } from "react-router-dom"
import HeaderSimple from "../components/HeaderSimple"

const productos = [
  { id: 1, grupo: "Lo más pedido", monto: "10'000.000 COP", plazo: "12 meses", interes: "12% Interés", imagen: "/assets/productos/placeholder.png" },
  { id: 2, grupo: "Lo más pedido", monto: "5'000.000 COP", plazo: "6 meses", interes: "10% Interés", imagen: "/assets/productos/placeholder.png" },
  { id: 3, grupo: "Lo más pedido", monto: "15'000.000 COP", plazo: "18 meses", interes: "14% Interés", imagen: "/assets/productos/placeholder.png" },
  { id: 4, grupo: "Los más accesibles", monto: "3'000.000 COP", plazo: "12 meses", interes: "5% Interés", imagen: "/assets/productos/placeholder.png" },
  { id: 5, grupo: "Los más accesibles", monto: "2'000.000 COP", plazo: "6 meses", interes: "4% Interés", imagen: "/assets/productos/placeholder.png" },
  { id: 6, grupo: "Nuestros paquetes gordos", monto: "50'000.000 COP", plazo: "36 meses", interes: "16% Interés", imagen: "/assets/productos/placeholder.png" },
  { id: 7, grupo: "Nuestros paquetes gordos", monto: "80'000.000 COP", plazo: "48 meses", interes: "18% Interés", imagen: "/assets/productos/placeholder.png" },
  { id: 8, grupo: "Los velocistas", monto: "4'000.000 COP", plazo: "3 meses", interes: "20% Interés", imagen: "/assets/productos/placeholder.png" },
  { id: 9, grupo: "Los velocistas", monto: "6'000.000 COP", plazo: "2 meses", interes: "22% Interés", imagen: "/assets/productos/placeholder.png" },
]

const grupos = ["Lo más pedido", "Los más accesibles", "Nuestros paquetes gordos", "Los velocistas"]

function ProductoCard({ producto }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate("/registro-compra", { state: producto })}
      className="group cursor-pointer border-2 border-slate-800 rounded-md overflow-hidden bg-white flex flex-col hover:border-orange-500 transition"
    >
      <div className="relative h-40 bg-slate-100 flex flex-col justify-between p-3">
        <span className="font-bold text-sm text-slate-700">IMAGEN</span>
        <span className="font-bold text-sm text-slate-700 self-end">ALUSIVA</span>

        {/* <img src={producto.imagen} alt={producto.grupo} className="absolute inset-0 w-full h-full object-cover" /> */}

        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/75 transition flex items-center justify-center">
          <span className="text-orange-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition">
            COMPRAR
          </span>
        </div>
      </div>

      <div className="border-t-2 border-slate-800 bg-slate-900 px-3 py-2 text-sm">
        <p className="font-bold text-white">{producto.monto}</p>
        <div className="flex justify-between">
          <span className="font-bold text-slate-300">{producto.plazo}</span>
          <span className="font-bold text-orange-400">{producto.interes}</span>
        </div>
      </div>
    </div>
  )
}

function Productos() {
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <HeaderSimple />
      <div className="px-6 md:px-12 py-12 flex-1">
        {grupos.map((grupo, index) => {
          const items = productos.filter((p) => p.grupo === grupo)
          if (items.length === 0) return null

          return (
            <div key={grupo}>
              {index !== 0 && (
                <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-orange-500 to-slate-900 rounded-full mb-16" />
              )}
              <section className="mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{grupo}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {items.map((producto) => (
                    <ProductoCard key={producto.id} producto={producto} />
                  ))}
                </div>
              </section>
            </div>
          )
        })}
      </div>

      <footer className="bg-slate-900 text-slate-500 text-center py-4 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} PrestaFácil. Todos los derechos reservados.
      </footer>
    </div>
  )
}

export default Productos