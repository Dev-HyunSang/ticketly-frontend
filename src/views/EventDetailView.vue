<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-gray-600">이벤트 정보를 불러오는 중...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">이벤트를 불러올 수 없습니다</h3>
        <p class="mt-2 text-gray-500">{{ error }}</p>
        <button
          @click="$router.push('/')"
          class="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>

    <!-- Event Detail -->
    <div v-else-if="event" class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <ol class="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <router-link to="/" class="hover:text-indigo-600">홈</router-link>
            </li>
            <li>/</li>
            <li>
              <router-link to="/events" class="hover:text-indigo-600">등록된 이벤트</router-link>
            </li>
            <li>/</li>
            <li class="text-gray-900">{{ event.title }}</li>
          </ol>
        </nav>

        <div class="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            <!-- Event Image -->
            <div class="bg-white rounded-xl overflow-hidden shadow-sm">
              <div class="relative h-96 bg-gradient-to-br from-indigo-100 to-purple-100">
                <img
                  v-if="event.image"
                  :src="event.image"
                  :alt="event.title"
                  class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-24 h-24 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Event Info -->
            <div class="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <div class="mb-6">
                <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-600 mb-4">
                  {{ event.category }}
                </span>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{{ event.title }}</h1>
                <p class="text-lg text-gray-600">{{ event.organizationName }}</p>
              </div>

              <!-- Event Details Grid -->
              <div class="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div class="flex items-start">
                  <svg class="w-6 h-6 text-indigo-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-1">일시</h3>
                    <p class="text-gray-600">{{ formatDateTime(event.startTime) }}</p>
                    <p class="text-sm text-gray-500 mt-1">종료: {{ formatDateTime(event.endTime) }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-6 h-6 text-indigo-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-1">장소</h3>
                    <p class="text-gray-600">{{ event.venue }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ event.location }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-6 h-6 text-indigo-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-1">참가자</h3>
                    <p class="text-gray-600">{{ event.attendees }}명 참가 중</p>
                    <p class="text-sm text-gray-500 mt-1">잔여 티켓: {{ event.availableTickets }}/{{ event.totalTickets }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <svg class="w-6 h-6 text-indigo-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-1">가격</h3>
                    <p v-if="event.price === 0" class="text-2xl font-bold text-gray-900">무료</p>
                    <div v-else>
                      <p class="text-2xl font-bold text-gray-900">{{ formatPrice(event.price) }}원</p>
                      <p class="text-sm text-gray-500 mt-1">{{ event.currency }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div>
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">이벤트 소개</h2>
                <p class="text-gray-600 whitespace-pre-wrap leading-relaxed">{{ event.description }}</p>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-6">
              <div class="mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-2">티켓 예매</h3>
                <div class="flex items-baseline mb-4">
                  <span v-if="event.price === 0" class="text-3xl font-bold text-gray-900">무료</span>
                  <div v-else>
                    <span class="text-3xl font-bold text-gray-900">{{ formatPrice(event.price) }}</span>
                    <span class="text-gray-600 ml-1">원</span>
                  </div>
                </div>

                <!-- Ticket Status -->
                <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-gray-600">잔여 티켓</span>
                    <span class="text-sm font-semibold text-gray-900">{{ event.availableTickets }}/{{ event.totalTickets }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-indigo-600 h-2 rounded-full"
                      :style="{ width: `${(event.availableTickets / event.totalTickets) * 100}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Status Badge -->
                <div v-if="event.status === 'published'" class="mb-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    예매 가능
                  </span>
                </div>

                <!-- Purchase Button -->
                <router-link
                  v-if="event.availableTickets > 0"
                  :to="`/events/${event.id}/purchase`"
                  class="block w-full bg-indigo-600 text-white py-3.5 sm:py-3 text-base rounded-lg font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition shadow-md text-center touch-manipulation"
                >
                  티켓 예매하기
                </router-link>
                <button
                  v-else
                  disabled
                  class="w-full bg-gray-300 text-gray-500 py-3.5 sm:py-3 text-base rounded-lg font-semibold cursor-not-allowed"
                >
                  매진되었습니다
                </button>
              </div>

              <!-- Additional Info -->
              <div class="border-t border-gray-200 pt-6">
                <h4 class="font-semibold text-gray-900 mb-4">이벤트 정보</h4>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">주최</span>
                    <span class="font-medium text-gray-900">{{ event.organizationName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">상태</span>
                    <span class="font-medium text-gray-900">{{ getStatusText(event.status) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">공개 여부</span>
                    <span class="font-medium text-gray-900">{{ event.isPublic ? '공개' : '비공개' }}</span>
                  </div>
                </div>
              </div>

              <!-- Share Buttons -->
              <div class="border-t border-gray-200 pt-6 mt-6">
                <h4 class="font-semibold text-gray-900 mb-4">공유하기</h4>
                <div class="flex gap-2">
                  <button class="flex-1 border border-gray-300 py-2.5 sm:py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation">
                    <svg class="w-5 h-5 mx-auto text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                  </button>
                  <button class="flex-1 border border-gray-300 py-2.5 sm:py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation">
                    <svg class="w-5 h-5 mx-auto text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                  </button>
                  <button class="flex-1 border border-gray-300 py-2.5 sm:py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation">
                    <svg class="w-5 h-5 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDetailView',
  data () {
    return {
      event: null,
      isLoading: false,
      error: null
    }
  },
  mounted () {
    this.fetchEventDetail()
  },
  methods: {
    async fetchEventDetail () {
      this.isLoading = true
      this.error = null

      try {
        const eventId = this.$route.params.id
        const response = await fetch(`http://localhost:3000/public/events/${eventId}`)

        if (!response.ok) {
          throw new Error('이벤트를 찾을 수 없습니다.')
        }

        const data = await response.json()
        const eventData = data.event

        // API 응답 데이터를 화면에 맞게 변환
        this.event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          category: this.mapCategory(eventData.organization_name),
          startTime: eventData.start_time,
          endTime: eventData.end_time,
          location: eventData.location,
          venue: eventData.venue,
          attendees: eventData.total_tickets - eventData.available_tickets,
          totalTickets: eventData.total_tickets,
          availableTickets: eventData.available_tickets,
          price: eventData.ticket_price,
          currency: eventData.currency,
          status: eventData.status,
          isPublic: eventData.is_public,
          organizationName: eventData.organization_name,
          organizationId: eventData.organization_id,
          createdBy: eventData.created_by,
          createdAt: eventData.created_at,
          updatedAt: eventData.updated_at,
          image: null
        }

        // 페이지 타이틀 업데이트
        document.title = `${eventData.title} - Ticketly`
      } catch (error) {
        console.error('이벤트 조회 실패:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    mapCategory (organizationName) {
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
    formatDateTime (dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}.${month}.${day} ${hours}:${minutes}`
    },
    formatPrice (price) {
      if (price === undefined || price === null) {
        return '0'
      }
      return price.toLocaleString('ko-KR')
    },
    getStatusText (status) {
      const statusMap = {
        published: '공개됨',
        draft: '임시저장',
        cancelled: '취소됨',
        completed: '종료됨'
      }
      return statusMap[status] || status
    }
  }
}
</script>
