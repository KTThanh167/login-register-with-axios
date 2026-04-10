import api from '@/utils/axios-req'

export interface User {
  id: string
  username: string
  password: string
}

export interface AuthData {
  token: string
}

// Tìm kiến user
export const fetchUsers = (params: Partial<User>): Promise<User[]> => {
  return api.get('/users', { params });
}

// Đăng ký user mới
export const registerUser = (data: Omit<User, 'id'>) : Promise<User> => {
  return api.post('/users', data)
}

//Lấy token ảo từ endpoint auth
export const getAuthToken = (): Promise<AuthData> => {
  return api.get('/auth')
}
