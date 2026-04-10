<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { gmail_regex, validatePassword } from '@/utils/validate'
import { fetchUsers, getAuthToken } from '@/api/user'

const router = useRouter()
const formState = reactive({ username: '', password: '' })

const rules = {
  username: [
    { required: true, message: 'Vui lòng nhập username!', trigger: 'change' },
    { pattern: gmail_regex, message: 'Email phải có định dạng @gmail.com!', trigger: 'change' },
  ],
  password: [{ required: true, validator: validatePassword, trigger: 'change' }],
}

const handleLogin = async () => {
  try {
    // Gọi hàm từ API layer
    const users = await fetchUsers({
      username: formState.username,
      password: formState.password,
    })

    if (users && users.length > 0) {
      const authData = await getAuthToken()
      localStorage.setItem('access_token', authData.token)
      message.success('Đăng nhập thành công!')
      router.push('/')
    } else {
      message.error('Tài khoản hoặc mật khẩu không chính xác!')
    }
  } catch (err) {
    console.error('Login error:', err)
    message.error('Lỗi kết nối server!')
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <a-form
      :model="formState"
      :rules="rules"
      class="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
      layout="vertical"
      @finish="handleLogin"
    >
      <h2 class="text-white text-2xl mb-6 text-center">Đăng Nhập</h2>

      <a-form-item name="username">
        <span class="text-white">Username:</span>
        <a-input v-model:value="formState.username" placeholder="example@gmail.com" />
      </a-form-item>

      <a-form-item name="password">
        <span class="text-white">Password:</span>
        <a-input-password v-model:value="formState.password" placeholder="Nhập mật khẩu" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block> Đăng Nhập </a-button>
      </a-form-item>

      <a-form-item class="text-center">
        <router-link to="/register" class="text-blue-400"
          >Chưa có tài khoản? Đăng ký ngay</router-link
        >
      </a-form-item>
    </a-form>
  </div>
</template>
