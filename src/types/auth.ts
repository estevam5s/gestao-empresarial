export interface User {
  id: string
  username: string
  email: string
  name: string
  role: string
  avatar_url?: string
  created_at?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}