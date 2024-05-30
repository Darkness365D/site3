<template>
  <div class="osnovnoe" style="background-color: #3C3B3B;">
    <div class="top-menu">
      <div class="name" align="left">
        BanK
        <img src="@/assets/naz.png" align="center">
      </div>
      <nav class="menu">
        <button class="btn2" @click="DashBoard">Главная</button>
        <button class="btn1" @click="transferFromTo">Операции</button>
        <button class="btn1" @click="payments">Платежи</button>
      </nav>
      <div class="user-name" v-if="user">
        <p style="padding-right: 6%;">{{ user.name }}</p>
        <img src="@/assets/Frame 11.png" align="center">
      </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div class="text" style="padding-left: 5%" v-if="user">
      {{ greeting }} {{ user.name }}
    </div>

    <div class="container">
  <div class="search-container">
    <input type="text" v-model="searchQuery" @input="search" placeholder="Поиск...">
  </div>
  <br>
  <br>
  <div class="search-results">
    <ul>
      <li v-for="(result, index) in filteredResults" :key="index">
        <!-- Отобразите результаты поиска здесь -->
      </li>
    </ul>
  </div>

  <div class="card-form" v-if="user">
    <img src="@/assets/f7_money-rubl-circle-fill.png">
    <p style="padding-left: 50%;">{{ user.Balance }} ₽</p>
  </div>
  <router-link to="/transferFromTo" class="button">Перевести</router-link>
  <button @click="logout" class="logout-button">Выход</button>

  <button class="btn3" @click="DashBoard">Главная</button>
</div>

    <div class="bottom-menu">
      <p></p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import router from '@/router'; // Подставьте свой роутер, если он не такой

export default {
  data() {
    return {
      searchQuery: '', // Добавляем переменную для хранения запроса поиска
      filteredResults: [] // Добавляем массив для хранения отфильтрованных результатов
    };
  },
  computed: {
    ...mapGetters(['user']),
    greeting() {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Доброе утро,';
      } else if (currentHour < 18) {
        return 'Добрый день,';
      } else {
        return 'Добрый вечер,';
      }
    }
  },
  created() {
    this.$store.dispatch('fetchUser');
  },
  methods: {
    logout() {
      // Вызываем API для выхода из аккаунта
      this.$axios.post('/logout')
        .then(response => {
          console.log(response.data.message); // Логируем сообщение (опционально)
          // Переходим на страницу входа (login)
          router.push('/login');
        })
        .catch(error => {
          console.error('Ошибка при выходе из аккаунта', error);
        });
    },
    search() {
      // Логика поиска
      if (this.searchQuery.trim() === '') {
        this.filteredResults = [];
        return;
      }

      // Ваш код поиска (например, фильтрация данных или отправка запроса на сервер)
      // Здесь можно использовать this.searchQuery для передачи запроса поиска

      // Пример:
      // this.filteredResults = this.data.filter(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  }
};

</script>


<style src="@/styles/global.css" scoped>
</style>
