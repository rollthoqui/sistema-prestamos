import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoginModal from "../components/LoginModal"


const slides = [
  { etiqueta: "Bienvenido", titulo: "Gestiona tus préstamos con confianza", texto: "Creemos en aprovechar lo que ya existe. Menos desperdicio, más acceso." },
  { etiqueta: "Misión", titulo: "Facilitar el acceso a los recursos compartidos", texto: "Ser la plataforma de referencia en gestión de préstamos." },
  { etiqueta: "Visión", titulo: "Ser la plataforma de referencia en gestión de préstamos", texto: "Facilitar el acceso a recursos de forma simple y transparente." },
  { etiqueta: "Objetivos", titulo: "Simplicidad, rapidez y transparencia", texto: "Solicitar, gestionar y devolver préstamos, sin complicaciones." },
  { etiqueta: "Eslogan", titulo: '"Presta fácil, devuelve más fácil"', texto: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem." },
]

//
function scrollSuaveA(id, offset = 80) {
  const el = document.getElementById(id)
  if (!el) return
  const destinoY = el.getBoundingClientRect().top + window.pageYOffset - offset
  const inicioY = window.pageYOffset
  const distancia = destinoY - inicioY
  const duracion = 600
  let inicioTiempo = null

  function animar(tiempoActual) {
    if (inicioTiempo === null) inicioTiempo = tiempoActual
    const transcurrido = tiempoActual - inicioTiempo
    const progreso = Math.min(transcurrido / duracion, 1)
    const ease = progreso < 0.5 ? 2 * progreso * progreso : -1 + (4 - 2 * progreso) * progreso
    window.scrollTo(0, inicioY + distancia * ease)
    if (transcurrido < duracion) requestAnimationFrame(animar)
  }
  requestAnimationFrame(animar)
}

function Home() {
  const [actual, setActual] = useState(0)
  const [form, setForm] = useState({ nombre: "", contacto: "", mensaje: "" })

  useEffect(() => {
    const intervalo = setInterval(() => {
      setActual((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(intervalo)
  }, [])

  const anterior = () => setActual((prev) => (prev - 1 + slides.length) % slides.length)
  const siguiente = () => setActual((prev) => (prev + 1) % slides.length)

  const irASeccion = (e, id) => {
    e.preventDefault()
    scrollSuaveA(id)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Datos de contacto enviados:", form)
    // Aquí se conectará después con el backend
  }

  const [mostrarLogin, setMostrarLogin] = useState(false)
  const navigate = useNavigate()

  const handleLoginExitoso = (rol) => {
  setMostrarLogin(false)
  navigate(rol === "admin" ? "/admin" : "/productos")
    }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-700">
      {/* Encabezado */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <button
         onClick={(e) => irASeccion(e, "inicio")}
         className="text-xl font-semibold text-white hover:opacity-80 transition"
         >
    Presta<span className="text-orange-500/90">Fácil</span>
        </button>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#nosotros" onClick={(e) => irASeccion(e, "nosotros")} className="hover:text-orange-500/90 transition">Acerca de</a>
            <a href="#servicios" onClick={(e) => irASeccion(e, "servicios")} className="hover:text-orange-500/90 transition">Servicios</a>
            <a href="#contacto" onClick={(e) => irASeccion(e, "contacto")} className="hover:text-orange-500/90 transition">Contacto</a>
            <button
            onClick={() => setMostrarLogin(true)}
            className="bg-orange-600 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full transition shadow-md shadow-orange-500/30"
            >
            Solicitar Préstamo
            </button>
        </nav>
      </header>

      {/* Carrusel */}
      <section id="inicio" className="relative w-full h-72 md:h-155
       bg-gray-900 overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center flex-col gap-3 px-6 text-center transition-opacity duration-700 ${
              i === actual ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-900"}`}
          >
            <span className="text-orange-500/90 text-sm font-semibold uppercase tracking-widest">{s.etiqueta}</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-white max-w-2xl">{s.titulo}</h2>
            <p className="text-gray-300 max-w-lg">{s.texto}</p>
          </div>
        ))}
        <button onClick={anterior} className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/40 hover:bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition">‹</button>
        <button onClick={siguiente} className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/40 hover:bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition">›</button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setActual(i)} className={`w-2.5 h-2.5 rounded-full transition ${i === actual ? "bg-orange-600" : "bg-gray-500"}`} />
          ))}
        </div>
      </section>

      {/* ¿Por qué? — texto izquierda, imagen derecha */}
      <section className="px-6 md:px-16 py-24">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-orange-500/90 text-sm font-semibold uppercase tracking-widest">¿Por qué?</span>
            <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-4">
              La razón detrás de PrestaFácil
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              En PrestaFácil creemos que muchos recursos valiosos pasan la mayor parte del tiempo sin usarse. Nacimos para resolver ese desperdicio: conectar a quienes tienen objetos disponibles con quienes los necesitan por un tiempo determinado, de forma simple, rápida y confiable.
            </p>
          </div>
          <div className="flex-1 w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center text-orange-500/90 text-sm font-medium">
            Espacio para imagen
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100 mx-6 md:mx-16" />

      {/* Visión — imagen izquierda, texto derecha */}
      <section className="px-6 md:px-16 py-24 bg-gray-50">
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          <div className="flex-1">
            <span className="text-orange-500/90 text-sm font-semibold uppercase tracking-widest">Visión</span>
            <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-4">
              Hacia dónde vamos
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ser la plataforma de referencia en gestión de préstamos, reconocida por facilitar el acceso a recursos compartidos de forma transparente, ágil y accesible para cualquier persona u organización.
            </p>
          </div>
          <div className="flex-1 w-full h-64 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
            Espacio para imagen
          </div>
        </div>
      </section>

      {/* Franja horizontal de imagen */}
      <div className="w-full h-64 md:h-80 bg-white flex items-center justify-center text-black text-sm font-medium">
        Espacio horizontal para imagen
      </div>

      {/* Misión — texto izquierda, imagen derecha */}
      <section className="px-6 md:px-16 py-24">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-orange-500/90 text-sm font-semibold uppercase tracking-widest">Misión</span>
            <h2 className="text-2xl font-semibold text-gray-900 mt-2 mb-4">
              Lo que hacemos cada día
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Facilitar el acceso a objetos y recursos mediante un sistema de préstamos simple y transparente, promoviendo el uso responsable y la confianza entre quienes prestan y quienes solicitan.
            </p>
          </div>
          <div className="flex-1 w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center text-orange-500/90 text-sm font-medium">
            Espacio para imagen
          </div>
        </div>
      </section>

      <div className="border-t border-gray-100 mx-6 md:mx-16" />

      {/* Acerca de */}
      <section id="nosotros" className="scroll-mt-24 px-6 md:px-16 py-24 bg-gray-50">
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acerca de</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              PrestaFácil es una plataforma digital diseñada para simplificar el proceso de solicitar, gestionar y devolver préstamos de objetos. Combinamos tecnología accesible con un proceso claro, pensado para que cualquier persona pueda encontrar lo que necesita sin complicaciones.
            </p>
          </div>
          <div className="flex-1 w-full h-64 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
            Espacio para imagen
          </div>
        </div>
      </section>

      {/* Franja horizontal de imagen */}
      <div className="w-full h-64 md:h-80 bg-white flex items-center justify-center text-black text-sm font-medium">
        Espacio horizontal para imagen
      </div>

      {/* Servicios */}
      <section id="servicios" className="scroll-mt-24 px-6 md:px-16 py-24 bg-gray-900">
        <h2 className="text-2xl font-semibold text-white text-center mb-2">Nuestros Servicios</h2>
        <p className="text-center text-gray-400 max-w-xl mx-auto mb-12">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-gray-300">
            <thead>
              <tr className="border-b border-orange-500/40 text-white">
                <th className="py-3 px-4 font-semibold">Servicio</th>
                <th className="py-3 px-4 font-semibold">Descripción</th>
                <th className="py-3 px-4 font-semibold">Disponibilidad</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                <td className="py-3 px-4 font-medium text-white">Préstamo de objetos</td>
                <td className="py-3 px-4">Lorem ipsum dolor sit amet consectetur adipiscing elit.</td>
                <td className="py-3 px-4 text-orange-500/90 font-medium">Inmediata</td>
              </tr>
              <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                <td className="py-3 px-4 font-medium text-white">Servicio de Prestamos </td>
                <td className="py-3 px-4">Sed do eiusmod tempor incididunt ut labore et dolore.</td>
                <td className="py-3 px-4 text-orange-500/90 font-medium">24/7</td>
              </tr>
              <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                <td className="py-3 px-4 font-medium text-white">Servicio de Electrodomesticos</td>
                <td className="py-3 px-4">Ut enim ad minim veniam quis nostrud exercitation.</td>
                <td className="py-3 px-4 text-orange-500/90 font-medium">Inmediata</td>
              </tr>
              <tr className="hover:bg-gray-800/50 transition">
                <td className="py-3 px-4 font-medium text-white">Servicio de Inmuebles</td>
                <td className="py-3 px-4">Duis aute irure dolor in reprehenderit in voluptate.</td>
                <td className="py-3 px-4 text-orange-500/90 font-medium">Inmediata</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contacto — formulario para que el visitante deje sus datos */}
      <section id="contacto" className="scroll-mt-24 px-6 md:px-16 py-24 bg-gray-950">
        <h2 className="text-2xl font-semibold text-orange-500/90 text-center mb-4">Contacto</h2>
        <p className="text-gray-400 max-w-lg mx-auto text-center mb-10">
          Dejanos un mensaje y te respondemos!
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
          <input
            type="text"
            placeholder="Correo o teléfono"
            value={form.contacto}
            onChange={(e) => setForm({ ...form, contacto: e.target.value })}
            className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
          <textarea
            placeholder="Mensaje"
            rows={4}
            value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
            className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition"
          >
            Enviar
          </button>
        </form>
      </section>

      {/* Pie de página */}
      <footer className="bg-gray-950 text-gray-500 text-center py-4 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} PrestaFácil. Todos los derechos reservados.
      </footer>
      {mostrarLogin && (
      <LoginModal
        onClose={() => setMostrarLogin(false)}
        onSuccess={handleLoginExitoso}
        />
        )}
    </div>
  )
}

export default Home