import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    message: '',
    type: 'info', // 'info', 'success', 'error'
    show: false,
  }),

  actions: {
    showNotification(message, type = 'info') {
      this.message = message;
      this.type = type;
      this.show = true;

      setTimeout(() => {
        this.show = false;
      }, 3000);
    },
  },
});
