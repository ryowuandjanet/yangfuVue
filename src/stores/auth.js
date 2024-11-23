import { defineStore } from 'pinia';
import { supabase } from '../supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async checkUser() {
      try {
        this.loading = true;
        // 檢查當前會話
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          this.user = session.user;
        }

        // 監聽認證狀態變化
        supabase.auth.onAuthStateChange((event, session) => {
          this.user = session?.user || null;
        });
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      try {
        this.loading = true;
        this.error = null;

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        this.user = data.user;
        return { data, error: null };
      } catch (error) {
        this.error = error.message;
        return { data: null, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    async register(email, password) {
      try {
        this.loading = true;
        this.error = null;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        return { data, error: null };
      } catch (error) {
        this.error = error.message;
        return { data: null, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        this.loading = true;
        this.error = null;

        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        this.user = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
