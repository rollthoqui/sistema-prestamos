import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SolicitarPrestamo from "./pages/SolicitarPrestamo"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solicitar" element={<SolicitarPrestamo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App