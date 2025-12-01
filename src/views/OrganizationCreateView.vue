<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 sm:py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <button
          @click="$router.back()"
          class="flex items-center text-gray-600 hover:text-gray-900 transition"
        >
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          돌아가기
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">새 그룹 개설하기</h1>
        <p class="text-gray-600 mb-8">함께 이벤트를 개최할 그룹을 만들어보세요.</p>

        <form @submit.prevent="createOrganization">
          <div class="space-y-6">
            <!-- 그룹 이름 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                그룹 이름 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="예: 대학교 축제 준비위원회"
              />
              <p class="mt-1 text-sm text-gray-500">그룹을 대표할 이름을 입력해주세요.</p>
            </div>

            <!-- 그룹 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                그룹 설명
              </label>
              <textarea
                v-model="formData.description"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="그룹의 목적과 활동에 대해 간단히 설명해주세요."
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">그룹에 대한 자세한 설명을 입력하면 멤버들이 이해하기 쉽습니다.</p>
            </div>

            <!-- 그룹 카테고리 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                그룹 카테고리
              </label>
              <select
                v-model="formData.category"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">선택하지 않음</option>
                <option value="festival">축제/페스티벌</option>
                <option value="concert">공연/콘서트</option>
                <option value="conference">컨퍼런스/세미나</option>
                <option value="workshop">워크샵/클래스</option>
                <option value="sports">스포츠</option>
                <option value="community">커뮤니티</option>
                <option value="other">기타</option>
              </select>
            </div>

            <!-- 그룹 로고 URL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                그룹 로고 URL
              </label>
              <input
                v-model="formData.logo_url"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
              <p class="mt-1 text-sm text-gray-500">그룹을 대표하는 로고 이미지 URL을 입력해주세요.</p>
            </div>

            <!-- 에러 메시지 -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex">
                <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-red-600">{{ error }}</p>
              </div>
            </div>

            <!-- 안내 사항 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="font-semibold text-blue-900 mb-2">그룹 개설 안내</h3>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• 그룹을 생성하면 자동으로 관리자가 됩니다.</li>
                <li>• 그룹 멤버를 초대하여 함께 이벤트를 관리할 수 있습니다.</li>
                <li>• 그룹 정보는 언제든지 수정할 수 있습니다.</li>
              </ul>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              @click="$router.back()"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              취소
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? '생성 중...' : '그룹 생성하기' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccessToken } from '@/utils/auth'

export default {
  name: 'OrganizationCreateView',
  data () {
    return {
      formData: {
        name: '',
        description: '',
        category: '',
        logo_url: ''
      },
      isSubmitting: false,
      error: null
    }
  },
  methods: {
    async createOrganization () {
      this.isSubmitting = true
      this.error = null

      try {
        const token = getAccessToken()
        if (!token) {
          this.$router.push('/login')
          return
        }

        const response = await fetch('http://localhost:3000/api/organizations/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.formData.name,
            description: this.formData.description,
            logo_url: this.formData.logo_url || '',
            category: this.formData.category || ''
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || '그룹 생성에 실패했습니다.')
        }

        // 성공 시 이벤트 개설 페이지로 이동
        alert('그룹이 성공적으로 생성되었습니다!')
        this.$router.push('/events/create')
      } catch (error) {
        console.error('그룹 생성 실패:', error)
        this.error = error.message
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>
