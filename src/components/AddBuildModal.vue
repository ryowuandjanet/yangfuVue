<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      @click="$emit('update:show', false)"
    ></div>

    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
      >
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <h3 class="text-xl font-semibold mb-4">新增建物資料</h3>

          <form @submit.prevent="handleSubmit">
            <!-- 建號 -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="number"
              >
                建號
              </label>
              <input
                type="text"
                id="number"
                v-model="formData.number"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <!-- 建坪(平方公尺) -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="area"
              >
                建坪(平方公尺)
              </label>
              <input
                type="number"
                id="area"
                v-model="formData.area"
                step="0.01"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <!-- 持分 -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="numerator"
                >
                  個人持分
                </label>
                <input
                  type="number"
                  id="numerator"
                  v-model="formData.numerator"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label
                  class="block text-gray-700 text-sm font-bold mb-2"
                  for="denominator"
                >
                  所有持分
                </label>
                <input
                  type="number"
                  id="denominator"
                  v-model="formData.denominator"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
            </div>

            <!-- 使用分區 -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="zone"
              >
                使用分區
              </label>
              <select
                id="zone"
                v-model="formData.zone"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option
                  v-for="option in zoneOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- 建物型/使用 -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="usage"
              >
                建物型/使用
              </label>
              <select
                id="usage"
                v-model="formData.usage"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option
                  v-for="option in usageOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>

            <!-- 按鈕區 -->
            <div
              class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
            >
              <button
                type="submit"
                class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                :disabled="isLoading"
              >
                {{ isLoading ? '處理中...' : '新增' }}
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                @click="$emit('update:show', false)"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';
import { zoneOptions, usageOptions } from '../utils/buildingOptions';

const props = defineProps({
  show: Boolean,
  caseId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:show', 'created']);

const isLoading = ref(false);
const formData = ref({
  number: '',
  area: '',
  numerator: '',
  denominator: '',
  zone: '',
  usage: '',
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;

    // 驗證輸入
    if (
      !formData.value.number ||
      !formData.value.area ||
      !formData.value.numerator ||
      !formData.value.denominator ||
      !formData.value.zone ||
      !formData.value.usage
    ) {
      throw new Error('請填寫所有欄位');
    }

    // 轉換數值
    const area = parseFloat(formData.value.area);
    const numerator = parseInt(formData.value.numerator);
    const denominator = parseInt(formData.value.denominator);

    // 驗證數值
    if (isNaN(area) || isNaN(numerator) || isNaN(denominator)) {
      throw new Error('請輸入有效的數字');
    }

    if (denominator === 0) {
      throw new Error('分母不能為0');
    }

    // 計算持分面積
    const shareArea = (area * numerator) / denominator;

    // 準備要插入的資料
    const newBuild = {
      case_id: props.caseId,
      number: formData.value.number,
      area: area,
      numerator: numerator,
      denominator: denominator,
      original_share_area: shareArea,
      calculated_share_area: shareArea,
      zone: formData.value.zone,
      usage: formData.value.usage,
    };

    // 插入資料到 Supabase
    const { data, error } = await supabase
      .from('builds')
      .insert([newBuild])
      .select();

    if (error) throw error;

    // 發送成功事件
    emit('created', data[0]);

    // 關閉 Modal
    emit('update:show', false);

    // 重置表單
    formData.value = {
      number: '',
      area: '',
      numerator: '',
      denominator: '',
      zone: '',
      usage: '',
    };

    alert('新增成功！');
  } catch (error) {
    console.error('Error adding build:', error);
    alert('新增失敗：' + (error.message || '請稍後再試'));
  } finally {
    isLoading.value = false;
  }
};
</script>
