<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const formError = ref('');

const handleSubmit = async () => {
  // 重置錯誤信息
  formError.value = '';

  // 表單驗證
  if (!email.value || !password.value || !confirmPassword.value) {
    formError.value = '請填寫所有欄位';
    return;
  }

  if (password.value !== confirmPassword.value) {
    formError.value = '密碼不匹配';
    return;
  }

  if (password.value.length < 6) {
    formError.value = '密碼長度至少為6個字符';
    return;
  }

  // 註冊
  const { error } = await authStore.register(email.value, password.value);

  if (error) {
    formError.value = error;
    return;
  }

  // 註冊成功，跳轉到登入頁面
  router.push('/login');
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          註冊帳號
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              v-model="email"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密碼</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="密碼"
            />
          </div>
          <div>
            <label for="confirm-password" class="sr-only">確認密碼</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              v-model="confirmPassword"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="確認密碼"
            />
          </div>
        </div>

        <div
          v-if="formError || authStore.error"
          class="text-red-500 text-sm text-center"
        >
          {{ formError || authStore.error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Lock Icon -->
              <svg
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ authStore.loading ? '註冊中...' : '註冊' }}
          </button>
        </div>

        <div class="text-sm text-center">
          <RouterLink
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            已有帳號？立即登入
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
