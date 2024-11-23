<script setup>
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const isOpen = ref(false);

const userEmail = computed(() => authStore.user?.email);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const handleLogout = async () => {
  await authStore.logout();
  isOpen.value = false;
};
</script>

<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and primary nav -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <RouterLink to="/" class="text-white font-bold text-xl">
              YangfuVue
            </RouterLink>
          </div>
          <!-- Desktop Menu -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <RouterLink
                to="/"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="bg-gray-900 text-white"
              >
                首頁
              </RouterLink>
              <RouterLink
                v-if="authStore.isAuthenticated"
                to="/profile"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                active-class="bg-gray-900 text-white"
              >
                個人資料
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- User Menu (Desktop) -->
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <template v-if="authStore.isAuthenticated">
              <!-- User Email -->
              <span class="text-gray-300 mr-4">{{ userEmail }}</span>

              <!-- Logout Button -->
              <button
                @click="handleLogout"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                :disabled="authStore.loading"
              >
                {{ authStore.loading ? '登出中...' : '登出' }}
              </button>
            </template>
            <template v-else>
              <RouterLink
                to="/login"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                登入
              </RouterLink>
              <RouterLink
                to="/register"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                註冊
              </RouterLink>
            </template>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              :class="{ hidden: isOpen, block: !isOpen }"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              :class="{ block: isOpen, hidden: !isOpen }"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div :class="{ block: isOpen, hidden: !isOpen }" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink
          to="/"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-gray-900 text-white"
          @click="isOpen = false"
        >
          首頁
        </RouterLink>
        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/profile"
          class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          active-class="bg-gray-900 text-white"
          @click="isOpen = false"
        >
          個人資料
        </RouterLink>
      </div>

      <!-- Mobile User Menu -->
      <div class="pt-4 pb-3 border-t border-gray-700">
        <template v-if="authStore.isAuthenticated">
          <div class="px-2">
            <div class="text-gray-400 px-3 py-2">
              {{ userEmail }}
            </div>
            <button
              @click="handleLogout"
              class="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? '登出中...' : '登出' }}
            </button>
          </div>
        </template>
        <template v-else>
          <div class="px-2 space-y-1">
            <RouterLink
              to="/login"
              class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="isOpen = false"
            >
              登入
            </RouterLink>
            <RouterLink
              to="/register"
              class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="isOpen = false"
            >
              註冊
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>
