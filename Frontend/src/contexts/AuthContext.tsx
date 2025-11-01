import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, ClientProfile } from '../services/auth'

interface AuthContextType {
  user: ClientProfile | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('@ClickBeard:token')
    if (storedToken) {
      setToken(storedToken)
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      localStorage.removeItem('@ClickBeard:token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const { token } = await authService.login({ email, password })
    localStorage.setItem('@ClickBeard:token', token)
    setToken(token)
    await loadUser()
  }

  const register = async (name: string, email: string, password: string) => {
    await authService.register({ name, email, password })
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('@ClickBeard:token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

