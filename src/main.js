import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/main.css'
import { initAuth } from './utils/auth'

// 앱 초기화 시 토큰 자동 갱신 설정
initAuth()

createApp(App).use(router).mount('#app')
