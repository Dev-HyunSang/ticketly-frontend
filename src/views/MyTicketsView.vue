<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 sm:py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">내 티켓</h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[300px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-gray-600">티켓 정보를 불러오는 중...</p>
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
          @click="fetchMyTickets"
          class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          다시 시도
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="payments.length === 0" class="bg-white rounded-xl p-6 sm:p-8 shadow-sm text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">구매한 티켓이 없습니다</h3>
        <p class="text-gray-600 mb-6">이벤트를 둘러보고 티켓을 구매해보세요!</p>
        <router-link
          to="/events"
          class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          이벤트 둘러보기
        </router-link>
      </div>

      <!-- Tickets List -->
      <div v-else class="space-y-4">
        <div
          v-for="payment in payments"
          :key="payment.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div class="p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <!-- Ticket Info -->
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span :class="getStatusClass(payment.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatusText(payment.status) }}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">{{ payment.event_title }}</h3>
                <p class="text-sm text-gray-500 mb-3">주문번호: {{ payment.order_id }}</p>

                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span class="text-gray-500">티켓 수량</span>
                    <p class="font-medium text-gray-900">{{ payment.ticket_quantity }}매</p>
                  </div>
                  <div>
                    <span class="text-gray-500">결제 금액</span>
                    <p class="font-medium text-gray-900">{{ formatPrice(payment.total_price) }}원</p>
                  </div>
                  <div>
                    <span class="text-gray-500">구매자</span>
                    <p class="font-medium text-gray-900">{{ payment.buyer_name }}</p>
                  </div>
                  <div>
                    <span class="text-gray-500">구매일</span>
                    <p class="font-medium text-gray-900">{{ formatDate(payment.created_at) }}</p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex sm:flex-col gap-2">
                <router-link
                  :to="`/events/${payment.event_id}`"
                  class="flex-1 sm:flex-none px-4 py-2 text-sm text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  이벤트 보기
                </router-link>
                <button
                  v-if="payment.status === 'pending'"
                  @click="showCancelConfirm(payment)"
                  class="flex-1 sm:flex-none px-4 py-2 text-sm text-center border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  취소 요청
                </button>
              </div>
            </div>
          </div>

          <!-- Ticket Details (Expandable) -->
          <div class="border-t border-gray-100 bg-gray-50 px-4 sm:px-6 py-3">
            <div class="flex flex-wrap gap-4 text-sm text-gray-600">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ payment.buyer_email }}
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {{ payment.buyer_phone }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cancel Confirmation Modal -->
      <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl p-6 max-w-md w-full">
          <h3 class="text-lg font-bold text-gray-900 mb-2">티켓 취소 요청</h3>
          <p class="text-gray-600 mb-6">
            정말로 "{{ selectedPayment?.event_title }}" 티켓을 취소하시겠습니까?
            취소 후에는 되돌릴 수 없습니다.
          </p>
          <div class="flex gap-3">
            <button
              @click="showCancelModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              아니오
            </button>
            <button
              @click="cancelTicket"
              :disabled="isCancelling"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {{ isCancelling ? '처리 중...' : '취소하기' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccessToken } from '@/utils/auth'

export default {
  name: 'MyTicketsView',
  data () {
    return {
      payments: [],
      isLoading: false,
      error: null,
      showCancelModal: false,
      selectedPayment: null,
      isCancelling: false
    }
  },
  mounted () {
    this.fetchMyTickets()
  },
  methods: {
    async fetchMyTickets () {
      this.isLoading = true
      this.error = null

      try {
        const token = getAccessToken()
        if (!token) {
          this.$router.push('/login')
          return
        }

        const response = await fetch('http://localhost:3000/api/payments/my', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('티켓 정보를 불러올 수 없습니다.')
        }

        const data = await response.json()
        this.payments = data.payments || []
      } catch (error) {
        console.error('티켓 조회 실패:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    getStatusText (status) {
      const statusMap = {
        pending: '결제 대기',
        completed: '결제 완료',
        cancelled: '취소됨',
        refunded: '환불 완료'
      }
      return statusMap[status] || status
    },
    getStatusClass (status) {
      const classMap = {
        pending: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-gray-100 text-gray-800',
        refunded: 'bg-blue-100 text-blue-800'
      }
      return classMap[status] || 'bg-gray-100 text-gray-800'
    },
    formatPrice (price) {
      if (price === undefined || price === null) {
        return '0'
      }
      return price.toLocaleString('ko-KR')
    },
    formatDate (dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`
    },
    showCancelConfirm (payment) {
      this.selectedPayment = payment
      this.showCancelModal = true
    },
    async cancelTicket () {
      if (!this.selectedPayment) return

      this.isCancelling = true

      try {
        const token = getAccessToken()
        const response = await fetch(`http://localhost:3000/api/payments/${this.selectedPayment.id}/cancel`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('취소 요청에 실패했습니다.')
        }

        // 목록 새로고침
        await this.fetchMyTickets()
        this.showCancelModal = false
        this.selectedPayment = null
      } catch (error) {
        console.error('취소 요청 실패:', error)
        alert(error.message)
      } finally {
        this.isCancelling = false
      }
    }
  }
}
</script>
