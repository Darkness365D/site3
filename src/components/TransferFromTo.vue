<template>
  <div class="osnovnoe" style="background-color: #3C3B3B;">
    <div class="top-menu">
      <div class="name" align="left">
        BanK
        <img src="@/assets/naz.png" align="center">
      </div>
      <nav class="menu">
        <button class="btn1" @click="navigateToDashBoard">Главная</button>
        <button class="btn1" @click="transferFromTo">Операции</button>
        <button class="btn2" @click="payments">Перевести</button>
      </nav>
      <div class="user-name" v-if="user">
        <p style="padding-right: 6%;">{{ user.name }}</p>
        <img src="@/assets/Frame 11.png" align="center">
      </div>
    </div>
    <div style="padding-top: 150px;"></div>
<div class="nazvanie">Перевести по номеру телефона</div>
<div class="container">
  <div class="search-container">
    <input type="text" v-model="searchQuery" @input="search" placeholder="Поиск...">
  </div>
  <br>
  <br>
  <div class="search-results">
      <li v-for="(result, index) in filteredResults" :key="index">
        <!-- Отобразите результаты поиска здесь -->
      </li>
  </div>

  <div class="card-form" v-if="user">
    <img src="@/assets/f7_money-rubl-circle-fill.png">
    <p style="padding-left: 50%;">{{ user.Balance }} ₽</p>
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
    <form @submit.prevent="transferMoney">
      <div class="perevod">
      <label style="color: white">Номер телефона получателя</label><br>
      <input class="vvod" type="text" v-model="phoneNumber" required><br></div>
      <div class="sum">
      <input placeholder="От 1  ₽ до 200 000 000 ₽" style="color: white" class="vvod_1" type="text" v-model="amount" required ><br></div>
      <button class="btn7" type="submit">Отправить</button>
    </form>
  </div>
<div class="bottom-menu">
<ul>
  <li>BanK</li>
  <li>nzaskupin</li>
  <li>88005553535</li>
</ul>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      phoneNumber: '',
      amount: null
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    transferMoney() {
      const token = localStorage.getItem('token');
      axios.post('http://localhost:3000/transferFromTo', {
        phoneNumber: this.phoneNumber,
        amount: this.amount
      }, {
        headers: {
          'Authorization': token
        }
      })
      .then(response => {
        alert(response.data.message); // Показать сообщение об успешном переводе
        this.$router.push('/DashBoard'); // Переход на главную страницу после успешного перевода
      })
      .catch(error => {
        console.error('Transfer error:', error);
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        }
      });
    },
    navigateToDashBoard() {
      this.$router.push('/dashboard');
    }
  },
  created() {
    if (!this.user) {
      this.$store.dispatch('fetchUser');
    }
  }
};
</script>

<style src="@/styles/global.css" scoped>
</style>
