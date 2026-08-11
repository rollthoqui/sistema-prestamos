import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SolicitarPrestamo from "./pages/SolicitarPrestamo"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitar" element={<SolicitarPrestamo />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App