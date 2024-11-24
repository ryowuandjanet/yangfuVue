<template>
  <div
    class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-6"
  >
    <div class="p-6 text-gray-900 dark:text-gray-100">
      <!-- 標題和按鈕區 -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            建物資訊
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

      <!-- 建物資料表格 -->
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
                建號
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                建坪(平方公尺)
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                持分
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700 text-right"
              >
                建坪持分(平方公尺) - 原始值
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700 text-right"
              >
                建坪持分(平方公尺) - 計算後值
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                使用分區
              </th>
              <th
                scope="col"
                class="px-6 py-3 border border-gray-200 dark:border-gray-700"
              >
                建物型/使用
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
              v-for="build in buildData"
              :key="build.id"
              class="bg-white dark:bg-gray-800"
            >
              <td class="px-6 py-3 border border-gray-200 dark:border-gray-700">
                <template v-if="editingId === build.id">
                  <input
                    v-model="editingData.number"
                    type="text"
                    class="w-full px-2 py-1 border rounded"
                  />
                </template>
                <template v-else>
                  {{ build.number }}
                </template>
              </td>
              <td
                class="px-6 py-3 border border-gray-200 dark:border-gray-700 text-right"
              >
                <template v-if="editingId === build.id">
                  <input
                    v-model="editingData.area"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 border rounded text-right"
                  />
                </template>
                <template v-else>
                  {{ formatNumber(build.area) }}
                </template>
              </td>
              <td class="px-6 py-3 border border-gray-200 dark:border-gray-700">
                <template v-if="editingId === build.id">
                  <div class="flex flex-col space-y-2">
                    <input
                      v-model="editingData.numerator"
                      type="number"
                      class="w-full px-2 py-1 border rounded text-center"
                      placeholder="個人持分"
                    />
                    <input
                      v-model="editingData.denominator"
                      type="number"
                      class="w-full px-2 py-1 border rounded text-center"
                      placeholder="所有持分"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="text-center">
                    <div class="border-b border-black dark:border-white">
                      {{ build.numerator }}
                    </div>
                    <div>{{ build.denominator }}</div>
                  </div>
                </template>
              </td>
              <td
                class="px-6 py-3 border border-gray-200 dark:border-gray-700 text-right"
              >
                {{ formatNumber(build.original_share_area) }}
              </td>
              <td
                class="px-6 py-3 border border-gray-200 dark:border-gray-700 text-right"
              >
                {{ formatNumber(calculateFinalShareArea(build)) }}
              </td>
              <td class="px-6 py-3 border border-gray-200 dark:border-gray-700">
                <template v-if="editingId === build.id">
                  <select
                    v-model="editingData.zone"
                    class="w-full px-2 py-1 border rounded"
                  >
                    <option
                      v-for="option in zoneOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </template>
                <template v-else>
                  {{ build.zone }}
                </template>
              </td>
              <td class="px-6 py-3 border border-gray-200 dark:border-gray-700">
                <template v-if="editingId === build.id">
                  <select
                    v-model="editingData.usage"
                    class="w-full px-2 py-1 border rounded"
                  >
                    <option
                      v-for="option in usageOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </template>
                <template v-else>
                  {{ build.usage }}
                </template>
              </td>
              <td class="px-6 py-3 border border-gray-200 dark:border-gray-700">
                <div class="flex space-x-2">
                  <template v-if="editingId === build.id">
                    <button
                      @click="handleSave(build.id)"
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
                  </template>
                  <template v-else>
                    <button
                      @click="startEdit(build)"
                      class="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                    >
                      修改
                    </button>
                    <button
                      @click="handleDelete(build.id)"
                      class="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      刪除
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 新增建物 Modal -->
      <AddBuildModal
        v-if="showAddModal"
        v-model:show="showAddModal"
        :case-id="caseId"
        @created="handleBuildCreated"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../../supabase';
import AddBuildModal from '../../components/AddBuildModal.vue';
import { zoneOptions, usageOptions } from '../../utils/buildingOptions';

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
});

const buildData = ref([]);
const showAddModal = ref(false);
const isLoading = ref(false);
const editingId = ref(null);
const editingData = ref({});
const isSaving = ref(false);

// 格式化數字
const formatNumber = (num) => {
  return Number(num).toFixed(2);
};

// 計算最終的持分面積
const calculateFinalShareArea = (build) => {
  const originalArea = Number(build.original_share_area);
  // 如果是增建，則面積減半
  if (build.usage === '增建-持分後坪數打對折') {
    return originalArea / 2;
  }
  return originalArea;
};

// 計算總面積
const totalArea = computed(() => {
  return buildData.value
    .reduce((sum, build) => {
      return sum + Number(calculateFinalShareArea(build));
    }, 0)
    .toFixed(2);
});

// 計算總坪數
const totalAreaInPing = computed(() => {
  return (Number(totalArea.value) / 3.30579).toFixed(2);
});

// 載入建物資料
const fetchBuildData = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from('builds')
      .select('*')
      .eq('case_id', props.caseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    buildData.value = data || [];
  } catch (error) {
    console.error('Error fetching build data:', error);
    alert('載入資料失敗：' + error.message);
  } finally {
    isLoading.value = false;
  }
};

// 處理新增建物後的回調
const handleBuildCreated = async () => {
  await fetchBuildData();
};

// 處理刪除
const handleDelete = async (id) => {
  if (!confirm('確定要刪除這筆資料嗎？')) return;

  try {
    const { error } = await supabase.from('builds').delete().eq('id', id);

    if (error) throw error;
    await fetchBuildData();
    alert('刪除成功！');
  } catch (error) {
    console.error('Error deleting build:', error);
    alert('刪除失敗：' + error.message);
  }
};

// 開始編輯
const startEdit = (build) => {
  editingId.value = build.id;
  editingData.value = {
    number: build.number,
    area: build.area,
    numerator: build.numerator,
    denominator: build.denominator,
    zone: build.zone,
    usage: build.usage,
  };
};

// 取消編輯
const cancelEdit = () => {
  editingId.value = null;
  editingData.value = {};
};

// 儲存編輯
const handleSave = async (id) => {
  try {
    isSaving.value = true;

    // 驗證輸入
    const area = parseFloat(editingData.value.area);
    const numerator = parseInt(editingData.value.numerator);
    const denominator = parseInt(editingData.value.denominator);

    if (isNaN(area) || isNaN(numerator) || isNaN(denominator)) {
      throw new Error('請輸入有效的數字');
    }

    if (denominator === 0) {
      throw new Error('分母不能為0');
    }

    if (!editingData.value.zone) {
      throw new Error('請選擇使用分區');
    }

    if (!editingData.value.usage) {
      throw new Error('請選擇建物型/使用');
    }

    // 計算持分面積
    const originalShareArea = (area * numerator) / denominator;
    // 根據使用類型決定最終面積
    const calculatedShareArea =
      editingData.value.usage === '增建-持分後坪數打對折'
        ? originalShareArea / 2
        : originalShareArea;

    // 更新資料
    const { error } = await supabase
      .from('builds')
      .update({
        number: editingData.value.number,
        area: area,
        numerator: numerator,
        denominator: denominator,
        original_share_area: originalShareArea, // 原始持分面積
        calculated_share_area: calculatedShareArea, // 計算後持分面積
        zone: editingData.value.zone,
        usage: editingData.value.usage,
      })
      .eq('id', id);

    if (error) throw error;

    // 重新載入資料
    await fetchBuildData();

    // 結束編輯狀態
    editingId.value = null;
    editingData.value = {};

    alert('更新成功！');
  } catch (error) {
    console.error('Error updating build:', error);
    alert('更新失敗：' + (error.message || '請稍後再試'));
  } finally {
    isSaving.value = false;
  }
};

// 初始載入資料
onMounted(() => {
  fetchBuildData();
});
</script>

<style scoped>
.border-collapse {
  border-collapse: collapse;
}

/* 美化下拉選單樣式 */
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
</style>
