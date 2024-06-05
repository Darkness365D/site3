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
    <div class="container_3">
      <div class="currency-rates">
        <ul class="currency-list">
          <li v-for="(rate, currency) in filteredExchangeRates" :key="currency" class="currency-item">
            {{ currency }}: {{ rate }}
          </li>
        </ul>
      </div>
   </div>
   <div class="container">
      <div class="card-form" v-if="user">
        <img src="@/assets/f7_money-rubl-circle-fill.png">
        <p style="padding-left: 50%;">{{ user.Balance }} ₽</p>
      </div>

      <div class="conteiner1">
        <button class="btn3" @click="navigateToTransfer">
          <img src="@/assets/f7_phone-fill.png"><P></P>
          Перевести по<p></p> номеру<p></p> телефона
        </button>
        <button class="btn5" @click="navigateToKarta">
          <img src="@/assets/ion_card.png"><P></P>
          Перевести по<p></p> номеру<p></p> карты
        </button>
        <button class="btn6" @click="transferFromTo">
          <img src="@/assets/entypo_back-in-time.png"><p></p>
          <p></p>
          <br>
          История <p></p>переводов
        </button>
      </div>
      <div class="reclama">
        <img src="@/assets/reclama2.png">
      </div>
    </div>
  </div>
  <div class="bottom-menu"> 
    <ul> 
      <li>BanK</li>
      <li>89170700699</li>
      <li>nzaskupin@gmail.com</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import router from '@/router';

export default {
  data() {
    return {
      exchangeRates: {},
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
    },
    filteredExchangeRates() {
      const relevantCurrencies = ['USD', 'EUR', 'RUB'];
      let filteredRates = {};
      for (let currency of relevantCurrencies) {
        if (this.exchangeRates[currency]) {
          filteredRates[currency] = this.exchangeRates[currency];
        }
      }
      return filteredRates;
    }
  },
  created() {
    this.$store.dispatch('fetchUser');
    this.fetchExchangeRates();
  },
  methods: {
    logout() {
      this.$axios.post('/logout')
        .then(response => {
          console.log(response.data.message);
          this.$store.dispatch('logout');
          localStorage.removeItem('token');
          router.push('/login');
        })
        .catch(error => {
          console.error('Ошибка при выходе из аккаунта', error);
        });
    },
    fetchExchangeRates() {
      const apiKey = '963e1939cabb02f351541ab7'; // Замените на ваш ключ API
      const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

      axios.get(apiUrl)
        .then(response => {
          this.exchangeRates = response.data.conversion_rates;
        })
        .catch(error => {
          console.error('Ошибка при получении курсов валют', error);
        });
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
