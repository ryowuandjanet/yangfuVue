import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// 創建 auth store 實例
const authStore = useAuthStore(pinia);

// 等待檢查用戶狀態完成後再掛載應用
authStore
  .checkUser()
  .then(() => {
    app.mount('#app');
  })
  .catch((error) => {
    console.error('Failed to check user status:', error);
    // 即使檢查失敗也掛載應用
    app.mount('#app');
  });
