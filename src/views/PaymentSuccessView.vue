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

      <!-- Success State -->
      <div v-else class="bg-white rounded-xl p-6 sm:p-8 shadow-sm text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다!</h2>
        <p class="text-gray-600 mb-8">
          티켓이 등록하신 이메일({{ paymentInfo.buyerEmail }})로 전송됩니다.
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
              <span class="text-gray-900">{{ paymentInfo.eventTitle }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">티켓 수량</span>
              <span class="text-gray-900">{{ paymentInfo.ticketQuantity }}매</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">결제 금액</span>
              <span class="text-gray-900 font-semibold">{{ formatPrice(amount) }}원</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">결제 수단</span>
              <span class="text-gray-900">{{ paymentType }}</span>
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
export default {
  name: 'PaymentSuccessView',
  data () {
    return {
      isLoading: true,
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
      }
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

        // localStorage에서 결제 정보 가져오기
        const storedInfo = localStorage.getItem('pendingPayment')
        if (storedInfo) {
          this.paymentInfo = JSON.parse(storedInfo)
        }

        // 실제로는 여기서 백엔드 API를 호출하여 결제 승인 처리를 해야 합니다
        // const response = await fetch('http://localhost:3000/api/payments/confirm', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     paymentKey: query.paymentKey,
        //     orderId: query.orderId,
        //     amount: query.amount
        //   })
        // })

        // 결제 정보 정리
        localStorage.removeItem('pendingPayment')
      } catch (error) {
        console.error('결제 확인 실패:', error)
      } finally {
        this.isLoading = false
      }
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
