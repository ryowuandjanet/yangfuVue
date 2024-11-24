<template>
  <div
    class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"
  >
    <div class="p-6 text-gray-900 dark:text-gray-100">
      <!-- 標題和編輯按鈕區 -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          案件詳情
        </h2>

        <!-- 編輯按鈕 -->
        <button
          @click="showEditModal = true"
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            class="w-4 h-4 me-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          編輯案件
        </button>
      </div>

      <!-- 案件資訊 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-gray-600 dark:text-gray-400">案號</p>
          <p class="font-medium">{{ caseData?.number }}</p>
        </div>
        <div>
          <p class="text-gray-600 dark:text-gray-400">所屬公司</p>
          <p class="font-medium">{{ caseData?.company }}</p>
        </div>
        <div>
          <p class="text-gray-600 dark:text-gray-400">債務人</p>
          <p class="font-medium">{{ caseData?.debtor }}</p>
        </div>
        <div>
          <p class="text-gray-600 dark:text-gray-400">債權人</p>
          <p class="font-medium">{{ caseData?.creditor }}</p>
        </div>
        <div class="col-span-2">
          <p class="text-gray-600 dark:text-gray-400">地址</p>
          <p class="font-medium">{{ caseData?.address }}</p>
        </div>
      </div>
    </div>

    <!-- 編輯 Modal -->
    <AddCaseModal
      v-if="showEditModal"
      v-model:show="showEditModal"
      :edit-mode="true"
      :initial-data="caseData"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AddCaseModal from '../../components/AddCaseModal.vue';

const props = defineProps({
  caseData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:caseData']);

const showEditModal = ref(false);

// 處理編輯提交
const handleEditSubmit = async (updatedData) => {
  try {
    emit('update:caseData', updatedData);
    showEditModal.value = false;
    alert('更新成功');
  } catch (error) {
    console.error('Error updating case:', error);
    alert('更新失敗');
  }
};
</script>
