<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 sm:py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">함께 이벤트 개설하기</h1>
        <router-link
          to="/organizations/create"
          class="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          그룹 개설하기
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[300px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-gray-600">그룹 정보를 불러오는 중...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl p-6 sm:p-8 shadow-sm text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="fetchMyOrganizations"
          class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          다시 시도
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="organizations.length === 0" class="bg-white rounded-xl p-6 sm:p-8 shadow-sm text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">소속된 그룹이 없습니다</h3>
        <p class="text-gray-600 mb-6">이벤트를 개설하려면 먼저 그룹에 가입하거나 새로운 그룹을 만들어주세요.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            to="/organizations/create"
            class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-center"
          >
            그룹 개설하기
          </router-link>
          <button
            @click="$router.push('/')"
            class="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>

      <!-- Organizations List -->
      <div v-else class="space-y-4">
        <p class="text-gray-600 mb-4">이벤트를 개설할 그룹을 선택해주세요</p>

        <div
          v-for="org in organizations"
          :key="org.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
          @click="selectOrganization(org)"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ org.name }}</h3>
                <p class="text-sm text-gray-600 mb-3">{{ org.description || '설명이 없습니다.' }}</p>

                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    멤버 {{ org.member_count || 0 }}명
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    생성일: {{ formatDate(org.created_at) }}
                  </div>
                </div>
              </div>

              <div class="ml-4">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccessToken } from '@/utils/auth'

export default {
  name: 'EventCreateView',
  data () {
    return {
      organizations: [],
      isLoading: false,
      error: null
    }
  },
  mounted () {
    this.fetchMyOrganizations()
  },
  methods: {
    async fetchMyOrganizations () {
      this.isLoading = true
      this.error = null

      try {
        const token = getAccessToken()
        if (!token) {
          this.$router.push('/login')
          return
        }

        const response = await fetch('http://localhost:3000/api/organizations/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('그룹 정보를 불러올 수 없습니다.')
        }

        const data = await response.json()
        this.organizations = data.organizations || []
      } catch (error) {
        console.error('그룹 조회 실패:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    selectOrganization (org) {
      // 선택한 그룹으로 이벤트 생성 폼으로 이동
      // TODO: 이벤트 생성 폼 페이지로 라우팅 (추후 구현)
      console.log('Selected organization:', org)
      alert(`"${org.name}" 그룹이 선택되었습니다.\n이벤트 생성 폼은 추후 구현 예정입니다.`)
    },
    formatDate (dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`
    }
  }
}
</script>
