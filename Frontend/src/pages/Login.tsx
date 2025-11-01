import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import './Login.css'

export default function Login() {
  const [userType, setUserType] = useState<'client' | 'admin'>('client')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { login: loginAdmin } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (userType === 'admin') {
        await loginAdmin(email, password)
        navigate('/admin/dashboard')
      } else {
        await login(email, password)
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erro ao fazer login. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="barber-pattern"></div>
      </div>
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="scissors-icon">✂️</div>
            <h1>ClickBeard</h1>
            <p className="tagline">Sua barbearia moderna</p>
          </div>
        </div>

        <div className="user-type-selector">
          <button
            type="button"
            className={`type-btn ${userType === 'client' ? 'active' : ''}`}
            onClick={() => setUserType('client')}
          >
            Cliente
          </button>
          <button
            type="button"
            className={`type-btn ${userType === 'admin' ? 'active' : ''}`}
            onClick={() => setUserType('admin')}
          >
            Administrador
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {userType === 'client' && (
          <p className="auth-link">
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        )}
      </div>
    </div>
  )
}
