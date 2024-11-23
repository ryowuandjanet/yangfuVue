<script setup>
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth';
import Navbar from './components/Navbar.vue';
import Notification from './components/Notification.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <main class="container mx-auto px-4 py-6">
      <RouterView />
    </main>
    <Notification />
  </div>
</template>
