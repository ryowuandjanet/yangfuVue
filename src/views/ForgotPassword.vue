<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const email = ref('');
const formError = ref('');
const isSubmitted = ref(false);

const handleSubmit = async () => {
  formError.value = '';

  if (!email.value) {
    formError.value = '請輸入電子郵件';
    return;
  }

  const { error } = await authStore.resetPassword(email.value);

  if (error) {
    formError.value = error;
    return;
  }

  isSubmitted.value = true;
  notificationStore.showNotification('重置密碼連結已發送到您的郵箱', 'success');
};
</script>

<template>
  <div
    class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          忘記密碼
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          請輸入您的電子郵件地址，我們將發送重置密碼的連結給您。
        </p>
      </div>

      <!-- 提交成功顯示 -->
      <div v-if="isSubmitted" class="bg-green-50 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">郵件已發送</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>請檢查您的郵箱，點擊郵件中的連結重置密碼。</p>
            </div>
            <div class="mt-4">
              <RouterLink
                to="/login"
                class="text-sm font-medium text-green-600 hover:text-green-500"
              >
                返回登入頁面 &rarr;
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 重置密碼表單 -->
      <form v-else class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">電子郵件</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              v-model="email"
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="電子郵件"
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
              <svg
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ authStore.loading ? '發送中...' : '發送重置連結' }}
          </button>
        </div>

        <div class="text-sm text-center">
          <RouterLink
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            返回登入
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
