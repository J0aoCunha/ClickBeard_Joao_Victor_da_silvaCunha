import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true, // Importante para receber cookies do refresh token
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    // Tenta usar token de admin primeiro, depois token de cliente
    const adminToken = localStorage.getItem('@ClickBeard:adminToken')
    const clientToken = localStorage.getItem('@ClickBeard:token')
    const token = adminToken || clientToken
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para renovar o token quando expirar
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Verificar se é token de admin ou cliente
      const isAdminRequest = localStorage.getItem('@ClickBeard:adminToken')

      try {
        // Se for admin, não tentar refresh (admins não têm refresh token implementado)
        if (isAdminRequest) {
          localStorage.removeItem('@ClickBeard:adminToken')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        const response = await axios.post(
          'http://localhost:3333/client/refresh-token',
          {},
          {
            withCredentials: true,
          }
        )

        const { token } = response.data
        localStorage.setItem('@ClickBeard:token', token)

        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('@ClickBeard:token')
        localStorage.removeItem('@ClickBeard:adminToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

