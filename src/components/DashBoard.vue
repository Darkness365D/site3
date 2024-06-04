<template>
  <div class="osnovnoe">
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
    <div style="padding-top: 150px;"></div>
    <div class="text" style="padding-left: 5%" v-if="user">
      {{ greeting }} {{ user.name }}
    </div>
    <div>
      <button @click="logout" class="logout-button">✖</button>
    </div>
    <div class="container">
      <div class="search-container">
        <input type="text" v-model="searchQuery" @input="search" placeholder="Поиск...">
      </div>
      <br><br>
      <div class="search-results">
        <li v-for="(result, index) in filteredResults" :key="index">
          <!-- Отобразите результаты поиска здесь -->
        </li>
      </div>

      <div class="card-form" v-if="user">
        <img src="@/assets/f7_money-rubl-circle-fill.png">
        <p style="padding-left: 50%;">{{ user.Balance }} ₽</p>
      </div>

      <div class="conteiner1">
        <button class="btn3" @click="navigateToTransfer">
      <img src="@/assets/f7_phone-fill.png"><P></P>
      Перевести по<p></p> номеру<p></p> телефона</button>
  
    <button class="btn5" @click="navigateToKarta">
      <img src="@/assets/ion_card.png"><P></P>
      Перевести по<p></p> номеру<p></p>
  карты</button>
  
    <button class="btn6" @click="transferFromTo">
      <img src="@/assets/entypo_back-in-time.png"><p></p>
      <p></p>
      <br>
      История <p></p>переводов</button>
  </div>
      <div class="reclama">
    <img src="@/assets/reclama2.png">
      </div>
    </div>
  </div>
  <div class="bottom-menu">
  <ul>
    <li>BanK</li>
    <li>nzaskupin</li>
    <li>89170700699</li>
  </ul>
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
          this.$store.dispatch('logout'); // Обновляем состояние Vuex
          localStorage.removeItem('token'); // Удаляем токен из локального хранилища
          router.push('/login'); // Перенаправляем на страницу входа
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
    },
    navigateToTransfer() {
      router.push('/transferFromTo');
    },
    navigateToKarta() {
      router.push('/transferPoKarte');
    },
    DashBoard() {
      router.push('/dashboard');
    },
    transferFromTo() {
      router.push('/historyPerevodov');
    }
  }
};
</script>

<style>
  html { 
    background: #3C3B3B no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
</style>

<style src="@/styles/global.css" scoped></style>
  