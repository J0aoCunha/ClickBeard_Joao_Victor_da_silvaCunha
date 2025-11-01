import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { appointmentService } from '../services/appointments'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout, loadUser } = useAuth()
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
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (appointmentId: number) => {
    toast(
      (t: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span>Tem certeza que deseja cancelar este agendamento?</span>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                confirmCancel(appointmentId)
              }}
              style={{
                padding: '6px 12px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Sim, cancelar
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: '6px 12px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Não
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          background: '#fff',
          color: '#1a1a1a',
          padding: '16px',
          borderRadius: '10px',
          minWidth: '300px',
        },
      }
    )
  }

  const confirmCancel = async (appointmentId: number) => {
    try {
      await appointmentService.cancel(appointmentId)
      toast.success('Agendamento cancelado com sucesso!')
      await loadAppointments()
      await loadUser()
    } catch (error: any) {
      console.error('Erro ao cancelar agendamento:', error)
      toast.error(
        error.response?.data?.message ||
          'Erro ao cancelar agendamento. Tente novamente.'
      )
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>ClickBeard</h1>
          <p>Bem-vindo, {user?.nome}!</p>
        </div>
        <button onClick={logout} className="logout-button">
          Sair
        </button>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <Link to="/appointments/new" className="new-appointment-button">
            + Novo Agendamento
          </Link>
        </div>

        <section className="appointments-section">
          <h2>Meus Agendamentos</h2>
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
                    <div className="appointment-header-info">
                      <h3>Agendamento #{appointment.id}</h3>
                      <span
                        className={`status status-${appointment.status}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <p className="appointment-date">
                      {new Date(appointment.data_horario).toLocaleString(
                        'pt-BR',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                  {appointment.status === 'ativo' && (
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="cancel-button-small"
                      title="Cancelar agendamento"
                    >
                      ✕
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
