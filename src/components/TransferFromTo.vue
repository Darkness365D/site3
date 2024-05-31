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
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <h2>Перевод средств</h2>
    <form @submit.prevent="transferMoney">
      <label>Номер телефона получателя:</label><br>
      <input type="text" v-model="phoneNumber" required><br>
      <label>Сумма:</label><br>
      <input type="text" v-model="amount" required><br>
      <button type="submit">Отправить</button>
    </form>
  </div>
  <div class="bottom-menu">
    <p></p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      phoneNumber: '',
      amount: 0
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
