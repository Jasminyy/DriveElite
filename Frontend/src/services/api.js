import axios from "axios"

export const API_URL = "http://localhost:3000"
export const TOKEN_KEY = "driveelite_token"
export const USER_KEY = "driveelite_user"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token)

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function authHeaders() {
  const token = getToken()

  return token
    ? { Authorization: `Bearer ${token}` }
    : {}
}

export function isAuthenticated() {
  return !!getToken()
}

export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {

  const token = getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})