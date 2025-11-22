// JWT 토큰 관련 유틸리티 함수

// 토큰 자동 갱신 인터벌 ID
let refreshIntervalId = null

// 토큰 갱신 주기 (15분 = 900000ms)
const REFRESH_INTERVAL = 15 * 60 * 1000

/**
 * 로컬 스토리지에서 액세스 토큰 가져오기
 */
export function getAccessToken () {
  return localStorage.getItem('access_token')
}

/**
 * 로컬 스토리지에서 리프레시 토큰 가져오기
 */
export function getRefreshToken () {
  return localStorage.getItem('refresh_token')
}

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 */
export function getUser () {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * 로그인 여부 확인
 */
export function isAuthenticated () {
  return !!getAccessToken()
}

/**
 * 토큰 및 사용자 정보 저장
 */
export function setAuthData (accessToken, refreshToken, user) {
  if (accessToken) {
    localStorage.setItem('access_token', accessToken)
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken)
  }
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

/**
 * 로그아웃 - 모든 인증 정보 삭제
 */
export function logout () {
  // 토큰 자동 갱신 중지 (순환 참조 방지를 위해 직접 처리)
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = null
  }

  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  localStorage.removeItem('rememberMe')
}

/**
 * 리프레시 토큰으로 액세스 토큰 갱신
 */
export async function refreshAccessToken () {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다')
  }

  try {
    const response = await fetch('http://localhost:3000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      throw new Error('토큰 갱신 실패')
    }

    const data = await response.json()

    // 새로운 토큰 저장
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token)
    }

    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token)
    }

    return data
  } catch (error) {
    // 리프레시 실패 시 로그아웃 처리
    logout()
    throw error
  }
}

/**
 * 인증이 필요한 API 요청 (자동 토큰 갱신 포함)
 */
export async function authFetch (url, options = {}) {
  let accessToken = getAccessToken()

  if (!accessToken) {
    throw new Error('로그인이 필요합니다')
  }

  // 첫 번째 요청
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`
    }
  })

  // 401 에러 (인증 실패) 시 토큰 갱신 후 재시도
  if (response.status === 401) {
    try {
      await refreshAccessToken()
      accessToken = getAccessToken()

      // 갱신된 토큰으로 재요청
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`
        }
      })

      return retryResponse
    } catch (error) {
      // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
      window.location.href = '/login'
      throw error
    }
  }

  return response
}

/**
 * 토큰 자동 갱신 시작 (15분마다)
 */
export function startTokenRefresh () {
  // 이미 실행 중이면 중복 실행 방지
  if (refreshIntervalId) {
    return
  }

  // 로그인 상태가 아니면 시작하지 않음
  if (!isAuthenticated()) {
    return
  }

  console.log('토큰 자동 갱신 시작 (15분 주기)')

  refreshIntervalId = setInterval(async () => {
    try {
      if (isAuthenticated()) {
        console.log('토큰 자동 갱신 중...')
        await refreshAccessToken()
        console.log('토큰 갱신 완료')
      } else {
        // 로그아웃 상태면 자동 갱신 중지
        stopTokenRefresh()
      }
    } catch (error) {
      console.error('토큰 자동 갱신 실패:', error)
      stopTokenRefresh()
    }
  }, REFRESH_INTERVAL)
}

/**
 * 토큰 자동 갱신 중지
 */
export function stopTokenRefresh () {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = null
    console.log('토큰 자동 갱신 중지')
  }
}

/**
 * 앱 초기화 시 토큰 상태 확인 및 자동 갱신 설정
 */
export async function initAuth () {
  if (isAuthenticated()) {
    try {
      // 앱 시작 시 토큰 즉시 갱신 시도
      await refreshAccessToken()
      // 자동 갱신 시작
      startTokenRefresh()
    } catch (error) {
      console.error('초기 토큰 갱신 실패:', error)
      // 갱신 실패 시 로그아웃
      logout()
    }
  }
}
