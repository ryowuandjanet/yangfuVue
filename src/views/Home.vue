<script setup>
import { ref, onMounted } from 'vue';
import { useTodoStore } from '../stores/todo';

const todoStore = useTodoStore();
const newTodoTitle = ref('');
const editingTodo = ref(null);
const editTitle = ref('');

onMounted(() => {
  todoStore.fetchTodos();
});

const handleSubmit = async () => {
  if (!newTodoTitle.value.trim()) return;
  await todoStore.addTodo(newTodoTitle.value);
  newTodoTitle.value = '';
};

const startEdit = (todo) => {
  editingTodo.value = todo;
  editTitle.value = todo.title;
};

const saveEdit = async () => {
  if (!editTitle.value.trim()) return;
  await todoStore.updateTodo(editingTodo.value.id, { title: editTitle.value });
  editingTodo.value = null;
};

const toggleComplete = async (todo) => {
  await todoStore.updateTodo(todo.id, { is_completed: !todo.is_completed });
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col items-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-center">待辦事項清單</h1>

      <!-- 添加新待辦事項 -->
      <form @submit.prevent="handleSubmit" class="mb-6">
        <div class="flex gap-2">
          <input
            v-model="newTodoTitle"
            type="text"
            placeholder="添加新待辦事項..."
            class="flex-1 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="todoStore.loading"
          >
            添加
          </button>
        </div>
      </form>

      <!-- 錯誤提示 -->
      <div v-if="todoStore.error" class="text-red-500 mb-4">
        {{ todoStore.error }}
      </div>

      <!-- 載入提示 -->
      <div v-if="todoStore.loading" class="text-center text-gray-500">
        載入中...
      </div>

      <!-- 待辦事項列表 -->
      <ul class="space-y-4">
        <li
          v-for="todo in todoStore.todos"
          :key="todo.id"
          class="flex items-center gap-4 p-4 bg-gray-50 rounded"
        >
          <!-- 完成狀態 -->
          <input
            type="checkbox"
            :checked="todo.is_completed"
            @change="toggleComplete(todo)"
            class="h-5 w-5"
          />

          <!-- 編輯模式 -->
          <template v-if="editingTodo?.id === todo.id">
            <input
              v-model="editTitle"
              type="text"
              class="flex-1 px-2 py-1 border rounded"
              @keyup.enter="saveEdit"
            />
            <button
              @click="saveEdit"
              class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              保存
            </button>
          </template>

          <!-- 顯示模式 -->
          <template v-else>
            <span
              class="flex-1"
              :class="{ 'line-through text-gray-400': todo.is_completed }"
            >
              {{ todo.title }}
            </span>
            <button
              @click="startEdit(todo)"
              class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              編輯
            </button>
          </template>

          <!-- 刪除按鈕 -->
          <button
            @click="todoStore.deleteTodo(todo.id)"
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            刪除
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
