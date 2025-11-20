<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">로그인</h2>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4 rounded-md">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="example@email.com"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Remember me & Forgot password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-700 cursor-pointer">
              로그인 상태 유지
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
              비밀번호 찾기
            </a>
          </div>
        </div>

        <!-- Signup Link -->
        <p class="text-center text-sm text-gray-600">
          계정이 없으신가요?
          <router-link to="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">
            회원가입
          </router-link>
        </p>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">로그인 중...</span>
            <span v-else>로그인</span>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </form>

      <!-- Social Login -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">또는</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            @click="handleSocialLogin('google')"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="ml-2">Google</span>
          </button>

          <button
            @click="handleSocialLogin('kakao')"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#3C1E1E" d="M12 3C6.477 3 2 6.477 2 10.75c0 2.762 1.848 5.173 4.598 6.552-.196.722-.722 2.676-.832 3.092-.135.51.185.502.39.365.17-.112 2.757-1.87 3.196-2.196C10.19 18.832 11.095 19 12 19c5.523 0 10-3.477 10-7.75S17.523 3 12 3z"/>
            </svg>
            <span class="ml-2">Kakao</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setAuthData } from '@/utils/auth'

export default {
  name: 'LoginView',
  data () {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin () {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const requestBody = {
          email: this.form.email,
          password: this.form.password
        }

        console.log('로그인 요청:', requestBody)

        const response = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '로그인 실패')
        }

        const data = await response.json()

        // JWT 토큰 및 사용자 정보 저장
        setAuthData(data.access_token, data.refresh_token, data.user)

        // 로그인 상태 유지 옵션 저장
        if (this.form.rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }

        console.log('로그인 성공:', {
          userId: data.user?.id,
          email: data.user?.email,
          nickName: data.user?.nick_name
        })

        // 로그인 성공 시 홈으로 이동 후 새로고침
        this.$router.push('/').then(() => {
          window.location.reload()
        })
      } catch (error) {
        this.errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.'
        console.error('로그인 실패:', error)
      } finally {
        this.isLoading = false
      }
    },
    handleSocialLogin (provider) {
      console.log(`${provider} 로그인 시도`)
      // TODO: 소셜 로그인 구현
    }
  }
}
</script>
