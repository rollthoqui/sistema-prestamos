import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"
import { AuthContext } from "./AuthContextObject"

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState(null)
  const [nombreUsuario, setNombreUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user)
      if (user) {
        const docSnap = await getDoc(doc(db, "usuarios", user.uid))
        if (docSnap.exists()) {
          setRol(docSnap.data().rol || "usuario")
          setNombreUsuario(docSnap.data().nombreUsuario || null)
        } else {
          setRol("usuario")
          setNombreUsuario(null)
        }
      } else {
        setRol(null)
        setNombreUsuario(null)
      }
      setCargando(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, rol, nombreUsuario, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}