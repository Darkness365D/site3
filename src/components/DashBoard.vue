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
        <button class="btn1" @click="navigateToTransfer">Перевести</button>
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
      <button @click="navigateToTransfer" class="button">Перевести</button>
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
import router from '@/router';

export default {
  data() {
    return {
      searchQuery: '',
      filteredResults: []
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
      this.$axios.post('/logout')
        .then(response => {
          console.log(response.data.message);
          router.push('/login');
        })
        .catch(error => {
          console.error('Ошибка при выходе из аккаунта', error);
        });
    },
    search() {
      if (this.searchQuery.trim() === '') {
        this.filteredResults = [];
        return;
      }

      // Ваш код поиска
    },
    navigateToTransfer() {
      router.push('/transferFromTo');
    }
  }
};
</script>

<style src="@/styles/global.css" scoped></style>
