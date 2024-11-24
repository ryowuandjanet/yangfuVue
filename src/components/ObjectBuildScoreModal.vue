<template>
  <div
    v-show="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="relative p-4 w-full max-w-md">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editMode ? '編輯評分' : '新增評分' }}
          </h3>
          <button
            @click="$emit('close')"
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>

        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- 評分類型 -->
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >評分類型</label
              >
              <div class="relative">
                <button
                  @click="toggleDropdown"
                  type="button"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-left flex items-center justify-between"
                >
                  {{ formData.score_type || '請選擇' }}
                  <svg
                    class="w-4 h-4 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <div
                  v-if="showDropdown"
                  class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg dark:bg-gray-700"
                >
                  <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <li v-for="type in SCORE_TYPES" :key="type.value">
                      <a
                        @click="selectType(type)"
                        class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                      >
                        {{ type.label }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- 加成係數 -->
            <div>
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >加成係數</label
              >
              <input
                type="number"
                step="0.01"
                v-model="formData.coefficient"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
          </form>
        </div>

        <!-- Modal footer -->
        <div
          class="flex items-center justify-end p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <button
            @click="handleSubmit"
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {{ editMode ? '更新' : '儲存' }}
          </button>
          <button
            @click="$emit('close')"
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { supabase } from '../supabase';
import { SCORE_TYPES } from '../utils/scoreTypes';

const props = defineProps({
  isOpen: Boolean,
  objectBuildId: String,
  editMode: {
    type: Boolean,
    default: false,
  },
  editData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);

const showDropdown = ref(false);

// 初始化表單數據
const formData = ref({
  score_type: '',
  coefficient: 1,
});

// 監聽編輯數據變化
watch(
  () => props.editData,
  (newData) => {
    console.log('Edit data changed:', newData);
    if (newData && props.editMode) {
      formData.value = {
        score_type: newData.score_type,
        coefficient: newData.coefficient,
      };
    } else {
      // 重置表單
      formData.value = {
        score_type: '',
        coefficient: 1,
      };
    }
  },
  { immediate: true },
);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectType = (type) => {
  formData.value.score_type = type.value;
  showDropdown.value = false;
};

// 提交處理
const handleSubmit = async () => {
  try {
    if (props.editMode && props.editData) {
      console.log('Updating score:', {
        id: props.editData.id,
        data: formData.value,
      });

      // 更新現有評分
      const { error } = await supabase
        .from('object_build_scores')
        .update({
          score_type: formData.value.score_type,
          coefficient: formData.value.coefficient,
        })
        .eq('id', props.editData.id);

      if (error) throw error;
    } else {
      // 新增評分
      const { error } = await supabase.from('object_build_scores').insert([
        {
          object_build_id: props.objectBuildId,
          score_type: formData.value.score_type,
          coefficient: formData.value.coefficient,
        },
      ]);

      if (error) throw error;
    }

    emit('saved');
  } catch (error) {
    console.error('Error saving score:', error);
    alert('儲存失敗：' + error.message);
  }
};

// 點擊外部關閉下拉選單
const handleClickOutside = (event) => {
  if (showDropdown.value && !event.target.closest('.relative')) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
