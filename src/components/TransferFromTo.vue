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

    <div class="nazvanie">Перевод по номеру телефона</div>

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
      <div class="container_4">
      <form @submit.prevent="transferMoney">
        <div class="perevod">
          <label style="color: white">Номер телефона получателя</label><br>
          <input class="vvod" type="text" v-model="phoneNumber" @input="fetchRecipientName" required><br>
          <p v-if="recipientName" style="color: white">Получатель: {{ recipientName }}</p>
        </div>
        <div class="sum">
          <input placeholder="От 1 ₽ до 200 000 000 ₽" style="color: white" class="vvod_1" type="text" v-model="amount" required><br>
        </div>
        <button class="btn7" type="submit">Отправить</button>
      </form>
    </div>
  </div>
</div>
    <div class="bottom-menu">
      <ul>
        <li>BanK</li>
        <li>89170700699</li>
        <li>nzaskupin</li>
      </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import router from '@/router';

export default {
  data() {
    return {
      phoneNumber: '',
      amount: null,
      exchangeRates: {},
      recipientName: '',
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
    fetchRecipientName() {
      if (this.phoneNumber.length >= 10) {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3000/getRecipientNameByPhone/${this.phoneNumber}`, {
          headers: {
            'Authorization': token
          }
        })
        .then(response => {
          this.recipientName = response.data.name + ' ' + response.data.surname;
        })
        .catch(error => {
          console.error('Ошибка при получении имени получателя:', error);
          this.recipientName = '';
        });
      } else {
        this.recipientName = '';
      }
    },
    navigateToDashBoard() {
      this.$router.push('/dashboard');
    },
    transferFromTo() {
      router.push('/historyPerevodov');
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
    }
  },
  created() {
    if (!this.user) {
      this.$store.dispatch('fetchUser');
    }
    this.fetchExchangeRates();
  }
};
</script>

<style src="@/styles/global.css" scoped></style>
