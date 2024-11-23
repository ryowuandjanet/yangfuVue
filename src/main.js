import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// 確保在 DOM 完全加載後再掛載應用
window.addEventListener('load', () => {
  app.mount('#app');
});
