import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { adminService, Specialty } from '../services/admin'
import { barberService, Barber } from '../services/barbers'
import { appointmentService } from '../services/appointments'
import Dropdown from '../components/Dropdown'
import './AdminDashboard.css'

interface Appointment {
  id: number
  cliente_id: number
  barbeiro_especialidade_id: number
  data_horario: string
  status: string
  criado_em: string
}

export default function AdminDashboard() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<
    'overview' | 'barber' | 'specialty' | 'connect' | 'appointments'
  >('overview')

  // Estados para Dashboard
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)

  // Estados para Barbeiro
  const [barberName, setBarberName] = useState('')
  const [barberAge, setBarberAge] = useState('')

  // Estados para Especialidade
  const [specialtyName, setSpecialtyName] = useState('')
  const [specialtyValue, setSpecialtyValue] = useState('')
  const [specialtyDuration, setSpecialtyDuration] = useState('')

  // Estados para Conectar
  const [allBarbers, setAllBarbers] = useState<Barber[]>([])
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null)
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([])
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null)
  const [loadingBarbers, setLoadingBarbers] = useState(true)

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'appointments') {
      loadAppointments()
    }
    if (activeTab === 'connect') {
      loadAllBarbers()
      loadAllSpecialties()
    }
  }, [activeTab])

  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true)
      // Por enquanto, vamos tentar usar o endpoint de listar todos
      // Se não existir, o erro será tratado
      try {
        const response = await appointmentService.listAll()
        setAppointments(response.appointments || [])
      } catch {
        // Se não tiver endpoint de listar todos, usar vazio por enquanto
        setAppointments([])
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setLoadingAppointments(false)
    }
  }

  const loadAllBarbers = async () => {
    try {
      setLoadingBarbers(true)
      const response = await barberService.search()
      setAllBarbers(response.barbers)
    } catch (error) {
      console.error('Erro ao carregar barbeiros:', error)
      toast.error('Erro ao carregar barbeiros')
    } finally {
      setLoadingBarbers(false)
    }
  }

  const loadAllSpecialties = async () => {
    try {
      const response = await adminService.listAllSpecialties()
      setAllSpecialties(response.specialties)
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error)
      toast.error('Erro ao carregar especialidades')
    }
  }

  // Estatísticas
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter((apt) =>
    apt.data_horario.startsWith(today)
  )
  const futureAppointments = appointments.filter(
    (apt) => new Date(apt.data_horario) > new Date() && apt.status === 'ativo'
  )
  const completedCount = appointments.filter(
    (apt) => apt.status === 'concluído'
  ).length
  const cancelledCount = appointments.filter(
    (apt) => apt.status === 'cancelado'
  ).length

  const handleCreateBarber = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await adminService.createBarber({
        name: barberName,
        idade: parseInt(barberAge),
      })
      toast.success('Barbeiro criado com sucesso!')
      setBarberName('')
      setBarberAge('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao criar barbeiro')
    }
  }

  const handleCancelAppointment = async (appointmentId: number) => {
    toast(
      (t: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span>Tem certeza que deseja cancelar este agendamento?</span>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                confirmCancelAppointment(appointmentId)
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

  const confirmCancelAppointment = async (appointmentId: number) => {
    try {
      await appointmentService.cancel(appointmentId)
      toast.success('Agendamento cancelado com sucesso!')
      await loadAppointments()
    } catch (err: any) {
      console.error('Erro ao cancelar agendamento:', err)
      toast.error(
        err.response?.data?.message || 'Erro ao cancelar agendamento. Tente novamente.'
      )
    }
  }

  const handleCreateSpecialty = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await adminService.createSpecialty({
        name: specialtyName,
        value: parseInt(specialtyValue) * 100,
        duration_minutes: parseInt(specialtyDuration),
      })
      toast.success('Especialidade criada com sucesso!')
      // Recarregar todas as especialidades do banco
      await loadAllSpecialties()
      setSpecialtyName('')
      setSpecialtyValue('')
      setSpecialtyDuration('')
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Erro ao criar especialidade'
      )
    }
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedBarber || !selectedSpecialty) {
      toast.error('Selecione um barbeiro e uma especialidade')
      return
    }

    try {
      await adminService.connectBarberSpecialty({
        barberId: selectedBarber,
        specialtyId: selectedSpecialty,
      })
      toast.success('Barbeiro conectado à especialidade com sucesso!')
      setSelectedBarber(null)
      setSelectedSpecialty(null)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao conectar')
    }
  }

  const barberOptions = allBarbers.map((barber) => ({
    id: barber.id,
    label: `${barber.nome} (${barber.idade} anos)`,
    value: barber,
  }))

  const specialtyOptions = allSpecialties.map((specialty) => ({
    id: specialty.id,
    label: `${specialty.nome} - R$ ${(specialty.valor / 100).toFixed(2)} (${
      specialty.duracao_minutos
    } min)`,
    value: specialty,
  }))

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <div className="header-content">
          <div>
            <h1>ClickBeard Admin</h1>
            <p>Painel de Administração</p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => navigate('/admin/register')}
              className="register-admin-btn"
            >
              + Novo Admin
            </button>
            <button onClick={logout} className="logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Dashboard
          </button>
          <button
            className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            Atendimentos
          </button>
          <button
            className={`tab ${activeTab === 'barber' ? 'active' : ''}`}
            onClick={() => setActiveTab('barber')}
          >
            Criar Barbeiro
          </button>
          <button
            className={`tab ${activeTab === 'specialty' ? 'active' : ''}`}
            onClick={() => setActiveTab('specialty')}
          >
            Criar Especialidade
          </button>
          <button
            className={`tab ${activeTab === 'connect' ? 'active' : ''}`}
            onClick={() => setActiveTab('connect')}
          >
            Conectar
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="dashboard-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>{todayAppointments.length}</h3>
                    <p>Atendimentos Hoje</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔜</div>
                  <div className="stat-info">
                    <h3>{futureAppointments.length}</h3>
                    <p>Atendimentos Futuros</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>{completedCount}</h3>
                    <p>Atendimentos Realizados</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❌</div>
                  <div className="stat-info">
                    <h3>{cancelledCount}</h3>
                    <p>Atendimentos Cancelados</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="appointments-view">
              <div className="appointments-section">
                <h2>Atendimentos de Hoje</h2>
                {loadingAppointments ? (
                  <p>Carregando...</p>
                ) : todayAppointments.length === 0 ? (
                  <p className="empty-message">Nenhum atendimento hoje</p>
                ) : (
                  <div className="appointments-list">
                    {todayAppointments.map((apt) => (
                      <div key={apt.id} className="appointment-card">
                        <div className="appointment-info">
                          <h3>Agendamento #{apt.id}</h3>
                          <p>
                            {new Date(apt.data_horario).toLocaleString('pt-BR')}
                          </p>
                          <span className={`status status-${apt.status}`}>
                            {apt.status}
                          </span>
                        </div>
                        {apt.status !== 'cancelado' && apt.status !== 'concluído' && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="cancel-button-small"
                            title="Cancelar Agendamento"
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="appointments-section">
                <h2>Atendimentos Futuros</h2>
                {loadingAppointments ? (
                  <p>Carregando...</p>
                ) : futureAppointments.length === 0 ? (
                  <p className="empty-message">Nenhum atendimento futuro</p>
                ) : (
                  <div className="appointments-list">
                    {futureAppointments.map((apt) => (
                      <div key={apt.id} className="appointment-card">
                        <div className="appointment-info">
                          <h3>Agendamento #{apt.id}</h3>
                          <p>
                            {new Date(apt.data_horario).toLocaleString('pt-BR')}
                          </p>
                          <span className={`status status-${apt.status}`}>
                            {apt.status}
                          </span>
                        </div>
                        {apt.status !== 'cancelado' && apt.status !== 'concluído' && (
                          <button
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="cancel-button-small"
                            title="Cancelar Agendamento"
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'barber' && (
            <div className="form-card">
              <h2>Criar Novo Barbeiro</h2>
              <form onSubmit={handleCreateBarber}>
                <div className="form-group">
                  <label htmlFor="barber-name">Nome</label>
                  <input
                    id="barber-name"
                    type="text"
                    value={barberName}
                    onChange={(e) => setBarberName(e.target.value)}
                    required
                    minLength={3}
                    placeholder="Nome do barbeiro"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="barber-age">Idade</label>
                  <input
                    id="barber-age"
                    type="number"
                    value={barberAge}
                    onChange={(e) => setBarberAge(e.target.value)}
                    required
                    min={18}
                    max={100}
                    placeholder="Idade"
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Criar Barbeiro
                </button>
              </form>
            </div>
          )}

          {activeTab === 'specialty' && (
            <div className="form-card">
              <h2>Criar Nova Especialidade</h2>
              <form onSubmit={handleCreateSpecialty}>
                <div className="form-group">
                  <label htmlFor="specialty-name">Nome</label>
                  <input
                    id="specialty-name"
                    type="text"
                    value={specialtyName}
                    onChange={(e) => setSpecialtyName(e.target.value)}
                    required
                    minLength={3}
                    placeholder="Nome da especialidade"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="specialty-value">Valor (R$)</label>
                  <input
                    id="specialty-value"
                    type="number"
                    value={specialtyValue}
                    onChange={(e) => setSpecialtyValue(e.target.value)}
                    required
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="specialty-duration">Duração (minutos)</label>
                  <input
                    id="specialty-duration"
                    type="number"
                    value={specialtyDuration}
                    onChange={(e) => setSpecialtyDuration(e.target.value)}
                    required
                    min={15}
                    placeholder="Minutos"
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Criar Especialidade
                </button>
              </form>
            </div>
          )}

          {activeTab === 'connect' && (
            <div className="form-card">
              <h2>Conectar Barbeiro a Especialidade</h2>
              <form onSubmit={handleConnect}>
                <div className="form-group">
                  <Dropdown
                    label="Barbeiro"
                    options={barberOptions}
                    selected={selectedBarber}
                    onSelect={(id) => setSelectedBarber(id)}
                    placeholder={
                      loadingBarbers
                        ? 'Carregando barbeiros...'
                        : 'Selecione um barbeiro'
                    }
                    disabled={loadingBarbers}
                  />
                </div>

                <div className="form-group">
                  <Dropdown
                    label="Especialidade"
                    options={specialtyOptions}
                    selected={selectedSpecialty}
                    onSelect={(id) => setSelectedSpecialty(id)}
                    placeholder="Selecione uma especialidade"
                    disabled={allSpecialties.length === 0}
                  />
                  {allSpecialties.length === 0 && (
                    <small
                      style={{
                        color: '#666',
                        marginTop: '0.5rem',
                        display: 'block',
                      }}
                    >
                      Crie uma especialidade primeiro na aba "Criar
                      Especialidade"
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={!selectedBarber || !selectedSpecialty}
                >
                  Conectar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
