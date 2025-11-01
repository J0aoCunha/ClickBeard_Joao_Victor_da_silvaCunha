import api from './api'

export interface CreateAppointmentData {
  barbeiro_especialidade_id: number
  data: string
  hora: string
}

export interface AppointmentResponse {
  appointment: {
    id: number
    cliente_id: number
    barbeiro_especialidade_id: number
    data_horario: string
    status: string
    criado_em: string
  }
}

export interface AppointmentListResponse {
  appointments: AppointmentItem[]
}

export interface AppointmentItem {
  id: number
  cliente_id: number
  barbeiro_especialidade_id: number
  data_horario: string
  status: string
  criado_em: string
}

export const appointmentService = {
  async create(data: CreateAppointmentData): Promise<AppointmentResponse> {
    const response = await api.post<AppointmentResponse>('/appointment', data)
    return response.data
  },

  async list(): Promise<AppointmentListResponse> {
    const response = await api.get<AppointmentListResponse>('/appointment')
    return response.data
  },

  async listAll(): Promise<AppointmentListResponse> {
    const response = await api.get<AppointmentListResponse>('/appointment/all')
    return response.data
  },

  async cancel(appointmentId: number) {
    try {
      const response = await api.patch(
        `/appointment/${appointmentId}/cancel`
      )
      return response.data
    } catch (error: any) {
      // Re-throw para que o componente possa tratar
      throw error
    }
  },

  async getOccupiedTimes(date: string, barbeiro_id: number) {
    const response = await api.get<{ occupiedTimes: string[] }>(
      `/appointment/occupied-times?date=${date}&barbeiro_id=${barbeiro_id}`
    )
    return response.data.occupiedTimes
  },
}

