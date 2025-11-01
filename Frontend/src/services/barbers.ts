import api from './api'

export interface Barber {
  id: number
  nome: string
  idade: number
}

export interface BarberSpecialty {
  id: number // Este é o barbeiro_especialidade_id
  barbeiro_id?: number
  especialidade_id?: number
  especialidades?: {
    id: number
    nome: string
    valor: number
    duracao_minutos: number
  }
  nome?: string
  valor?: number
  duracao_minutos?: number
}

export interface BarbersResponse {
  barbers: Barber[]
}

export interface BarberSpecialtiesResponse {
  specialties: BarberSpecialty[]
}

export const barberService = {
  async search(query?: string): Promise<BarbersResponse> {
    const url = query
      ? `/barber/search?query=${encodeURIComponent(query)}`
      : '/barber/search'
    const response = await api.get<BarbersResponse>(url)
    return response.data
  },

  async getSpecialties(barberId: number): Promise<BarberSpecialtiesResponse> {
    const response = await api.get<BarberSpecialtiesResponse>(
      `/barber/${barberId}/specialties`
    )
    return response.data
  },
}

