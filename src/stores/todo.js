import { defineStore } from 'pinia';
import { supabase } from '../supabase';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    loading: false,
    error: null,
  }),

  actions: {
    // 獲取所有待辦事項
    async fetchTodos() {
      try {
        this.loading = true;
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        this.todos = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // 添加待辦事項
    async addTodo(title) {
      try {
        this.loading = true;
        const { data, error } = await supabase
          .from('todos')
          .insert([{ title, is_completed: false }])
          .select();

        if (error) throw error;
        this.todos.unshift(data[0]);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // 更新待辦事項
    async updateTodo(id, updates) {
      try {
        this.loading = true;
        const { data, error } = await supabase
          .from('todos')
          .update(updates)
          .eq('id', id)
          .select();

        if (error) throw error;
        const index = this.todos.findIndex((todo) => todo.id === id);
        if (index !== -1) {
          this.todos[index] = data[0];
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // 刪除待辦事項
    async deleteTodo(id) {
      try {
        this.loading = true;
        const { error } = await supabase.from('todos').delete().eq('id', id);

        if (error) throw error;
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
