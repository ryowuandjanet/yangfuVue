<template>
  <div
    class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-6"
  >
    <div class="p-6 text-gray-900 dark:text-gray-100">
      <!-- 標題和按鈕區 -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            土地資訊
          </h2>
          <button
            @click="showAddModal = true"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
          >
            新增
          </button>
        </div>
        <span class="text-gray-600 dark:text-gray-400">
          合計：{{ totalArea }}m2({{ totalAreaInPing }}坪)
        </span>
      </div>

      <!-- 土地資料表格 -->
      <div class="relative overflow-x-auto">
        <table
          class="w-full text-sm text-left border-collapse border border-gray-200 dark:border-gray-700"
        >
          <thead class="text-xs bg-emerald-100 dark:bg-emerald-800">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                地號
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                地坪(平方公尺)
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                持分
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                地坪持分(平方公尺)
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="land in landData"
              :key="land.id"
              class="bg-white dark:bg-gray-800"
            >
              <td class="px-6 py-3 border border-gray-200 dark:border-gray-700">
                <template v-if="editingId === land.id">
                  <input
                    v-model="editingData.number"
                    type="text"
                    class="w-full px-2 py-1 border rounded"
                  />
                </template>
                <template v-else>
                  {{ land.number }}
                </template>
              </td>
              <td
                class="px-6 py-3 border border-gray-200 dark:border-gray-700 text-blue-600"
              >
                <template v-if="editingId === land.id">
                  <input
                    v-model="editingData.area"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 border rounded"
                  />
                </template>
                <template v-else>
                  {{ formatNumber(land.area) }}
                </template>
              </td>
              <td class="px-6 py-3 border border-gray-200 dark:border-gray-700">
                <template v-if="editingId === land.id">
                  <div class="flex flex-col space-y-2">
                    <input
                      v-model="editingData.numerator"
                      type="number"
                      class="w-full px-2 py-1 border rounded"
                      placeholder="個人持分"
                    />
                    <input
                      v-model="editingData.denominator"
                      type="number"
                      class="w-full px-2 py-1 border rounded"
                      placeholder="所有持分"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="text-center">
                    <div class="border-b border-black dark:border-white">
                      {{ land.numerator }}
                    </div>
                    <div>{{ land.denominator }}</div>
                  </div>
                </template>
              </td>
              <td
                class="px-6 py-3 border border-gray-200 dark:border-gray-700 text-blue-600"
              >
                {{ formatNumber(land.share_area) }}
              </td>
              <td class="px-6 py-3 border border-gray-200 dark:border-gray-700">
                <template v-if="editingId === land.id">
                  <div class="flex space-x-2">
                    <button
                      @click="handleSave(land.id)"
                      class="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                      :disabled="isSaving"
                    >
                      {{ isSaving ? '儲存中...' : '儲存' }}
                    </button>
                    <button
                      @click="cancelEdit"
                      class="text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                    >
                      取消
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div class="flex space-x-2">
                    <button
                      @click="startEdit(land)"
                      class="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                    >
                      修改
                    </button>
                    <button
                      @click="handleDelete(land.id)"
                      class="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      :disabled="isDeleting === land.id"
                    >
                      {{ isDeleting === land.id ? '刪除中...' : '刪除' }}
                    </button>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新增土地 Modal -->
    <AddLandModal
      v-if="showAddModal"
      v-model:show="showAddModal"
      :case-id="caseId"
      @created="handleLandCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../../supabase';
import AddLandModal from '../../components/AddLandModal.vue';

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
});

const landData = ref([]);
const showAddModal = ref(false);
const isLoading = ref(false);
const editingId = ref(null);
const editingData = ref({});
const isSaving = ref(false);
const isDeleting = ref(null);

// 格式化數字，保留兩位小數
const formatNumber = (num) => {
  return Number(num).toFixed(2);
};

// 計算總面積
const totalArea = computed(() => {
  return landData.value
    .reduce((sum, land) => sum + Number(land.share_area), 0)
    .toFixed(2);
});

// 計算總坪數
const totalAreaInPing = computed(() => {
  return (Number(totalArea.value) / 3.30579).toFixed(2);
});

// 載入土地資料
const fetchLandData = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from('lands')
      .select('*')
      .eq('case_id', props.caseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    landData.value = data || [];
  } catch (error) {
    console.error('Error fetching land data:', error);
    alert('載入資料失敗：' + error.message);
  } finally {
    isLoading.value = false;
  }
};

// 處理新增土地後的回調
const handleLandCreated = async (newLand) => {
  await fetchLandData(); // 重新載入所有資料
};

// 初始載入資料
onMounted(() => {
  fetchLandData();
});

// 開始編輯
const startEdit = (land) => {
  editingId.value = land.id;
  editingData.value = {
    number: land.number,
    area: land.area,
    numerator: land.numerator,
    denominator: land.denominator,
  };
};

// 取消編輯
const cancelEdit = () => {
  editingId.value = null;
  editingData.value = {};
};

// 儲存修改
const handleSave = async (id) => {
  try {
    isSaving.value = true;

    // 驗證輸入
    if (
      !editingData.value.number ||
      !editingData.value.area ||
      !editingData.value.numerator ||
      !editingData.value.denominator
    ) {
      throw new Error('請填寫所有欄位');
    }

    // 轉換數值
    const area = parseFloat(editingData.value.area);
    const numerator = parseInt(editingData.value.numerator);
    const denominator = parseInt(editingData.value.denominator);

    // 驗證數值
    if (isNaN(area) || isNaN(numerator) || isNaN(denominator)) {
      throw new Error('請輸入有效的數字');
    }

    if (denominator === 0) {
      throw new Error('分母不能為0');
    }

    // 計算持分面積
    const shareArea = (area * numerator) / denominator;

    // 更新資料
    const { error } = await supabase
      .from('lands')
      .update({
        number: editingData.value.number,
        area: area,
        numerator: numerator,
        denominator: denominator,
        share_area: shareArea,
      })
      .eq('id', id);

    if (error) throw error;

    // 重新載入資料
    await fetchLandData();

    // 結束編輯狀態
    editingId.value = null;
    editingData.value = {};

    alert('更新成功！');
  } catch (error) {
    console.error('Error updating land:', error);
    alert('更新失敗：' + (error.message || '請稍後再試'));
  } finally {
    isSaving.value = false;
  }
};

// 處理刪除
const handleDelete = async (id) => {
  // 顯示確認對話框
  if (!confirm('確定要刪除這筆資料嗎？')) {
    return;
  }

  try {
    isDeleting.value = id;

    // 從 Supabase 刪除資料
    const { error } = await supabase.from('lands').delete().eq('id', id);

    if (error) throw error;

    // 從本地資料中移除
    landData.value = landData.value.filter((land) => land.id !== id);

    alert('刪除成功！');
  } catch (error) {
    console.error('Error deleting land:', error);
    alert('刪除失敗：' + (error.message || '請稍後再試'));
  } finally {
    isDeleting.value = null;
  }
};
</script>

<style scoped>
.border-collapse {
  border-collapse: collapse;
}

.flex button {
  transition: all 0.2s ease;
}

.flex button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
