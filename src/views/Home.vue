<template>
  <div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div
        class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"
      >
        <div class="p-6 text-gray-900 dark:text-gray-100">
          <!-- 標題和功能區 -->
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              案件清單
            </h2>

            <!-- 搜尋欄 -->
            <div class="flex items-center">
              <form class="flex items-center mr-4">
                <label for="simple-search" class="sr-only">Search</label>
                <div class="relative w-96">
                  <div
                    class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                  >
                    <svg
                      class="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 20"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 0.5h12M5 3.5h8M6.99 6.5h4.02L11 19.5H7L6.99 6.5z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="搜尋案號..."
                    required
                  />
                </div>
              </form>

              <!-- 新增按鈕 -->
              <button
                @click="showModal = true"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-4 h-4 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
                新增案號
              </button>
            </div>
          </div>

          <!-- 表格 -->
          <div class="relative overflow-x-auto">
            <table
              class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">案號</th>
                  <th scope="col" class="px-6 py-3">所屬公司</th>
                  <th scope="col" class="px-6 py-3">債務人</th>
                  <th scope="col" class="px-6 py-3">債權人</th>
                  <th scope="col" class="px-6 py-3">狀態</th>
                  <th scope="col" class="px-6 py-3">建立時間</th>
                  <th scope="col" class="px-6 py-3">
                    <span class="sr-only">編輯</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in caseList"
                  :key="item.id"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {{ item.number }}
                  </th>
                  <td class="px-6 py-4">{{ item.company }}</td>
                  <td class="px-6 py-4">{{ item.debtor }}</td>
                  <td class="px-6 py-4">{{ item.creditor }}</td>
                  <td class="px-6 py-4">{{ item.status }}</td>
                  <td class="px-6 py-4">
                    {{ new Date(item.created_at).toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <a
                      href="#"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >編輯</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用 Modal 元件 -->
    <AddCaseModal v-model:show="showModal" @submit="handleCaseCreated" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import AddCaseModal from '../components/AddCaseModal.vue';

const showModal = ref(false);
const caseList = ref([]);

// 處理新案件創建
const handleCaseCreated = (newCase) => {
  // 將新案件加入到列表的最前面
  caseList.value.unshift(newCase);
  // 關閉 Modal
  showModal.value = false;
};

// 載入案件列表
const fetchCases = async () => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    caseList.value = data;
  } catch (error) {
    console.error('Error fetching cases:', error);
  }
};

// 初始載入資料
onMounted(() => {
  fetchCases();
});
</script>
