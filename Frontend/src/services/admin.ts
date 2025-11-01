import api from './api'

export interface CreateBarberData {
  name: string
  idade: number
}

export interface CreateSpecialtyData {
  name: string
  value: number
  duration_minutes: number
}

export interface ConnectBarberSpecialtyData {
  barberId: number
  specialtyId: number
}

export interface BarberResponse {
  barber: {
    id: number
    nome: string
    idade: number
    data_contratacao: string
    criado_em: string
  }
}

export interface SpecialtyResponse {
  specialty: {
    id: number
    nome: string
    valor: number
    duracao_minutos: number
  }
}

export interface Specialty {
  id: number
  nome: string
  valor: number
  duracao_minutos: number
}

export const adminService = {
  async createBarber(data: CreateBarberData): Promise<BarberResponse> {
    const response = await api.post<BarberResponse>('/barber', data)
    return response.data
  },

  async createSpecialty(data: CreateSpecialtyData): Promise<SpecialtyResponse> {
    const response = await api.post<SpecialtyResponse>('/specialty', data)
    return response.data
  },

  async connectBarberSpecialty(data: ConnectBarberSpecialtyData) {
    const response = await api.post('/appointment/connect-barber-specialty', data)
    return response.data
  },

  async listAllSpecialties(): Promise<{ specialties: Specialty[] }> {
    const response = await api.get<{ specialties: Specialty[] }>('/specialty')
    return response.data
  },
}

