import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Подключаем Vuex store

createApp(App)
  .use(router)
  .use(store) // Используем Vuex store
  .mount('#app');
