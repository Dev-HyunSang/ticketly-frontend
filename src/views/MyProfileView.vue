<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">내 정보</h1>
        <p class="mt-2 text-sm text-gray-600">회원 정보를 수정할 수 있습니다.</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-lg shadow p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600">정보를 불러오는 중...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="bg-white rounded-lg shadow p-8">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">정보를 불러올 수 없습니다</h3>
          <p class="mt-1 text-sm text-gray-500">{{ loadError }}</p>
          <button
            @click="loadUserData"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            다시 시도
          </button>
        </div>
      </div>

      <!-- Profile Form -->
      <div v-else class="bg-white rounded-lg shadow">
        <form @submit.prevent="handleUpdateProfile" class="p-6 space-y-6">
          <!-- Personal Information Section -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- First Name -->
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  성
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <!-- Last Name -->
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <!-- Nickname -->
              <div>
                <label for="nickName" class="block text-sm font-medium text-gray-700 mb-1">
                  닉네임
                </label>
                <input
                  id="nickName"
                  v-model="form.nickName"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <!-- Birthday -->
              <div>
                <label for="birthday" class="block text-sm font-medium text-gray-700 mb-1">
                  생년월일
                </label>
                <input
                  id="birthday"
                  v-model="form.birthday"
                  type="date"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <!-- Email (Read-only) -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  disabled
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p class="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다.</p>
              </div>

              <!-- Phone Number -->
              <div>
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
                  휴대폰 번호
                </label>
                <input
                  id="phoneNumber"
                  v-model="form.phoneNumber"
                  type="tel"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          <!-- Account Information Section -->
          <div class="border-t border-gray-200 pt-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">계정 정보</h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div>
                <span class="text-gray-500">회원 ID:</span>
                <span class="ml-2 text-gray-900 font-mono">{{ userInfo.id }}</span>
              </div>
              <div>
                <span class="text-gray-500">가입일:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(userInfo.created_at) }}</span>
              </div>
              <div>
                <span class="text-gray-500">최종 수정일:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(userInfo.updated_at) }}</span>
              </div>
              <div>
                <span class="text-gray-500">계정 상태:</span>
                <span class="ml-2">
                  <span v-if="userInfo.is_valid" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    활성
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    비활성
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="rounded-lg bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-800">{{ successMessage }}</p>
              </div>
            </div>
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

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="loadUserData"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSaving">저장 중...</span>
              <span v-else>저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { authFetch } from '@/utils/auth'

export default {
  name: 'MyProfileView',
  data () {
    return {
      isLoading: true,
      isSaving: false,
      loadError: '',
      errorMessage: '',
      successMessage: '',
      userInfo: {},
      form: {
        firstName: '',
        lastName: '',
        nickName: '',
        birthday: '',
        email: '',
        phoneNumber: ''
      }
    }
  },
  mounted () {
    this.loadUserData()
  },
  methods: {
    async loadUserData () {
      this.isLoading = true
      this.loadError = ''

      try {
        const response = await authFetch('http://localhost:3000/api/me')

        if (!response.ok) {
          throw new Error('사용자 정보를 불러올 수 없습니다.')
        }

        const data = await response.json()
        this.userInfo = data

        // 폼에 데이터 채우기
        this.form.firstName = data.first_name || ''
        this.form.lastName = data.last_name || ''
        this.form.nickName = data.nick_name || ''
        this.form.birthday = data.birthday || ''
        this.form.email = data.email || ''
        this.form.phoneNumber = data.phone_number || ''
      } catch (error) {
        this.loadError = error.message || '정보를 불러오는 중 오류가 발생했습니다.'
        console.error('사용자 정보 로드 실패:', error)
      } finally {
        this.isLoading = false
      }
    },
    async handleUpdateProfile () {
      this.isSaving = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const requestBody = {
          first_name: this.form.firstName,
          last_name: this.form.lastName,
          nick_name: this.form.nickName,
          birthday: this.form.birthday,
          phone_number: this.form.phoneNumber
        }

        const response = await authFetch('http://localhost:3000/api/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || '정보 수정에 실패했습니다.')
        }

        const updatedData = await response.json()

        // 로컬 스토리지의 사용자 정보도 업데이트
        localStorage.setItem('user', JSON.stringify(updatedData))

        this.successMessage = '정보가 성공적으로 수정되었습니다.'
        this.userInfo = updatedData

        // 3초 후 성공 메시지 자동 제거
        setTimeout(() => {
          this.successMessage = ''
        }, 3000)
      } catch (error) {
        this.errorMessage = error.message || '정보 수정 중 오류가 발생했습니다.'
        console.error('정보 수정 실패:', error)
      } finally {
        this.isSaving = false
      }
    },
    formatDate (dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>
