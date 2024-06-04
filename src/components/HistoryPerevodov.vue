<template>
  <div class="history-container">
    <h2>История операций</h2>

    <ul class="operations-list">
      <li v-for="operation in history" :key="operation.id">
        <div class="operation-item">
          <p class="operation-date">{{ operation.dateSanding }}</p>
          <p class="operation-amount">{{ operation.transferAmount }} ₽</p>
          <p class="operation-recipient">{{ operation.recipientId }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      history: [],
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    fetchHistory() {
      axios.get('/transferHistory')
        .then(response => {
          this.history = response.data.transfers;
        })
        .catch(error => {
          console.error('Ошибка при получении истории операций:', error);
        });
    },
  },
};
</script>

<style scoped>
.history-container {
  padding: 20px;
}

.operations-list {
  list-style: none;
  padding: 0;
}

.operation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

.operation-date {
  font-weight: bold;
}

.operation-amount {
  color: #333;
}

.operation-recipient {
  font-style: italic;
}
</style>
