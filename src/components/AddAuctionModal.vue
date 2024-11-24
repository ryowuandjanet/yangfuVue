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
          <h3 class="text-xl font-semibold mb-4">新增拍賣資訊</h3>

          <form @submit.prevent="handleSubmit">
            <!-- 拍賣日期 -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="auction-date"
              >
                拍賣日期
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                  <svg
                    class="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                    />
                  </svg>
                </div>
                <input
                  datepicker
                  datepicker-format="yyyy-mm-dd"
                  type="text"
                  id="auction-date"
                  v-model="formData.date"
                  class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                  placeholder="選擇日期"
                  required
                />
              </div>
            </div>

            <!-- 拍別-進場判定 -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="auction-type"
              >
                拍別-進場判定
              </label>
              <button
                id="auction-type"
                type="button"
                class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 w-full text-left"
                @click="toggleDropdown"
              >
                {{ selectedType ? selectedType.label : '請選擇拍別' }}
              </button>
              <div
                v-if="showDropdown"
                class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full mt-1"
              >
                <ul class="py-2 text-sm text-gray-700">
                  <li v-for="option in auctionTypeOptions" :key="option.value">
                    <a
                      href="#"
                      class="block px-4 py-2 hover:bg-gray-100"
                      @click.prevent="selectType(option)"
                    >
                      {{ option.label }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 底價 -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="base-price"
              >
                底價(台幣)
              </label>
              <input
                type="text"
                id="base-price"
                v-model="formData.basePrice"
                @input="formatCurrency('basePrice')"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <!-- 成交件數 -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="deal-count"
              >
                成交件數
              </label>
              <input
                type="number"
                id="deal-count"
                v-model="formData.dealCount"
                min="0"
                step="1"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <!-- 保證金 -->
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="deposit"
              >
                保證金
              </label>
              <input
                type="text"
                id="deposit"
                v-model="formData.deposit"
                @input="formatCurrency('deposit')"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <!-- 按鈕區 -->
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                @click="$emit('update:show', false)"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                :disabled="isLoading"
              >
                {{ isLoading ? '儲存中...' : '儲存' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import { auctionTypeOptions } from '../utils/auctionOptions';
import Datepicker from 'flowbite-datepicker/Datepicker';

const props = defineProps({
  show: Boolean,
  caseId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:show', 'created']);

const isLoading = ref(false);
const showDropdown = ref(false);
const selectedType = ref(null);
const formData = ref({
  date: '',
  basePrice: '',
  dealCount: '',
  deposit: '',
});

// 切換下拉選單
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// 選擇拍別
const selectType = (option) => {
  selectedType.value = option;
  showDropdown.value = false;
};

// 格式化貨幣
const formatCurrency = (field) => {
  let value = formData.value[field].replace(/\D/g, '');
  formData.value[field] = new Intl.NumberFormat('zh-TW').format(value);
};

// 提交表單
const handleSubmit = async () => {
  try {
    isLoading.value = true;

    if (!selectedType.value) {
      throw new Error('請選擇拍別');
    }

    // 準備要插入的資料
    const newAuction = {
      case_id: props.caseId,
      auction_date: formData.value.date,
      auction_type: selectedType.value.value,
      cp_value: selectedType.value.cp,
      base_price: parseInt(formData.value.basePrice.replace(/\D/g, '')),
      deal_count: parseInt(formData.value.dealCount),
      deposit: parseInt(formData.value.deposit.replace(/\D/g, '')),
    };

    // 插入資料到 Supabase
    const { data, error } = await supabase
      .from('auctions')
      .insert([newAuction])
      .select();

    if (error) throw error;

    // 發送成功事件
    emit('created', data[0]);

    // 關閉 Modal
    emit('update:show', false);

    // 重置表單
    formData.value = {
      date: '',
      basePrice: '',
      dealCount: '',
      deposit: '',
    };
    selectedType.value = null;

    alert('新增成功！');
  } catch (error) {
    console.error('Error adding auction:', error);
    alert('新增失敗：' + (error.message || '請稍後再試'));
  } finally {
    isLoading.value = false;
  }
};

// 初始化日期選擇器
onMounted(() => {
  // 初始化日期選擇器
  const datepickerEl = document.getElementById('auction-date');
  new Datepicker(datepickerEl, {
    format: 'yyyy-mm-dd',
    autohide: true,
    todayHighlight: true,
    language: 'zh-TW',
  });

  // 監聽日期變更事件
  datepickerEl.addEventListener('changeDate', (e) => {
    formData.value.date = e.target.value;
  });

  // 點擊外部關閉下拉選單
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#auction-type')) {
      showDropdown.value = false;
    }
  });
});
</script>
