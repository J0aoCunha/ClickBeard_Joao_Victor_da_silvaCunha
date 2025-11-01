import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { barberService, Barber, BarberSpecialty } from '../services/barbers'
import { appointmentService } from '../services/appointments'
import Dropdown from '../components/Dropdown'
import './CreateAppointment.css'

export default function CreateAppointment() {
  const [allBarbers, setAllBarbers] = useState<Barber[]>([])
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null)
  const [specialties, setSpecialties] = useState<BarberSpecialty[]>([])
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null)
  const [barberSpecialtyId, setBarberSpecialtyId] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingBarbers, setLoadingBarbers] = useState(true)
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    loadAllBarbers()
    generateAvailableTimes()
  }, [])

  useEffect(() => {
    if (selectedBarber) {
      loadSpecialties()
    } else {
      setSpecialties([])
      setBarberSpecialtyId(null)
      setSelectedSpecialty(null)
    }
  }, [selectedBarber])

  useEffect(() => {
    if (selectedSpecialty) {
      setBarberSpecialtyId(selectedSpecialty)
    }
  }, [selectedSpecialty])

  useEffect(() => {
    if (date && selectedBarber) {
      // Recarregar horários ocupados sempre que a data ou barbeiro mudar
      // IMPORTANTE: usar selectedBarber, não barberSpecialtyId, pois horários ocupados são por barbeiro, não por especialidade
      loadOccupiedTimes()
    } else {
      setOccupiedTimes([])
      setTime('') // Limpar horário selecionado se dados mudarem
    }
  }, [date, selectedBarber])

  // Recarregar horários ocupados quando a página ganhar foco (após F5, etc)
  useEffect(() => {
    const handleFocus = () => {
      if (date && selectedBarber) {
        // Recarregar horários ocupados do banco (por barbeiro, não por especialidade)
        appointmentService.getOccupiedTimes(date, selectedBarber)
          .then(occupied => {
            setOccupiedTimes(occupied)
          })
          .catch(error => {
            console.error('Erro ao recarregar horários ocupados:', error)
          })
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && date && selectedBarber) {
        // Recarregar quando a aba volta a ficar visível
        appointmentService.getOccupiedTimes(date, selectedBarber)
          .then(occupied => {
            setOccupiedTimes(occupied)
          })
          .catch(error => {
            console.error('Erro ao recarregar horários ocupados:', error)
          })
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [date, selectedBarber])

  // Gerar horários disponíveis de 30 em 30 minutos (9h às 17h30)
  const generateAvailableTimes = () => {
    const times: string[] = []
    for (let hour = 9; hour < 18; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 17) {
        times.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    setAvailableTimes(times)
  }

  const loadOccupiedTimes = async () => {
    if (!date || !selectedBarber) {
      setOccupiedTimes([])
      return
    }

    try {
      // Buscar horários ocupados por barbeiro, não por especialidade
      const occupied = await appointmentService.getOccupiedTimes(
        date,
        selectedBarber
      )
      setOccupiedTimes(occupied)
    } catch (error) {
      console.error('Erro ao carregar horários ocupados:', error)
      setOccupiedTimes([])
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

  const loadSpecialties = async () => {
    if (!selectedBarber) return

    try {
      const response = await barberService.getSpecialties(selectedBarber)
      setSpecialties(response.specialties)
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error)
      toast.error('Erro ao carregar especialidades')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!barberSpecialtyId || !date || !time) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    // Verificar se o horário selecionado está ocupado
    if (occupiedTimes.includes(time)) {
      toast.error('Este horário não está disponível. Por favor, escolha outro horário.')
      return
    }

    setLoading(true)

    try {
      await appointmentService.create({
        barbeiro_especialidade_id: barberSpecialtyId,
        data: date,
        hora: time,
      })
      toast.success('Agendamento criado com sucesso!')
      // Pequeno delay para garantir que o toast seja exibido
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          'Erro ao criar agendamento. Tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Obter data mínima (hoje)
  const today = new Date().toISOString().split('T')[0]

  const barberOptions = allBarbers.map((barber) => ({
    id: barber.id,
    label: `${barber.nome} (${barber.idade} anos)`,
    value: barber,
  }))

  const specialtyOptions = specialties.map((specialty) => {
    const especialidade = specialty.especialidades || specialty
    const nome = especialidade.nome || specialty.nome || `Especialidade ID ${specialty.id}`
    const valor = especialidade.valor || specialty.valor || 0
    const duracao = especialidade.duracao_minutos || specialty.duracao_minutos || 0
    
    return {
      id: specialty.id,
      label: `${nome} - R$ ${(valor / 100).toFixed(2)} (${duracao} min)`,
      value: specialty,
    }
  })

  return (
    <div className="create-appointment-container">
      <div className="create-appointment-card">
        <h1>Novo Agendamento</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Dropdown
              label="Selecione o Barbeiro"
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

          {selectedBarber && (
            <div className="form-group">
              <Dropdown
                label="Especialidade"
                options={specialtyOptions}
                selected={selectedSpecialty}
                onSelect={(id) => setSelectedSpecialty(id)}
                placeholder="Selecione uma especialidade"
                disabled={specialties.length === 0}
              />
              {specialties.length === 0 && (
                <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                  Carregando especialidades...
                </small>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Hora</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={!date || !barberSpecialtyId}
            >
              <option value="">Selecione um horário</option>
              {availableTimes.map((timeSlot) => {
                const isOccupied = occupiedTimes.includes(timeSlot)
                return (
                  <option
                    key={timeSlot}
                    value={timeSlot}
                    disabled={isOccupied}
                    style={
                      isOccupied
                        ? { backgroundColor: '#f8d7da', color: '#721c24' }
                        : {}
                    }
                  >
                    {timeSlot} {isOccupied ? '(Indisponível)' : ''}
                  </option>
                )
              })}
            </select>
            <small>
              Horário de funcionamento: 09:00 às 18:00 (intervalos de 30 minutos)
              {occupiedTimes.length > 0 && (
                <span style={{ color: '#721c24', display: 'block', marginTop: '4px' }}>
                  Horários marcados em vermelho não estão disponíveis
                </span>
              )}
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="cancel-button"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Agendamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
