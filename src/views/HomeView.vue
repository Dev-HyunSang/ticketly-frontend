<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-indigo-50 to-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            다가오는 이벤트를 발견하세요
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            컨퍼런스, 밋업, 워크샵 등 다양한 이벤트가 여러분을 기다립니다
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="flex gap-2">
              <div class="flex-1 relative">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="이벤트 검색..."
                  class="w-full px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-indigo-600 focus:outline-none"
                >
                <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button class="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition">
                검색
              </button>
            </div>
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-6 py-2 rounded-full font-medium transition',
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Events Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">인기 이벤트</h2>
          <button class="text-indigo-600 font-semibold hover:text-indigo-700">
            전체보기 →
          </button>
        </div>

        <!-- Event Cards Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="event in featuredEvents"
            :key="event.id"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          >
            <!-- Event Image -->
            <div class="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100">
              <img
                v-if="event.image"
                :src="event.image"
                :alt="event.title"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div class="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-indigo-600">
                {{ event.category }}
              </div>
            </div>

            <!-- Event Info -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ event.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ event.description }}</p>

              <!-- Event Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(event.date) }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ event.location }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {{ event.attendees }}명 참가
                </div>
              </div>

              <!-- Price and CTA -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span v-if="event.price === 0" class="text-2xl font-bold text-gray-900">무료</span>
                  <div v-else>
                    <span class="text-2xl font-bold text-gray-900">{{ formatPrice(event.price) }}</span>
                    <span class="text-gray-600 text-sm">원</span>
                  </div>
                </div>
                <button class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
                  예매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Events Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">다가오는 이벤트</h2>
          <button class="text-indigo-600 font-semibold hover:text-indigo-700">
            전체보기 →
          </button>
        </div>

        <!-- Event List -->
        <div class="space-y-4">
          <div
            v-for="event in upcomingEvents"
            :key="event.id"
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
                  <div class="text-right">
                    <span v-if="event.price === 0" class="text-xl font-bold text-gray-900">무료</span>
                    <div v-else>
                      <span class="text-xl font-bold text-gray-900">{{ formatPrice(event.price) }}</span>
                      <span class="text-gray-600 text-sm">원</span>
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
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">이용 방법</h2>
          <p class="text-xl text-gray-600">
            간단한 3단계로 이벤트 참가하기
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">이벤트 찾기</h3>
            <p class="text-gray-600">
              관심있는 이벤트를 검색하고 상세 정보를 확인하세요
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">티켓 구매</h3>
            <p class="text-gray-600">
              원하는 티켓을 선택하고 안전하게 결제하세요
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">이벤트 참가</h3>
            <p class="text-gray-600">
              QR 코드로 간편하게 체크인하고 이벤트를 즐기세요
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-indigo-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          나만의 이벤트를 만들어보세요
        </h2>
        <p class="text-xl text-indigo-100 mb-8">
          5분 안에 이벤트 페이지를 만들고 티켓 판매를 시작하세요
        </p>
        <button class="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
          무료로 시작하기
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data () {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      categories: [
        { id: 'all', name: '전체' },
        { id: 'conference', name: '컨퍼런스' },
        { id: 'meetup', name: '밋업' },
        { id: 'workshop', name: '워크샵' },
        { id: 'seminar', name: '세미나' },
        { id: 'networking', name: '네트워킹' }
      ],
      // 임시 데이터 - 나중에 API로 교체
      featuredEvents: [
        {
          id: 1,
          title: 'Vue.js 컨퍼런스 2024',
          description: 'Vue.js 생태계의 최신 트렌드와 베스트 프랙티스를 배우는 컨퍼런스',
          category: '컨퍼런스',
          date: '2024-12-15',
          location: '서울 코엑스',
          attendees: 250,
          price: 50000,
          image: null
        },
        {
          id: 2,
          title: '스타트업 네트워킹 데이',
          description: '스타트업 종사자들과 네트워킹하고 인사이트를 나누는 시간',
          category: '네트워킹',
          date: '2024-12-20',
          location: '강남역 D2 팩토리',
          attendees: 100,
          price: 0,
          image: null
        },
        {
          id: 3,
          title: 'AI/ML 워크샵',
          description: '실전 머신러닝 프로젝트를 통해 배우는 AI 기초',
          category: '워크샵',
          date: '2024-12-18',
          location: '판교 스타트업캠퍼스',
          attendees: 50,
          price: 80000,
          image: null
        }
      ],
      upcomingEvents: [
        {
          id: 4,
          title: 'UX/UI 디자인 세미나',
          description: '사용자 경험을 개선하는 디자인 원칙과 실무 적용 방법',
          category: '세미나',
          date: '2024-12-22',
          location: '홍대 WeWork',
          attendees: 80,
          price: 30000,
          image: null
        },
        {
          id: 5,
          title: '개발자 커리어 밋업',
          description: '시니어 개발자들과 함께하는 커리어 성장 전략',
          category: '밋업',
          date: '2024-12-25',
          location: '선릉역 패스트파이브',
          attendees: 60,
          price: 0,
          image: null
        },
        {
          id: 6,
          title: '블록체인 기술 컨퍼런스',
          description: '최신 블록체인 기술과 실제 활용 사례',
          category: '컨퍼런스',
          date: '2024-12-28',
          location: '서울 63빌딩',
          attendees: 200,
          price: 100000,
          image: null
        }
      ]
    }
  },
  methods: {
    formatDate (dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}.${month}.${day}`
    },
    formatPrice (price) {
      return price.toLocaleString('ko-KR')
    }
  }
  // API 연동을 위한 예시 (나중에 사용)
  // mounted() {
  //   this.fetchFeaturedEvents()
  //   this.fetchUpcomingEvents()
  // },
  // methods: {
  //   async fetchFeaturedEvents() {
  //     try {
  //       const response = await fetch('YOUR_API_URL/events/featured')
  //       this.featuredEvents = await response.json()
  //     } catch (error) {
  //       console.error('Failed to fetch featured events:', error)
  //     }
  //   },
  //   async fetchUpcomingEvents() {
  //     try {
  //       const response = await fetch('YOUR_API_URL/events/upcoming')
  //       this.upcomingEvents = await response.json()
  //     } catch (error) {
  //       console.error('Failed to fetch upcoming events:', error)
  //     }
  //   }
  // }
}
</script>
