import { useState } from "react"

function SolicitarPrestamo() {
  const [objeto, setObjeto] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Solicitando préstamo de:", objeto)
    // Aquí después se conecta con la base de datos
  }

  return (
    <div>
      <h1>Solicitar préstamo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del objeto"
          value={objeto}
          onChange={(e) => setObjeto(e.target.value)}
        />
        <button type="submit">Solicitar</button>
      </form>
    </div>
  )
}

export default SolicitarPrestamo