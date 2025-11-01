import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { appointmentService } from '../services/appointments'
import './Dashboard.css'

export default function Appointments() {
  const { logout } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.list()
      setAppointments(response.appointments)
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (appointmentId: number) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return
    }

    try {
      await appointmentService.cancel(appointmentId)
      await loadAppointments()
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error)
      alert('Erro ao cancelar agendamento. Tente novamente.')
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>ClickBeard</h1>
          <p>Meus Agendamentos</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <button onClick={logout} className="logout-button">
            Sair
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <Link to="/appointments/new" className="new-appointment-button">
            + Novo Agendamento
          </Link>
        </div>

        <section className="appointments-section">
          <h2>Agendamentos</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : appointments.length === 0 ? (
            <p className="empty-message">
              Você ainda não tem agendamentos.{' '}
              <Link to="/appointments/new">Criar primeiro agendamento</Link>
            </p>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h3>Agendamento #{appointment.id}</h3>
                    <p>
                      <strong>Data:</strong>{' '}
                      {new Date(appointment.data_horario).toLocaleString(
                        'pt-BR'
                      )}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span
                        className={`status status-${appointment.status}`}
                      >
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                  {appointment.status === 'ativo' && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="cancel-button"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

