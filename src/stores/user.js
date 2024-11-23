import { defineStore } from 'pinia';
import { supabase } from '../supabase';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async signUp(email, password) {
      try {
        this.loading = true;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        this.user = data.user;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async signIn(email, password) {
      try {
        this.loading = true;
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        this.user = data.user;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        this.user = null;
      } catch (error) {
        this.error = error.message;
      }
    },
  },
});
