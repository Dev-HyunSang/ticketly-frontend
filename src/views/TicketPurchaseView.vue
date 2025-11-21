<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-gray-600">이벤트 정보를 불러오는 중...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[400px]">
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

      <!-- Purchase Form -->
      <div v-else-if="event && !purchaseComplete">
        <!-- Breadcrumb -->
        <nav class="mb-8">
          <ol class="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <router-link to="/" class="hover:text-indigo-600">홈</router-link>
            </li>
            <li>/</li>
            <li>
              <router-link :to="`/events/${eventId}`" class="hover:text-indigo-600">{{ event.title }}</router-link>
            </li>
            <li>/</li>
            <li class="text-gray-900">티켓 예매</li>
          </ol>
        </nav>

        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">티켓 예매</h1>

        <div class="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <!-- Form Section -->
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            <!-- Event Summary -->
            <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">이벤트 정보</h2>
              <div class="space-y-3">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ event.title }}</h3>
                  <p class="text-sm text-gray-600">{{ event.organizationName }}</p>
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDateTime(event.startTime) }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ event.venue }}, {{ event.location }}
                </div>
              </div>
            </div>

            <!-- Ticket Quantity -->
            <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">티켓 수량</h2>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <p class="font-medium text-gray-900">일반 티켓</p>
                  <p class="text-sm text-gray-600">
                    잔여 {{ event.availableTickets }}매
                  </p>
                </div>
                <div class="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4">
                  <button
                    @click="decreaseQuantity"
                    :disabled="ticketQuantity <= 1"
                    class="w-12 h-12 sm:w-10 sm:h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="text-2xl sm:text-2xl font-bold text-gray-900 w-16 sm:w-12 text-center">{{ ticketQuantity }}</span>
                  <button
                    @click="increaseQuantity"
                    :disabled="ticketQuantity >= event.availableTickets || ticketQuantity >= 10"
                    class="w-12 h-12 sm:w-10 sm:h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-500">* 1인당 최대 10매까지 구매 가능합니다.</p>
            </div>

            <!-- Buyer Information -->
            <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">예매자 정보</h2>

              <!-- Same as User Checkbox -->
              <div v-if="isLoggedIn" class="mb-4 pb-4 border-b border-gray-200">
                <label class="flex items-center cursor-pointer">
                  <input
                    v-model="form.sameAsUser"
                    @change="handleSameAsUserChange"
                    type="checkbox"
                    class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  >
                  <span class="ml-3 text-sm font-medium text-gray-900">예매자와 사용자가 동일합니다</span>
                </label>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="홍길동"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="example@email.com"
                  >
                  <p class="mt-1 text-sm text-gray-500">티켓이 이메일로 전송됩니다.</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="010-1234-5678"
                  >
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">약관 동의</h2>
              <div class="space-y-3">
                <label class="flex items-start cursor-pointer">
                  <input
                    v-model="form.agreeAll"
                    @change="toggleAllAgreements"
                    type="checkbox"
                    class="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  >
                  <span class="ml-3 text-sm font-medium text-gray-900">전체 동의</span>
                </label>
                <div class="border-t border-gray-200 pt-3 space-y-3">
                  <label class="flex items-start cursor-pointer">
                    <input
                      v-model="form.agreeTerms"
                      type="checkbox"
                      class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    >
                    <span class="ml-3 text-sm text-gray-700">(필수) 이용약관 동의</span>
                  </label>
                  <label class="flex items-start cursor-pointer">
                    <input
                      v-model="form.agreePrivacy"
                      type="checkbox"
                      class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    >
                    <span class="ml-3 text-sm text-gray-700">(필수) 개인정보 수집 및 이용 동의</span>
                  </label>
                  <label class="flex items-start cursor-pointer">
                    <input
                      v-model="form.agreeRefund"
                      type="checkbox"
                      class="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    >
                    <span class="ml-3 text-sm text-gray-700">(필수) 취소 및 환불 정책 동의</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-6">
              <h2 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">주문 정보</h2>

              <div class="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">티켓 가격</span>
                  <span class="text-gray-900">{{ formatPrice(event.price) }}원</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">수량</span>
                  <span class="text-gray-900">{{ ticketQuantity }}매</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">수수료</span>
                  <span class="text-gray-900">{{ formatPrice(serviceFee) }}원</span>
                </div>
              </div>

              <div class="mb-6">
                <div class="flex justify-between items-baseline mb-2">
                  <span class="text-lg font-bold text-gray-900">총 결제금액</span>
                  <div class="text-right">
                    <span class="text-2xl font-bold text-indigo-600">{{ formatPrice(totalPrice) }}</span>
                    <span class="text-gray-600 ml-1">원</span>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{{ errorMessage }}</p>
              </div>

              <button
                @click="handlePurchase"
                :disabled="!canPurchase || isPurchasing"
                class="w-full bg-indigo-600 text-white py-3.5 sm:py-3 text-base sm:text-base rounded-lg font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                <span v-if="isPurchasing">결제 처리 중...</span>
                <span v-else>{{ formatPrice(totalPrice) }}원 결제하기</span>
              </button>

              <p class="mt-4 text-xs text-gray-500 text-center">
                결제 시 위 약관에 모두 동의하는 것으로 간주됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchase Complete -->
      <div v-else-if="purchaseComplete" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl p-6 sm:p-8 shadow-sm text-center">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">예매가 완료되었습니다!</h2>
          <p class="text-gray-600 mb-8">
            티켓이 등록하신 이메일({{ form.email }})로 전송되었습니다.
          </p>

          <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 class="font-semibold text-gray-900 mb-4">예매 정보</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">이벤트</span>
                <span class="text-gray-900">{{ event.title }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">티켓 수량</span>
                <span class="text-gray-900">{{ ticketQuantity }}매</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">결제 금액</span>
                <span class="text-gray-900 font-semibold">{{ formatPrice(totalPrice) }}원</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              @click="$router.push('/')"
              class="flex-1 border border-gray-300 text-gray-700 py-3.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation"
            >
              홈으로
            </button>
            <button
              @click="$router.push('/my-tickets')"
              class="flex-1 bg-indigo-600 text-white py-3.5 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition touch-manipulation"
            >
              내 티켓 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TicketPurchaseView',
  data () {
    return {
      eventId: null,
      event: null,
      isLoading: false,
      error: null,
      errorMessage: '',
      ticketQuantity: 1,
      isPurchasing: false,
      purchaseComplete: false,
      isUserInfoLoaded: false,
      form: {
        sameAsUser: false,
        name: '',
        email: '',
        phone: '',
        agreeAll: false,
        agreeTerms: false,
        agreePrivacy: false,
        agreeRefund: false
      }
    }
  },
  computed: {
    isLoggedIn () {
      const user = localStorage.getItem('user')
      return !!user
    },
    serviceFee () {
      return this.event ? Math.floor(this.event.price * this.ticketQuantity * 0.05) : 0
    },
    totalPrice () {
      return this.event ? (this.event.price * this.ticketQuantity) + this.serviceFee : 0
    },
    canPurchase () {
      return (
        this.form.name &&
        this.form.email &&
        this.form.phone &&
        this.form.agreeTerms &&
        this.form.agreePrivacy &&
        this.form.agreeRefund &&
        this.ticketQuantity > 0
      )
    }
  },
  mounted () {
    this.eventId = this.$route.params.id
    this.fetchEventDetail()
    document.title = '티켓 예매 - Ticketly'
  },
  methods: {
    async fetchEventDetail () {
      this.isLoading = true
      this.error = null

      try {
        const response = await fetch(`http://localhost:3000/public/events/${this.eventId}`)

        if (!response.ok) {
          throw new Error('이벤트를 찾을 수 없습니다.')
        }

        const data = await response.json()
        const eventData = data.event

        this.event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          startTime: eventData.start_time,
          endTime: eventData.end_time,
          location: eventData.location,
          venue: eventData.venue,
          totalTickets: eventData.total_tickets,
          availableTickets: eventData.available_tickets,
          price: eventData.ticket_price,
          currency: eventData.currency,
          organizationName: eventData.organization_name
        }

        document.title = `${eventData.title} 티켓 예매 - Ticketly`
      } catch (error) {
        console.error('이벤트 조회 실패:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    increaseQuantity () {
      if (this.ticketQuantity < this.event.availableTickets && this.ticketQuantity < 10) {
        this.ticketQuantity++
      }
    },
    decreaseQuantity () {
      if (this.ticketQuantity > 1) {
        this.ticketQuantity--
      }
    },
    toggleAllAgreements () {
      const value = this.form.agreeAll
      this.form.agreeTerms = value
      this.form.agreePrivacy = value
      this.form.agreeRefund = value
    },
    async handlePurchase () {
      this.errorMessage = ''

      if (!this.canPurchase) {
        this.errorMessage = '모든 필수 항목을 입력하고 약관에 동의해주세요.'
        return
      }

      this.isPurchasing = true

      try {
        // API 호출 시뮬레이션 (실제로는 백엔드 API를 호출해야 합니다)
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 여기에 실제 결제 API 호출 로직을 추가합니다
        // const response = await fetch('http://localhost:3000/api/tickets/purchase', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     event_id: this.eventId,
        //     quantity: this.ticketQuantity,
        //     buyer_name: this.form.name,
        //     buyer_email: this.form.email,
        //     buyer_phone: this.form.phone
        //   })
        // })

        this.purchaseComplete = true
      } catch (error) {
        console.error('티켓 구매 실패:', error)
        this.errorMessage = '결제 중 오류가 발생했습니다. 다시 시도해주세요.'
      } finally {
        this.isPurchasing = false
      }
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
    handleSameAsUserChange () {
      if (this.form.sameAsUser) {
        this.loadUserInfo()
      } else {
        // 체크 해제 시 폼 초기화
        this.form.name = ''
        this.form.email = ''
        this.form.phone = ''
        this.isUserInfoLoaded = false
      }
    },
    loadUserInfo () {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)

          // 사용자 정보를 폼에 자동 입력
          this.form.name = `${user.first_name || ''}${user.last_name || ''}`.trim()
          this.form.email = user.email || ''
          this.form.phone = user.phone_number || ''

          this.isUserInfoLoaded = true
        }
      } catch (error) {
        console.error('사용자 정보 불러오기 실패:', error)
      }
    }
  }
}
</script>
