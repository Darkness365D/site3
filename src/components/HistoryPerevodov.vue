<template>
  <div>
    <h1>История транзакций</h1>
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Сумма</th>
          <th>Отправитель</th>
          <th>Получатель</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ formatDate(transaction.dateSanding) }}</td>
          <td>{{ transaction.transferAmount }}</td>
          <td>{{ transaction.senderName }}</td>
          <td>{{ transaction.recipientName }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  data() {
    return {
      transactions: []
    };
  },
  created() {
    this.fetchTransactions();
  },
  methods: {
    async fetchTransactions() {
      try {
        const token = localStorage.getItem('token'); // Предполагается, что токен хранится в localStorage
        const response = await axios.get('http://localhost:3000/transactionHistory', {
          headers: {
            'Authorization': token
          }
        });
        this.transactions = response.data;
      } catch (error) {
        console.error('Ошибка при получении истории транзакций:', error);
      }
    },
    formatDate(date) {
      return moment(date).format('HH:mm DD.MM.YYYY');
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}
</style>
