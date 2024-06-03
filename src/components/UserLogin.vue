<template>
  <div class="fon" style="background-color: #3C3B3B;" >
    <div class="name_1" align="left">
        BanK
        <img src="@/assets/naz2.png" align="center">
      </div>
      <div style="padding-bottom: 30%;">
        <div class="registration-form">
          <h1>Login</h1>
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="phoneNumber">Phone Number:</label>
              <input type="text" v-model="phoneNumber" id="phoneNumber" required>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" v-model="password" id="password" required>
            </div>
            <button class="button" type="submit">Войти</button>
            <button class="button" @click="ToRegistration">Зарегестрироваться</button>
          </form>
          <p class="error" v-if="error">{{ error }}</p>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';

export default {
  data() {
    return {
      phoneNumber: '',
      password: '',
      error: null
    };
  },
  methods: {
    login() {
      axios.post('http://localhost:3000/login', {
        phoneNumber: this.phoneNumber,
        password: this.password
      })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        this.$router.push('/dashboard');
      })
      .catch(error => {
        console.error('Error during login:', error);
        this.error = 'Invalid phone number or password';
      });
    },
    
    ToRegistration() {
      router.push('/');
    },
  }
};
</script>
<style src="@/styles/global.css" scoped>
</style>