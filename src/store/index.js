import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    fetchUser({ commit }) {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:3000/me', {
        headers: {
          'Authorization': token
        }
      })
      .then(response => {
        commit('setUser', response.data);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        } else if (error.response && error.response.status === 404) {
          console.error('User not found');
        }
      });
    }
  },
  getters: {
    user: state => state.user
  }
});
