import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import AdminDashboard from "./pages/AdminDashboard"
import Productos from "./pages/Productos"
import RegistroCompra from "./pages/RegistroCompra"
import Registro from "./pages/Registro"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/registro-compra" element={<RegistroCompra />} />  
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App