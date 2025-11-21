import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Ticketly - 이벤트 티켓 예매' }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: { title: 'About - Ticketly' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    meta: { title: '로그인 - Ticketly' }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import(/* webpackChunkName: "signup" */ '../views/SignupView.vue'),
    meta: { title: '회원가입 - Ticketly' }
  },
  {
    path: '/my-profile',
    name: 'my-profile',
    component: () => import(/* webpackChunkName: "my-profile" */ '../views/MyProfileView.vue'),
    meta: { title: '내 정보 - Ticketly' }
  },
  {
    path: '/events',
    name: 'events',
    component: () => import(/* webpackChunkName: "events" */ '../views/EventsListView.vue'),
    meta: { title: '등록된 이벤트 - Ticketly' }
  },
  {
    path: '/events/:id',
    name: 'event-detail',
    component: () => import(/* webpackChunkName: "event-detail" */ '../views/EventDetailView.vue'),
    meta: { title: '이벤트 상세 - Ticketly' }
  },
  {
    path: '/events/:id/purchase',
    name: 'ticket-purchase',
    component: () => import(/* webpackChunkName: "ticket-purchase" */ '../views/TicketPurchaseView.vue'),
    meta: { title: '티켓 예매 - Ticketly' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    // 뒤로가기/앞으로가기 시 이전 스크롤 위치로 복원
    if (savedPosition) {
      return savedPosition
    }
    // 새로운 페이지로 이동 시 항상 페이지 최상단으로
    return { top: 0, behavior: 'smooth' }
  }
})

// 페이지 타이틀 업데이트
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Ticketly'
  next()
})

export default router
