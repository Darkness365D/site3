import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Подключаем Vuex store
import axios from 'axios';

const app = createApp(App);

axios.defaults.baseURL = 'http://localhost:3000'; 
// Настройка Axios
app.config.globalProperties.$axios = axios;

app.use(router)
  .use(store) // Используем Vuex store
  .mount('#app');
