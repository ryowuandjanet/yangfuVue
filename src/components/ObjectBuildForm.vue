<template>
  <div
    v-show="true"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="relative p-4 w-full max-w-2xl">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editMode ? '編輯參考物件' : '新增參考物件' }}
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
        <div class="p-6">
          <form @submit.prevent="handleSubmit">
            <!-- 單欄位區域 -->
            <div class="space-y-4 mb-4">
              <!-- 現勘 URL -->
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >現勘</label
                >
                <input
                  type="url"
                  v-model="formData.survey_url"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="請輸入URL"
                />
              </div>

              <!-- 地址 -->
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >地址</label
                >
                <input
                  type="text"
                  v-model="formData.address"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </div>

            <!-- 雙欄位區域 -->
            <div class="grid grid-cols-2 gap-4">
              <!-- 物件來源 Dropdown -->
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >物件來源</label
                >
                <div class="relative">
                  <button
                    @click="toggleDropdown"
                    type="button"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-left flex items-center justify-between"
                  >
                    {{ formData.type || '請選擇' }}
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

                  <!-- Dropdown menu -->
                  <div
                    v-if="showDropdown"
                    class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg dark:bg-gray-700"
                  >
                    <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                      <li v-for="type in OBJECT_TYPES" :key="type.value">
                        <a
                          @click="selectType(type.value)"
                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                        >
                          {{ type.label }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 屋齡 -->
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >屋齡</label
                >
                <input
                  type="number"
                  v-model="formData.house_age"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <!-- 樓高 -->
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >樓高</label
                >
                <input
                  type="text"
                  v-model="formData.floor_height"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <!-- 成立日期 -->
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >成立日期</label
                >
                <div class="relative">
                  <input
                    type="text"
                    id="datepicker"
                    v-model="formData.establish_date"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    readonly
                  />
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="w-4 h-4 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 總價 -->
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >總價</label
                >
                <input
                  type="number"
                  v-model="formData.total_price"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <!-- 建坪 -->
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >建坪</label
                >
                <input
                  type="number"
                  step="0.01"
                  v-model="formData.total_area"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
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
            {{ editMode ? '更新' : '新增' }}
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
import { ref, onMounted, watch, onUnmounted } from 'vue';
import Datepicker from 'flowbite-datepicker/Datepicker';
import { OBJECT_TYPES } from '../utils/objectTypes';

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
  editData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'close']);

// Dropdown 控制
const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectType = (type) => {
  formData.value.type = type;
  showDropdown.value = false;
};

// 表單資料
const formData = ref({
  case_id: props.caseId,
  survey_url: '',
  type: '',
  address: '',
  house_age: null,
  floor_height: '',
  establish_date: '',
  total_price: null,
  total_area: null,
});

// 日期選擇器實例
let datepicker = null;

// 初始化日期選擇器
const initDatepicker = () => {
  const dateEl = document.getElementById('datepicker');
  if (dateEl) {
    datepicker = new Datepicker(dateEl, {
      format: 'yyyy-mm-dd',
      autohide: true,
    });

    dateEl.addEventListener('changeDate', (e) => {
      formData.value.establish_date = e.target.value;
    });
  }
};

// 監聽編輯數據變化
watch(
  () => props.editData,
  (newData) => {
    if (newData && props.editMode) {
      formData.value = {
        ...formData.value,
        ...newData,
      };
    }
  },
  { immediate: true },
);

// 點擊外部關閉下拉選單
const handleClickOutside = (event) => {
  if (showDropdown.value && !event.target.closest('.relative')) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  initDatepicker();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (datepicker) {
    datepicker.destroy();
  }
  document.removeEventListener('click', handleClickOutside);
});

// 提交表單
const handleSubmit = () => {
  emit('submit', {
    ...formData.value,
    case_id: props.caseId,
  });
};
</script>

<style>
/* 確保日期選擇器在最上層 */
.datepicker {
  z-index: 60 !important;
}
</style>
