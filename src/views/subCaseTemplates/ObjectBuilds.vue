<template>
  <div
    class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-6"
  >
    <div class="p-6 text-gray-900 dark:text-gray-100">
      <!-- 標題列 -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-semibold">參考物件</h2>
          <button
            @click="openObjectBuildForm"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            新增
          </button>
        </div>
        <div class="text-sm font-medium">
          時價：{{
            formatPrice(
              buildData.reduce((sum, build) => {
                const scores = build.scores || [];
                const validScores = scores
                  .map((score) => calculateScore(build, score.coefficient))
                  .filter((score) => score !== '-');
                return validScores.length
                  ? sum +
                      validScores.reduce(
                        (a, b) => a + Number(b.replace(/,/g, '')),
                        0,
                      ) /
                        validScores.length
                  : sum;
              }, 0) /
                (buildData.filter((build) =>
                  build.scores?.some(
                    (score) => calculateScore(build, score.coefficient) !== '-',
                  ),
                ).length || 1),
            )
          }}
          元
        </div>
      </div>

      <!-- 表格部分 -->
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3">現勘</th>
              <th scope="col" class="px-6 py-3">參考物件訊息</th>
              <th scope="col" class="px-6 py-3">評分明細</th>
              <th scope="col" class="px-6 py-3">計算</th>

              <th scope="col" class="px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="build in buildData"
              :key="build.id"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td class="px-6 py-4">
                <a
                  v-if="build.survey_url"
                  :href="build.survey_url"
                  target="_blank"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  查看
                </a>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-1 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400"
                      >物件來源：</span
                    >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      build.type
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400">地址：</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      build.address
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400">屋齡：</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      build.house_age
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400">樓高：</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      build.floor_height
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400"
                      >成立日期：</span
                    >
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatDate(build.establish_date)
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400">總價：</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatPrice(build.total_price)
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400">建坪：</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{
                      formatArea(build.total_area)
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 dark:text-gray-400">單價：</span>
                    <span class="font-medium text-gray-900 dark:text-white"
                      >{{ calculateUnitPrice(build) }}元</span
                    >
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-4">
                  <button
                    @click="openScoreModal(build.id)"
                    type="button"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    評分
                  </button>

                  <div
                    v-if="build.scores && build.scores.length > 0"
                    class="space-y-2"
                  >
                    <div
                      v-for="score in build.scores"
                      :key="score.id"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg dark:bg-gray-700"
                    >
                      <div class="flex items-center space-x-2">
                        <span
                          class="text-sm text-gray-600 dark:text-gray-300"
                          >{{ score.score_type }}</span
                        >
                        <span
                          class="text-sm font-medium text-gray-900 dark:text-white"
                          >{{ formatCoefficient(score.coefficient) }}</span
                        >
                      </div>

                      <div class="flex items-center space-x-2">
                        <button
                          @click="openEditScore(score)"
                          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          編輯
                        </button>
                        <button
                          @click="deleteScore(score.id)"
                          class="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 space-x-2">
                <div class="text-sm">
                  {{
                    build.scores && build.scores.length > 0
                      ? new Intl.NumberFormat('zh-TW', {
                          style: 'decimal',
                          maximumFractionDigits: 0,
                        }).format(
                          (build.scores.reduce(
                            (sum, score) => sum + score.coefficient,
                            0,
                          ) /
                            build.scores.length) *
                            (build.total_price / build.total_area),
                        )
                      : new Intl.NumberFormat('zh-TW', {
                          style: 'decimal',
                          maximumFractionDigits: 0,
                        }).format(build.total_price / build.total_area)
                  }}
                </div>
              </td>
              <td class="px-6 py-4 space-x-2">
                <button
                  @click="openEditForm(build)"
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  編輯
                </button>
                <button
                  @click="deleteBuild(build.id)"
                  class="font-medium text-red-600 dark:text-red-500 hover:underline"
                >
                  刪除
                </button>
              </td>
            </tr>
            <tr v-if="buildData.length === 0">
              <td colspan="3" class="px-6 py-4 text-center">尚無資料</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Form Modal -->
      <ObjectBuildForm
        v-if="showFormModal"
        :case-id="caseId"
        :edit-mode="isEditMode"
        :edit-data="selectedBuild"
        @close="closeFormModal"
        @submit="handleFormSubmit"
      />

      <!-- 評分 Modal -->
      <ObjectBuildScoreModal
        v-if="showScoreModal"
        :is-open="showScoreModal"
        :object-build-id="selectedBuildId"
        :edit-mode="isScoreEditMode"
        :edit-data="selectedScore"
        @close="closeScoreModal"
        @saved="handleScoreSaved"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
import ObjectBuildForm from '../../components/ObjectBuildForm.vue';
import ObjectBuildScoreModal from '../../components/ObjectBuildScoreModal.vue';

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
});

// Modal 控制狀態
const showFormModal = ref(false);
const isEditMode = ref(false);
const selectedBuild = ref(null);
const buildData = ref([]);
const showScoreModal = ref(false);
const selectedBuildId = ref(null);
const isScoreEditMode = ref(false);
const selectedScore = ref(null);

// 格式化價格（添加千分位）
const formatPrice = (price) => {
  if (!price || isNaN(Number(price))) return '-';
  return new Intl.NumberFormat('zh-TW').format(price);
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-';
  return date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3');
};

// 格式化建坪
const formatArea = (area) => {
  if (!area) return '-';
  return Number(area).toFixed(2);
};

// 計算並格式化單價
const calculateUnitPrice = (build) => {
  if (!build.total_price || !build.total_area || build.total_area === 0) {
    return '-';
  }

  const unitPrice = Math.round(build.total_price / build.total_area);
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(unitPrice);
};

// 格式化係數
const formatCoefficient = (value) => {
  if (!value || isNaN(Number(value))) return '-';
  return Number(value).toFixed(2);
};

// 打開新增表單
const openAddForm = () => {
  console.log('Opening add form'); // 添加日誌
  isEditMode.value = false;
  selectedBuild.value = null;
  showFormModal.value = true;
};

// 打開編輯表單
const openEditForm = (build) => {
  console.log('Opening edit form', build); // 添加日誌
  isEditMode.value = true;
  selectedBuild.value = build;
  showFormModal.value = true;
};

// 關閉表單
const closeFormModal = () => {
  console.log('Closing form'); // 添加日誌
  showFormModal.value = false;
  isEditMode.value = false;
  selectedBuild.value = null;
};

// 處理表單提交
const handleFormSubmit = async (formData) => {
  try {
    if (isEditMode.value) {
      // 更新現有資料
      const { error } = await supabase
        .from('object_builds')
        .update(formData)
        .eq('id', selectedBuild.value.id);

      if (error) throw error;
    } else {
      // 新增資料
      const { error } = await supabase.from('object_builds').insert([formData]);

      if (error) throw error;
    }

    closeFormModal();
    await fetchBuildData();
  } catch (error) {
    console.error('Error saving build:', error);
    alert(isEditMode.value ? '更新失敗：' : '新增失敗：' + error.message);
  }
};

// 獲取資料
const fetchBuildData = async () => {
  try {
    const { data, error } = await supabase
      .from('object_builds')
      .select(
        `
        *,
        scores:object_build_scores(
          id,
          score_type,
          coefficient
        )
      `,
      )
      .eq('case_id', props.caseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    buildData.value = data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('獲取資料失敗：' + error.message);
  }
};

// 刪除資料
const deleteBuild = async (id) => {
  if (!confirm('確定要刪除此筆資料？')) return;

  try {
    const { error } = await supabase
      .from('object_builds')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchBuildData();
  } catch (error) {
    console.error('Error deleting build:', error);
    alert('刪除失敗：' + error.message);
  }
};

// 打開評分 Modal
const openScoreModal = (buildId) => {
  console.log('Opening new score modal for build:', buildId);
  selectedBuildId.value = buildId;
  isScoreEditMode.value = false;
  selectedScore.value = null;
  showScoreModal.value = true;
};

// 打開編輯評分 Modal
const openEditScore = (score) => {
  console.log('Opening edit score modal:', score);
  selectedBuildId.value = score.object_build_id;
  isScoreEditMode.value = true;
  selectedScore.value = score;
  showScoreModal.value = true;
};

// 關閉評分 Modal
const closeScoreModal = () => {
  showScoreModal.value = false;
  selectedBuildId.value = null;
  isScoreEditMode.value = false;
  selectedScore.value = null;
};

// 處理評分保存
const handleScoreSaved = async () => {
  console.log('Score saved');
  await fetchBuildData();
  closeScoreModal();
};

// 計算總評分（所有係數的平均值 * 總價/建評）
const calculateTotalScore = (build) => {
  try {
    // 確保所有必要的數據都存在
    if (!build?.total_price || !build?.total_area || !build?.scores?.length) {
      return '-';
    }

    // 計算所有係數的平均值
    const validScores = build.scores.filter(
      (score) => score && score.coefficient,
    );
    if (validScores.length === 0) {
      return '-';
    }

    const totalCoefficients = validScores.reduce(
      (sum, score) => sum + (Number(score.coefficient) || 0),
      0,
    );
    const averageCoefficient = totalCoefficients / validScores.length;

    // 計算總價/建評
    const pricePerArea = Number(build.total_price) / Number(build.total_area);

    // 計算最終結果：平均係數 * (總價/建評)
    const result = averageCoefficient * pricePerArea;

    // 格式化結果，顯示千分位
    return new Intl.NumberFormat('zh-TW', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(result);
  } catch (error) {
    console.error('Error calculating total score:', error);
    return '-';
  }
};

// 計算單項評分
const calculateScore = (build, coefficient) => {
  try {
    // 確保所有必要的數據都存在
    if (!build?.total_price || !build?.total_area || !coefficient) {
      return '-';
    }

    // 轉換為數字並計算
    const price = Number(build.total_price);
    const area = Number(build.total_area);
    const coef = Number(coefficient);

    if (isNaN(price) || isNaN(area) || isNaN(coef) || area === 0) {
      return '-';
    }

    // 計算總價/建評
    const pricePerArea = price / area;

    // 計算最終結果：係數 * (總價/建評)
    const result = coef * pricePerArea;

    // 格式化結果，顯示千分位
    return new Intl.NumberFormat('zh-TW', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(result);
  } catch (error) {
    console.error('Error calculating score:', error);
    return '-';
  }
};

// 初始化
onMounted(() => {
  fetchBuildData();
});
</script>

<style scoped>
.border-collapse {
  border-collapse: collapse;
}

td,
th {
  vertical-align: middle;
}

.bg-purple-50 {
  background-color: #faf5ff;
}

.bg-purple-100 {
  background-color: #f3e8ff;
}

.bg-gray-900\/50 {
  background-color: rgba(17, 24, 39, 0.5);
}

/* 確保日期選擇器顯示在最上層 */
.datepicker {
  z-index: 9999 !important;
}

/* 自定義日期選擇器樣式 */
.datepicker-cell.selected,
.datepicker-cell.selected:hover {
  background-color: #3b82f6 !important;
  color: white !important;
}

.datepicker-cell.today:not(.selected) {
  border-color: #3b82f6 !important;
}

.datepicker-header .datepicker-controls .button {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
}

.datepicker-header .datepicker-controls .button:hover {
  background-color: #e5e7eb !important;
}

.datepicker-picker {
  background-color: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

/* 確保每行有適當的間距 */
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}

/* 確保評分列表的樣式一致 */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}

/* 可選：添加一些額外的樣式來優化顯示 */
.space-y-2 > div {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
}
</style>
