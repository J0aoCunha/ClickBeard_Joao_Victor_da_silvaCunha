import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface ClientProfile {
  nome: string
  email: string
  agendamentos: Appointment[]
}

export interface Appointment {
  id: number
  data_horario_formatada: string
  status: string
  especialidade: string
  barbeiro: string
}

export interface AdminRegisterData {
  name: string
  email: string
  password: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      '/client/authenticate',
      credentials
    )
    return response.data
  },

  async loginAdmin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      '/admin/authenticate',
      credentials
    )
    return response.data
  },

  async register(data: RegisterData) {
    const response = await api.post('/client', data)
    return response.data
  },

  async registerAdmin(data: AdminRegisterData) {
    const response = await api.post('/admin', data)
    return response.data
  },

  async getProfile(): Promise<ClientProfile> {
    const response = await api.get<ClientProfile>('/me')
    return response.data
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/client/refresh-token')
    return response.data
  },
}

