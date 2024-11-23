import { defineStore } from 'pinia';
import { supabase } from '../supabase';

// 錯誤訊息對照表
const errorMessages = {
  'Invalid login credentials': '登入憑證無效',
  'Email not confirmed': '電子郵件尚未驗證',
  'Invalid email': '無效的電子郵件格式',
  'User already registered': '該電子郵件已被註冊',
  'Password should be at least 6 characters': '密碼長度至少為6個字符',
  // 可以添加更多錯誤訊息對照
};

// 轉換錯誤訊息的輔助函數
const translateError = (error) => {
  return errorMessages[error] || error;
};

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
        const translatedError = translateError(error.message);
        this.error = translatedError;
        return { data: null, error: translatedError };
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
        const translatedError = translateError(error.message);
        this.error = translatedError;
        return { data: null, error: translatedError };
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

    async resetPassword(email) {
      try {
        this.loading = true;
        this.error = null;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) throw error;

        return { error: null };
      } catch (error) {
        const translatedError = translateError(error.message);
        this.error = translatedError;
        return { error: translatedError };
      } finally {
        this.loading = false;
      }
    },

    async updatePassword(newPassword) {
      try {
        this.loading = true;
        this.error = null;

        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;

        return { error: null };
      } catch (error) {
        this.error = error.message;
        return { error: error.message };
      } finally {
        this.loading = false;
      }
    },
  },
});
