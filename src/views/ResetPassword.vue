<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const newPassword = ref('');
const confirmPassword = ref('');
const formError = ref('');

const handleSubmit = async () => {
  formError.value = '';

  if (!newPassword.value || !confirmPassword.value) {
    formError.value = '請填寫所有欄位';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    formError.value = '密碼不匹配';
    return;
  }

  if (newPassword.value.length < 6) {
    formError.value = '密碼長度至少為6個字符';
    return;
  }

  const { error } = await authStore.updatePassword(newPassword.value);

  if (error) {
    formError.value = error;
    return;
  }

  notificationStore.showNotification('密碼已成功重置', 'success');
  router.push('/login');
};
</script>

<template>
  <div
    class="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          重置密碼
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">請輸入您的新密碼</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="new-password" class="sr-only">新密碼</label>
            <input
              id="new-password"
              name="new-password"
              type="password"
              required
              v-model="newPassword"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="新密碼"
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
            {{ authStore.loading ? '重置中...' : '重置密碼' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
