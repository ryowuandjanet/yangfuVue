<script setup>
import { ref, onMounted } from 'vue';
import { useTodoStore } from '../stores/todo';
import { useAuthStore } from '../stores/auth';

const todoStore = useTodoStore();
const authStore = useAuthStore();
const newTodoTitle = ref('');

onMounted(() => {
  if (authStore.isAuthenticated) {
    todoStore.fetchTodos();
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- 歡迎區塊 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        {{
          authStore.isAuthenticated ? '歡迎回來！' : '歡迎使用待辦事項管理系統'
        }}
      </h1>
      <p class="text-gray-600">
        {{
          authStore.isAuthenticated
            ? '這是您的個人待辦事項清單。'
            : '請登入以管理您的待辦事項。'
        }}
      </p>
    </div>

    <!-- 已登入用戶可見的待辦事項區塊 -->
    <div
      v-if="authStore.isAuthenticated"
      class="bg-white rounded-lg shadow-lg p-6"
    >
      <!-- 添加新待辦事項 -->
      <div class="mb-6">
        <form
          @submit.prevent="todoStore.addTodo(newTodoTitle)"
          class="flex gap-2"
        >
          <input
            v-model="newTodoTitle"
            type="text"
            placeholder="添加新待辦事項..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="todoStore.loading"
          >
            {{ todoStore.loading ? '添加中...' : '添加' }}
          </button>
        </form>
      </div>

      <!-- 待辦事項列表 -->
      <div v-if="todoStore.todos.length > 0">
        <ul class="space-y-3">
          <li
            v-for="todo in todoStore.todos"
            :key="todo.id"
            class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <input
              type="checkbox"
              :checked="todo.is_completed"
              @change="
                todoStore.updateTodo(todo.id, {
                  is_completed: !todo.is_completed,
                })
              "
              class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span
              class="flex-1"
              :class="{ 'line-through text-gray-400': todo.is_completed }"
            >
              {{ todo.title }}
            </span>
            <button
              @click="todoStore.deleteTodo(todo.id)"
              class="px-3 py-1 text-red-600 hover:bg-red-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              刪除
            </button>
          </li>
        </ul>
      </div>

      <!-- 空狀態 -->
      <div
        v-else-if="!todoStore.loading"
        class="text-center py-8 text-gray-500"
      >
        還沒有待辦事項，立即添加一個吧！
      </div>

      <!-- 載入狀態 -->
      <div v-if="todoStore.loading" class="text-center py-8 text-gray-500">
        載入中...
      </div>

      <!-- 錯誤提示 -->
      <div v-if="todoStore.error" class="text-center py-4 text-red-500">
        {{ todoStore.error }}
      </div>
    </div>

    <!-- 未登入用戶可見的區塊 -->
    <div v-else class="bg-white rounded-lg shadow-lg p-6">
      <div class="text-center space-y-4">
        <p class="text-gray-600">登入後即可開始管理您的待辦事項。</p>
        <div class="space-x-4">
          <RouterLink
            to="/login"
            class="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            登入
          </RouterLink>
          <RouterLink
            to="/register"
            class="inline-block px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            註冊
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
