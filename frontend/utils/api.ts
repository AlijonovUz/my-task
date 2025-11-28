// utils/api.ts

export const BASE_URL = "http://localhost:8000"

export const ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login/`,
  REGISTER: `${BASE_URL}/auth/register/`,
  TODOS: `${BASE_URL}/api/v1/todos/`,
}
