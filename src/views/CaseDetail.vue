<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <!-- 返回按鈕 -->
      <div class="mb-4">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回首頁
        </router-link>
      </div>

      <!-- 原有的案件詳情卡片 -->
      <div
        class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"
      >
        <div class="p-6 text-gray-900 dark:text-gray-100">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              案件詳情
            </h2>

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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';
import AddCaseModal from '../components/AddCaseModal.vue';

const route = useRoute();
const caseData = ref(null);
const showEditModal = ref(false);
const isLoading = ref(false);

// 載入案件詳情
const fetchCaseDetail = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', route.params.id)
      .single();

    if (error) throw error;
    caseData.value = data;
  } catch (error) {
    console.error('Error fetching case detail:', error);
    alert('載入資料失敗');
  } finally {
    isLoading.value = false;
  }
};

// 處理編輯提交
const handleEditSubmit = async (updatedData) => {
  try {
    // 更新完成後重新載入資料
    await fetchCaseDetail();
    showEditModal.value = false;
    alert('更新成功');
  } catch (error) {
    console.error('Error updating case:', error);
    alert('更新失敗');
  }
};

onMounted(() => {
  fetchCaseDetail();
});
</script>
