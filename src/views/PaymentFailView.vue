<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-xl p-6 sm:p-8 shadow-sm text-center">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">결제에 실패했습니다</h2>
        <p class="text-gray-600 mb-4">
          결제 처리 중 문제가 발생했습니다.
        </p>

        <div class="bg-red-50 rounded-lg p-4 mb-8 text-left">
          <h3 class="font-semibold text-red-800 mb-2">오류 정보</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-red-700">오류 코드</span>
              <span class="text-red-900 font-mono">{{ errorCode }}</span>
            </div>
            <div>
              <span class="text-red-700">오류 메시지</span>
              <p class="text-red-900 mt-1">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            @click="goBack"
            class="flex-1 border border-gray-300 text-gray-700 py-3.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 active:bg-gray-100 transition touch-manipulation"
          >
            다시 시도하기
          </button>
          <button
            @click="$router.push('/')"
            class="flex-1 bg-indigo-600 text-white py-3.5 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition touch-manipulation"
          >
            홈으로
          </button>
        </div>

        <p class="mt-6 text-sm text-gray-500">
          문제가 계속되면 고객센터로 문의해주세요.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentFailView',
  data () {
    return {
      errorCode: '',
      errorMessage: '',
      eventId: null
    }
  },
  mounted () {
    this.processPaymentFail()
  },
  methods: {
    processPaymentFail () {
      // URL 쿼리 파라미터에서 오류 정보 추출
      const query = this.$route.query
      this.errorCode = query.code || 'UNKNOWN_ERROR'
      this.errorMessage = query.message || '알 수 없는 오류가 발생했습니다.'

      // localStorage에서 이벤트 ID 가져오기
      const storedInfo = localStorage.getItem('pendingPayment')
      if (storedInfo) {
        const paymentInfo = JSON.parse(storedInfo)
        this.eventId = paymentInfo.eventId
      }

      // 결제 정보 정리
      localStorage.removeItem('pendingPayment')
    },
    goBack () {
      if (this.eventId) {
        this.$router.push(`/events/${this.eventId}/purchase`)
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>
