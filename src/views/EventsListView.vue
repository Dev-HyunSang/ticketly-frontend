<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">등록된 이벤트</h1>
        <p class="mt-2 text-sm text-gray-600">등록된 모든 이벤트를 확인하세요</p>
      </div>

      <!-- Filter and Sort -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <!-- Category Filter -->
        <div class="flex-1">
          <select
            v-model="selectedCategory"
            @change="filterEvents"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">모든 카테고리</option>
            <option value="컨퍼런스">컨퍼런스</option>
            <option value="밋업">밋업</option>
            <option value="워크샵">워크샵</option>
            <option value="세미나">세미나</option>
            <option value="네트워킹">네트워킹</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <!-- Sort -->
        <div class="flex-1">
          <select
            v-model="sortBy"
            @change="sortEvents"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date">날짜순</option>
            <option value="price-low">가격 낮은순</option>
            <option value="price-high">가격 높은순</option>
            <option value="popular">인기순</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-gray-600">이벤트를 불러오는 중...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEvents.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">이벤트가 없습니다</h3>
        <p class="mt-1 text-gray-500">선택한 조건에 맞는 이벤트가 없습니다.</p>
      </div>

      <!-- Events List -->
      <div v-else class="space-y-4">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          @click="goToEventDetail(event.id)"
          class="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Event Image -->
            <div class="w-full md:w-48 h-32 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex-shrink-0 overflow-hidden">
              <img
                v-if="event.image"
                :src="event.image"
                :alt="event.title"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>

            <!-- Event Info -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600 mb-2">
                    {{ event.category }}
                  </span>
                  <h3 class="text-xl font-bold text-gray-900">{{ event.title }}</h3>
                </div>
                <div class="text-right ml-4">
                  <span v-if="event.price === 0" class="text-xl font-bold text-gray-900">무료</span>
                  <div v-else>
                    <span class="text-xl font-bold text-gray-900">{{ formatPrice(event.price) }}</span>
                    <span class="text-gray-600 text-sm">원</span>
                  </div>
                  <div class="mt-1">
                    <span class="text-xs text-gray-500">
                      잔여 {{ event.availableTickets }}/{{ event.totalTickets }}
                    </span>
                  </div>
                </div>
              </div>

              <p class="text-gray-600 mb-4 line-clamp-2">{{ event.description }}</p>

              <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(event.date) }}
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ event.location }}
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {{ event.attendees }}명 참가
                </div>
              </div>

              <button class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                예매하기
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <button
            v-for="page in displayPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-4 py-2 rounded-lg',
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventsListView',
  data () {
    return {
      isLoading: false,
      allEvents: [],
      filteredEvents: [],
      selectedCategory: 'all',
      sortBy: 'date',
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage)
    },
    displayPages () {
      const pages = []
      const maxDisplay = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxDisplay / 2))
      const end = Math.min(this.totalPages, start + maxDisplay - 1)

      if (end - start < maxDisplay - 1) {
        start = Math.max(1, end - maxDisplay + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  mounted () {
    this.fetchEvents()
  },
  methods: {
    async fetchEvents () {
      this.isLoading = true
      try {
        const response = await fetch('http://localhost:3000/public/events/')

        if (!response.ok) {
          throw new Error('이벤트를 불러올 수 없습니다.')
        }

        const data = await response.json()

        // API 응답 데이터를 화면에 맞게 변환
        this.allEvents = data.events.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          category: this.mapCategory(event.organization_name),
          date: event.start_time,
          location: event.location,
          venue: event.venue,
          attendees: event.total_tickets - event.available_tickets,
          totalTickets: event.total_tickets,
          availableTickets: event.available_tickets,
          price: event.ticket_price,
          currency: event.currency,
          status: event.status,
          organizationName: event.organization_name,
          image: null
        }))

        this.filterEvents()
      } catch (error) {
        console.error('이벤트 조회 실패:', error)
        this.allEvents = []
        this.filteredEvents = []
      } finally {
        this.isLoading = false
      }
    },
    mapCategory (organizationName) {
      // 조직 이름에 따라 카테고리 매핑 (임시)
      if (!organizationName) {
        return '기타'
      }
      if (organizationName.includes('Tech') || organizationName.includes('기술')) {
        return '컨퍼런스'
      } else if (organizationName.includes('Meetup')) {
        return '밋업'
      } else if (organizationName.includes('Workshop')) {
        return '워크샵'
      }
      return '기타'
    },
    filterEvents () {
      let filtered = [...this.allEvents]

      // 카테고리 필터링
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(event => event.category === this.selectedCategory)
      }

      this.filteredEvents = filtered
      this.sortEvents()
      this.currentPage = 1
    },
    sortEvents () {
      switch (this.sortBy) {
        case 'date':
          this.filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
          break
        case 'price-low':
          this.filteredEvents.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          this.filteredEvents.sort((a, b) => b.price - a.price)
          break
        case 'popular':
          this.filteredEvents.sort((a, b) => b.attendees - a.attendees)
          break
      }
    },
    changePage (page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    formatDate (dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`
    },
    formatPrice (price) {
      if (price === undefined || price === null) {
        return '0'
      }
      return price.toLocaleString('ko-KR')
    },
    goToEventDetail (eventId) {
      this.$router.push(`/events/${eventId}`)
    }
  }
}
</script>
