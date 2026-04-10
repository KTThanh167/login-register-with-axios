<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { gmail_regex, validatePassword } from '@/utils/validate'
import type { Rule } from 'ant-design-vue/es/form'
import { fetchUsers, registerUser } from '@/api/user'

const router = useRouter()
const formState = reactive({ username: '', password: '', confirmPassword: '' })

const validateConfirmPassword = async (_rule: Rule, value: string) => {
  if (!value) return Promise.reject(new Error('Vui lòng nhập lại mật khẩu!'))
  if (value !== formState.password) return Promise.reject(new Error('Mật khẩu không khớp!'))
  return Promise.resolve()
}

const rules = {
  username: [
    { required: true, message: 'Vui lòng nhập username!', trigger: 'change' },
    { pattern: gmail_regex, message: 'Email phải có định dạng @gmail.com!', trigger: 'change' },
  ],
  password: [{ required: true, validator: validatePassword, trigger: 'change' }],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'change' }],
}

const handleRegister = async () => {
  try {
    // Check trùng username
    const existing = await fetchUsers({ username: formState.username })

    if (existing.length > 0) {
      return message.error('Username này đã tồn tại!')
    }

    // Đăng ký
    await registerUser({
      username: formState.username,
      password: formState.password,
    })

    message.success('Đăng ký thành công!')
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    console.error(err)
    message.error('Lỗi hệ thống!')
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <a-form
      :model="formState"
      class="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
      layout="vertical"
      @finish="handleRegister"
      :rules="rules"
    >
      <h2 class="text-white text-2xl mb-6 text-center">Đăng Ký</h2>

      <a-form-item name="username">
        <span class="text-white">Username:</span>
        <a-input v-model:value="formState.username" placeholder="Nhập tên đăng nhập" />
      </a-form-item>

      <a-form-item name="password">
        <span class="text-white">Password:</span>
        <a-input-password v-model:value="formState.password" placeholder="Nhập mật khẩu" />
      </a-form-item>

      <a-form-item name="confirmPassword">
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
