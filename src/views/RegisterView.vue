<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import api from '@/utils/axios-req'
import type { Rule } from 'postcss'

const router = useRouter()

const formState = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})
// Hàm xử lý đăng ký
const handleRegister = async () => {
  try {
    // 1.Kiểm tra xem username đã tồn  tại chưa (Tránh trùng lặp)
    const existingUsers = (await api.get('/users', {
      params: { username: formState.username },
    })) as unknown as unknown[]

    if (existingUsers.length > 0) {
      message.error('Username này đã tồn tại!')
      return
    }

    // 2.Gửi request POST để tạo user mới
    await api.post('/users', {
      username: formState.username,
      password: formState.password,
    })
    message.success('Đăng ký thành công! Đang chuyển sang trang Đăng nhập...')

    //Chờ 1.5s rồi chuyển sang trang login
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error: unknown) {
    if (error instanceof Error) {
      message.error('Lỗi đăng ký: ' + error.message)
    }
  }
}

// Validate mật khẩu > 6 ký tự, 1 chữ hoa, 1 chữ thường, 1 số
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

// Validate xác nhận lại mật khẩu
const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject(new Error('Vui lòng nhập lại mật khẩu!'))
  }
  if (value !== formState.password) {
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
  }
  return Promise.resolve()
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <a-form
      :model="formState"
      class="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
      layout="vertical"
      @finish="handleRegister"
    >
      <h2 class="text-white text-2xl mb-6 text-center">Đăng Ký</h2>

      <a-form-item
        name="username"
        :rules="[
          { required: true, message: 'Vui lòng nhập username!' },
          {
            pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            message: 'Email phải có định dạng @gmail.com!',
          },
        ]"
      >
        <span class="text-white">Username:</span>
        <a-input v-model:value="formState.username" placeholder="Nhập tên đăng nhập" />
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, validator: validatePassword, trigger: 'change' }]"
      >
        <span class="text-white">Password:</span>
        <a-input-password v-model:value="formState.password" placeholder="Nhập mật khẩu" />
      </a-form-item>

      <a-form-item
        name="confirmPassword"
        :rules="[{ required: true, validator: validateConfirmPassword, trigger: 'change' }]"
      >
        <span class="text-white">Confirm Password:</span>
        <a-input-password v-model:value="formState.confirmPassword" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block class="mb-4"> Đăng Ký </a-button>
        <div class="text-center">
          <router-link to="/login" class="text-blue-400"
            >Đã có tài khoản? Đăng nhập ngay</router-link
          >
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>
