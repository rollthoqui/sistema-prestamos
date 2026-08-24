import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AdminDashboard from "./pages/AdminDashboard"
import Productos from "./pages/Productos"
import RegistroCompra from "./pages/RegistroCompra"
import Registro from "./pages/Registro"
import Perfil from "./pages/Perfil"
import Factura from "./pages/Factura"
import RutaProtegida from "./components/RutaProtegida"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/productos"
          element={
            <RutaProtegida>
              <Productos />
            </RutaProtegida>
          }
        />
        <Route
          path="/registro-compra"
          element={
            <RutaProtegida>
              <RegistroCompra />
            </RutaProtegida>
          }
        />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin"
          element={
            <RutaProtegida rolRequerido="admin">
              <AdminDashboard />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/factura/:id"
          element={
            <RutaProtegida rolRequerido="admin">
              <Factura />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App