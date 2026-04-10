<template>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="handleLogin"
    @finishFailed="handleLoginFailed"
  >
    <a-form-item
      name="username"
      :rules="[
        { required: true, message: 'Vui lòng nhập tên người dùng!' },
        {
          pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
          message: 'Email phải có định dạng @gmail.com!',
          trigger: 'change',
        },
      ]"
    >
      <div class="flex items-center gap-4">
        <span class="text-white">Username:</span>
        <a-input v-model:value="formState.username" />
      </div>
    </a-form-item>

    <a-form-item
      name="password"
      :rules="[
        {
          required: true,
          validator: validatePassword,
          message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số!',
          trigger: 'change',
        },
      ]"
    >
      <div class="flex items-center gap-4">
        <span class="text-white">Password:</span>
        <a-input-password v-model:value="formState.password" />
      </div>
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 0, span: 16 }">
      <a-checkbox v-model:checked="formState.remember" class="text-white">Remember me</a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 5, span: 16 }">
      <a-button type="link" @click="router.push('/register')">
        Chưa có tài khoản? Đăng ký ngay
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import api from '@/utils/axios-req'
import type { Rule } from 'postcss'

interface FormState {
  username: string
  password: string
  remember: boolean
}

interface User {
  id: string | number
  username: string
  password?: string
}

interface AuthResponse {
  token: string
}

const router = useRouter()

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
})

// Hàm xử lý đăng nhập
const handleLogin = async (values: FormState) => {
  try {
    // Gọi API tìm user với username và password tương ứng
    // Sử dụng ép kiểu 'as unknown as T' để giải quyết xung đột giữa Axios và Interceptor
    const users = (await api.get('/users', {
      params: {
        username: values.username,
        password: values.password,
      },
    })) as unknown as User[]

    if (users && users.length > 0) {
      // Lấy token từ endpoint /auth
      const authData = (await api.get('/auth')) as unknown as AuthResponse
      const token = authData.token

      // Lưu vào máy
      localStorage.setItem('access_token', token)

      message.success('Đăng nhập thành công!')

      // Chuyển hướng sang trang chủ
      router.push('/')
    } else {
      message.error('Tài khoản hoặc mật khẩu không chính xác!')
    }
  } catch (error: unknown) {
    console.error('Login Error:', error)
    if (error instanceof Error) {
      message.error('Lỗi kết nối: ' + error.message)
    } else {
      message.error('Đã xảy ra lỗi không xác định!')
    }
  }
}

const handleLoginFailed = (errorInfo: unknown) => {
  console.log('Failed:', errorInfo)
}

//Hàm validate mật khẩu
const validatePassword = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject(new Error('Vui lòng nhập mật khẩu!'))
  }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  if (!passwordRegex.test(value)) {
    return Promise.reject(
      new Error('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số!'),
    )
  }
  return Promise.resolve()
}
</script>
