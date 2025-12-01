<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-gray-600">결제 정보를 확인하는 중...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl p-6 sm:p-8 shadow-sm text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">결제 처리 중 오류가 발생했습니다</h2>
        <p class="text-gray-600 mb-8">{{ error }}</p>
        <button
          @click="$router.push('/')"
          class="bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          홈으로 돌아가기
        </button>
      </div>

      <!-- Success State -->
      <div v-else class="bg-white rounded-xl p-6 sm:p-8 shadow-sm text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h2>
        <p class="text-gray-600 mb-8">
          티켓이 등록하신 이메일({{ displayEmail }})로 전송됩니다.
        </p>

        <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 class="font-semibold text-gray-900 mb-4">결제 정보</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">주문번호</span>
              <span class="text-gray-900 font-mono">{{ orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">이벤트</span>
              <span class="text-gray-900">{{ displayEventTitle }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">티켓 수량</span>
              <span class="text-gray-900">{{ displayTicketQuantity }}매</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">결제 금액</span>
              <span class="text-gray-900 font-semibold">{{ formatPrice(amount) }}원</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">결제 상태</span>
              <span class="text-gray-900">{{ displayStatus }}</span>
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
</template>

<script>
import { getAccessToken } from '@/utils/auth'

export default {
  name: 'PaymentSuccessView',
  data () {
    return {
      isLoading: true,
      error: null,
      orderId: '',
      amount: 0,
      paymentType: '',
      paymentInfo: {
        eventId: '',
        eventTitle: '',
        ticketQuantity: 1,
        totalPrice: 0,
        buyerName: '',
        buyerEmail: '',
        buyerPhone: ''
      },
      paymentResult: null
    }
  },
  computed: {
    displayEmail () {
      return this.paymentResult?.buyer_email || this.paymentInfo.buyerEmail || ''
    },
    displayEventTitle () {
      return this.paymentResult?.event_title || this.paymentInfo.eventTitle || ''
    },
    displayTicketQuantity () {
      return this.paymentResult?.ticket_quantity || this.paymentInfo.ticketQuantity || 0
    },
    displayStatus () {
      const statusMap = {
        pending: '결제 대기',
        completed: '결제 완료',
        cancelled: '결제 취소',
        refunded: '환불 완료'
      }
      return statusMap[this.paymentResult?.status] || '결제 완료'
    }
  },
  mounted () {
    this.processPaymentSuccess()
  },
  methods: {
    async processPaymentSuccess () {
      try {
        // URL 쿼리 파라미터에서 결제 정보 추출
        const query = this.$route.query
        this.orderId = query.orderId || ''
        this.amount = parseInt(query.amount) || 0
        this.paymentType = this.getPaymentTypeName(query.paymentType)
        const paymentKey = query.paymentKey || ''

        // 서버에 결제 완료 요청
        const result = await this.completePayment(this.orderId, paymentKey)
        this.paymentResult = result.payment

        // 서버 응답으로 화면 정보 업데이트
        if (this.paymentResult) {
          this.orderId = this.paymentResult.order_id
          this.amount = this.paymentResult.total_price
        }

        // 결제 정보 정리
        localStorage.removeItem('pendingPayment')
      } catch (error) {
        console.error('결제 확인 실패:', error)
        this.error = error.message || '결제 처리 중 오류가 발생했습니다.'
      } finally {
        this.isLoading = false
      }
    },
    async completePayment (orderId, paymentKey) {
      // 토큰 가져오기
      const token = getAccessToken()
      if (!token) {
        throw new Error('로그인이 필요합니다.')
      }

      // 결제 정보가 없는 경우
      if (!orderId || !paymentKey) {
        throw new Error('결제 정보를 찾을 수 없습니다.')
      }

      const response = await fetch('http://localhost:3000/api/payments/complete', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          payment_key: paymentKey
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || '결제 완료 처리에 실패했습니다.')
      }

      return response.json()
    },
    getPaymentTypeName (type) {
      const typeMap = {
        CARD: '신용/체크카드',
        VIRTUAL_ACCOUNT: '가상계좌',
        EASY_PAY: '간편결제',
        TRANSFER: '계좌이체',
        MOBILE: '휴대폰'
      }
      return typeMap[type] || type || '카드'
    },
    formatPrice (price) {
      if (price === undefined || price === null) {
        return '0'
      }
      return price.toLocaleString('ko-KR')
    }
  }
}
</script>
