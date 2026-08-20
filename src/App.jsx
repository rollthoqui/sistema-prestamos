import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AdminDashboard from "./pages/AdminDashboard"
import Productos from "./pages/Productos"
import RegistroCompra from "./pages/RegistroCompra"
import Registro from "./pages/Registro"
import Perfil from "./pages/Perfil"
import Factura from "./pages/Factura"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/registro-compra" element={<RegistroCompra />} />  
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin/factura/:id" element={<Factura />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App