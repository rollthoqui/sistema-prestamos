import { createContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [rol, setRol] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user)
      if (user) {
        const docRef = doc(db, "usuarios", user.uid)
        const docSnap = await getDoc(docRef)
        setRol(docSnap.exists() ? docSnap.data().rol : "usuario")
      } else {
        setRol(null)
      }
      setCargando(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, rol, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

