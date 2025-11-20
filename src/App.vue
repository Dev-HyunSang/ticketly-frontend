<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <span class="text-2xl font-bold text-indigo-600">Ticketly</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="text-gray-700 hover:text-indigo-600 font-medium transition">
              홈
            </router-link>
            <template v-if="isLoggedIn">
              <div class="relative">
                <button
                  @click="userMenuOpen = !userMenuOpen"
                  class="text-gray-700 hover:text-indigo-600 font-medium transition flex items-center space-x-1"
                >
                  <span>{{ userName }}님</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  <router-link
                    to="/my-tickets"
                    @click="userMenuOpen = false"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    구매한 티켓
                  </router-link>
                  <router-link
                    to="/my-profile"
                    @click="userMenuOpen = false"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    내 정보
                  </router-link>
                  <div class="border-t border-gray-200 my-1"></div>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </template>
            <router-link v-else to="/login" class="text-gray-700 hover:text-indigo-600 font-medium transition">
              로그인
            </router-link>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-indigo-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 space-y-2">
          <router-link to="/" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
            홈
          </router-link>
          <template v-if="isLoggedIn">
            <div class="px-4 py-2 text-gray-700 font-medium">
              {{ userName }}님
            </div>
            <button @click="handleLogout" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              로그아웃
            </button>
          </template>
          <router-link v-else to="/login" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
            로그인
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view/>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-bold text-gray-900 mb-4">Ticketly</h3>
            <p class="text-gray-600 text-sm">
              이벤트 티켓팅의 새로운 기준
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">서비스</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-indigo-600">티켓판매</a></li>
              <li><a href="#" class="hover:text-indigo-600">이벤트 관리</a></li>
              <li><a href="#" class="hover:text-indigo-600">정산</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">회사</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-indigo-600">회사소개</a></li>
              <li><a href="#" class="hover:text-indigo-600">이용약관</a></li>
              <li><a href="#" class="hover:text-indigo-600">개인정보처리방침</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">고객센터</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>이메일: support@ticketly.com</li>
              <li>전화: 02-1234-5678</li>
              <li>운영시간: 평일 09:00-18:00</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          © 2024 Ticketly. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { getUser, isAuthenticated, logout } from '@/utils/auth'

export default {
  data () {
    return {
      mobileMenuOpen: false,
      userMenuOpen: false
    }
  },
  computed: {
    isLoggedIn () {
      return isAuthenticated()
    },
    currentUser () {
      return getUser()
    },
    userName () {
      if (this.currentUser) {
        return `${this.currentUser.first_name}${this.currentUser.last_name}`
      }
      return ''
    }
  },
  methods: {
    handleLogout () {
      this.userMenuOpen = false
      logout()
      this.$router.push('/login').then(() => {
        // 페이지 새로고침
        window.location.reload()
      })
    }
  },
  mounted () {
    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.relative')) {
        this.userMenuOpen = false
      }
    })
  }
}
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
