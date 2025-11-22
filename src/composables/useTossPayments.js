import { loadTossPayments } from '@tosspayments/payment-sdk'

// 테스트 클라이언트 키 (실제 서비스에서는 환경변수로 관리)
const CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

let tossPaymentsInstance = null

export async function useTossPayments () {
  if (!tossPaymentsInstance) {
    tossPaymentsInstance = await loadTossPayments(CLIENT_KEY)
  }
  return tossPaymentsInstance
}

/**
 * 고유한 주문 ID 생성
 */
export function generateOrderId () {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 11)
  return `ORDER_${timestamp}_${random}`
}

/**
 * 카드 결제 요청
 * @param {Object} options - 결제 옵션
 * @param {number} options.amount - 결제 금액
 * @param {string} options.orderId - 주문 ID
 * @param {string} options.orderName - 주문명
 * @param {string} options.customerName - 고객명
 * @param {string} options.customerEmail - 고객 이메일
 */
export async function requestCardPayment (options) {
  const tossPayments = await useTossPayments()
  const baseUrl = window.location.origin

  return tossPayments.requestPayment('카드', {
    amount: options.amount,
    orderId: options.orderId,
    orderName: options.orderName,
    customerName: options.customerName,
    customerEmail: options.customerEmail,
    successUrl: `${baseUrl}/payment/success`,
    failUrl: `${baseUrl}/payment/fail`
  })
}

/**
 * 가상계좌 결제 요청
 * @param {Object} options - 결제 옵션
 */
export async function requestVirtualAccountPayment (options) {
  const tossPayments = await useTossPayments()
  const baseUrl = window.location.origin

  return tossPayments.requestPayment('가상계좌', {
    amount: options.amount,
    orderId: options.orderId,
    orderName: options.orderName,
    customerName: options.customerName,
    customerEmail: options.customerEmail,
    successUrl: `${baseUrl}/payment/success`,
    failUrl: `${baseUrl}/payment/fail`,
    validHours: 24, // 입금 유효 시간 (24시간)
    cashReceipt: {
      type: '소득공제'
    }
  })
}

/**
 * 간편결제 요청
 * @param {Object} options - 결제 옵션
 */
export async function requestEasyPayment (options) {
  const tossPayments = await useTossPayments()
  const baseUrl = window.location.origin

  return tossPayments.requestPayment('간편결제', {
    amount: options.amount,
    orderId: options.orderId,
    orderName: options.orderName,
    customerName: options.customerName,
    customerEmail: options.customerEmail,
    successUrl: `${baseUrl}/payment/success`,
    failUrl: `${baseUrl}/payment/fail`
  })
}

export default {
  useTossPayments,
  generateOrderId,
  requestCardPayment,
  requestVirtualAccountPayment,
  requestEasyPayment
}
