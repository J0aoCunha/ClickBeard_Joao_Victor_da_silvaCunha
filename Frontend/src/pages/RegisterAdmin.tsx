import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import './RegisterAdmin.css'

export default function RegisterAdmin() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authService.registerAdmin({ name, email, password })
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Erro ao criar administrador. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-admin-container">
      <div className="register-admin-card">
        <h1>Cadastrar Administrador</h1>
        <p className="subtitle">Preencha os dados para criar um novo administrador</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              placeholder="Nome completo"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@email.com"
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
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="cancel-button"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Criando...' : 'Criar Administrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

