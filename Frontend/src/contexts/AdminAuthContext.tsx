import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/auth'

interface AdminAuthContextType {
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('@ClickBeard:adminToken')
    if (storedToken) {
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { token } = await authService.loginAdmin({ email, password })
    localStorage.setItem('@ClickBeard:adminToken', token)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('@ClickBeard:adminToken')
    setToken(null)
  }

  return (
    <AdminAuthContext.Provider
      value={{ token, loading, login, logout, isAdmin: !!token }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth deve ser usado dentro de um AdminAuthProvider')
  }
  return context
}

