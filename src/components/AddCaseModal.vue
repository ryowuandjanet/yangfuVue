<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Modal 背景 -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      @click="closeModal"
    ></div>

    <div class="relative p-4 w-full max-w-2xl max-h-full mx-auto">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
        >
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ editMode ? '修改案號內容' : '新增案號' }}
          </h3>
          <button
            @click="closeModal"
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
        <form @submit.prevent="handleSubmit" class="p-4 md:p-5">
          <div class="grid gap-4 mb-4">
            <!-- 案號 -->
            <div class="col-span-2">
              <label
                for="caseNumber"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >案號</label
              >
              <input
                type="text"
                v-model="formData.number"
                id="caseNumber"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="請輸入案號"
                required
              />
            </div>

            <!-- 所屬公司 -->
            <div class="col-span-2">
              <label
                for="company"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >所屬公司</label
              >
              <select
                v-model="formData.company"
                id="company"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              >
                <option value="">請選擇公司</option>
                <option
                  v-for="company in COMPANIES"
                  :key="company"
                  :value="company"
                >
                  {{ company }}
                </option>
              </select>
            </div>

            <!-- 地址欄位群組 -->
            <div class="col-span-2">
              <h3
                class="text-lg font-medium text-gray-900 dark:text-white mb-3"
              >
                地址資訊
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <!-- 縣市選擇 -->
                <div>
                  <label
                    for="city"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >縣市</label
                  >
                  <select
                    v-model="formData.city"
                    id="city"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  >
                    <option value="">請選擇縣市</option>
                    <option
                      v-for="city in Object.keys(taiwanDistricts)"
                      :key="city"
                      :value="city"
                    >
                      {{ city }}
                    </option>
                  </select>
                </div>

                <!-- 鄉鎮市區選擇 -->
                <div>
                  <label
                    for="district"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >鄉鎮市區</label
                  >
                  <select
                    v-model="formData.district"
                    id="district"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    :disabled="!formData.city"
                    required
                  >
                    <option value="">請選擇鄉鎮市區</option>
                    <option
                      v-for="district in districts"
                      :key="district"
                      :value="district"
                    >
                      {{ district }}
                    </option>
                  </select>
                </div>

                <!-- 段號 -->
                <div>
                  <label
                    for="section"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >段號</label
                  >
                  <input
                    type="text"
                    v-model="formData.section"
                    id="section"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入段號"
                  />
                </div>

                <!-- 小段 -->
                <div>
                  <label
                    for="subSection"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >小段</label
                  >
                  <input
                    type="text"
                    v-model="formData.subSection"
                    id="subSection"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入小段"
                  />
                </div>

                <!-- 村里 -->
                <div>
                  <label
                    for="village"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >村里</label
                  >
                  <input
                    type="text"
                    v-model="formData.village"
                    id="village"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入村里"
                  />
                </div>

                <!-- 鄰 -->
                <div>
                  <label
                    for="neighborhood"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >鄰</label
                  >
                  <input
                    type="text"
                    v-model="formData.neighborhood"
                    id="neighborhood"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入鄰"
                  />
                </div>

                <!-- 街路 -->
                <div>
                  <label
                    for="street"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >街路</label
                  >
                  <input
                    type="text"
                    v-model="formData.street"
                    id="street"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入街路"
                  />
                </div>

                <!-- 街路段 -->
                <div>
                  <label
                    for="streetSection"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >街路段</label
                  >
                  <input
                    type="text"
                    v-model="formData.streetSection"
                    id="streetSection"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入街路段"
                  />
                </div>

                <!-- 巷 -->
                <div>
                  <label
                    for="lane"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >巷</label
                  >
                  <input
                    type="text"
                    v-model="formData.lane"
                    id="lane"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入巷"
                  />
                </div>

                <!-- 弄 -->
                <div>
                  <label
                    for="alley"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >弄</label
                  >
                  <input
                    type="text"
                    v-model="formData.alley"
                    id="alley"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入弄"
                  />
                </div>

                <!-- 號 -->
                <div>
                  <label
                    for="houseNumber"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >號</label
                  >
                  <input
                    type="text"
                    v-model="formData.houseNumber"
                    id="houseNumber"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入號"
                  />
                </div>

                <!-- 樓 -->
                <div>
                  <label
                    for="floor"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >樓</label
                  >
                  <input
                    type="text"
                    v-model="formData.floor"
                    id="floor"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="請輸入樓"
                  />
                </div>
              </div>
            </div>

            <!-- 債務人區塊 -->
            <div class="col-span-2">
              <div class="flex items-center justify-between mb-2">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-white"
                  >債務人</label
                >
                <button
                  type="button"
                  @click="addDebtor"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + 新增債務人
                </button>
              </div>
              <div
                v-for="(debtor, index) in formData.debtors"
                :key="index"
                class="flex gap-2 mb-2"
              >
                <input
                  type="text"
                  v-model="debtor.name"
                  :placeholder="`請輸入債務人 ${index + 1}`"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  @click="removeDebtor(index)"
                  class="text-red-600 hover:text-red-700"
                  :disabled="formData.debtors.length === 1"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 債權人區塊 -->
            <div class="col-span-2">
              <div class="flex items-center justify-between mb-2">
                <label
                  class="block text-sm font-medium text-gray-900 dark:text-white"
                  >債權人</label
                >
                <button
                  type="button"
                  @click="addCreditor"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + 新增債權人
                </button>
              </div>
              <div
                v-for="(creditor, index) in formData.creditors"
                :key="index"
                class="flex gap-2 mb-2"
              >
                <input
                  type="text"
                  v-model="creditor.name"
                  :placeholder="`請輸入債權人 ${index + 1}`"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  @click="removeCreditor(index)"
                  class="text-red-600 hover:text-red-700"
                  :disabled="formData.creditors.length === 1"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 按鈕區 -->
          <div
            class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <button
              type="submit"
              :disabled="isLoading"
              class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <span v-if="isLoading">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                處理中...
              </span>
              <span v-else>
                {{ editMode ? '修改' : '新增' }}
              </span>
            </button>
            <button
              @click="closeModal"
              type="button"
              class="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { supabase } from '../supabase';
import { taiwanDistricts } from '../utils/taiwanDistricts';
import { COMPANIES } from '../utils/constants';

const emit = defineEmits(['update:show', 'submit']);
const props = defineProps({
  show: Boolean,
  editMode: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => null,
  },
});

const isLoading = ref(false);

// 表單資料初始化
const formData = ref({
  number: '',
  company: '',
  city: '',
  district: '',
  section: '',
  subSection: '',
  village: '',
  neighborhood: '',
  street: '',
  streetSection: '',
  lane: '',
  alley: '',
  houseNumber: '',
  floor: '',
  debtors: [{ name: '' }],
  creditors: [{ name: '' }],
});

// 當有初始資料時，填充表單
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = {
        number: newData.number || '',
        company: newData.company || '',
        city: newData.city || '',
        district: newData.district || '',
        section: newData.section || '',
        subSection: newData.sub_section || '',
        village: newData.village || '',
        neighborhood: newData.neighborhood || '',
        street: newData.street || '',
        streetSection: newData.street_section || '',
        lane: newData.lane || '',
        alley: newData.alley || '',
        houseNumber: newData.house_number || '',
        floor: newData.floor || '',
        debtors: newData.debtor
          ? newData.debtor.split('、').map((name) => ({ name: name.trim() }))
          : [{ name: '' }],
        creditors: newData.creditor
          ? newData.creditor.split('、').map((name) => ({ name: name.trim() }))
          : [{ name: '' }],
      };
    }
  },
  { immediate: true },
);

// 計算當前選擇縣市的鄉鎮市區列表
const districts = computed(() => {
  return formData.value.city ? taiwanDistricts[formData.value.city] : [];
});

// 處理表單提交
const handleSubmit = async () => {
  try {
    isLoading.value = true;

    // 組合債務人和債權人名稱
    const debtorNames = formData.value.debtors
      .map((d) => d.name)
      .filter(Boolean);
    const creditorNames = formData.value.creditors
      .map((c) => c.name)
      .filter(Boolean);

    // 組合完整地址
    const fullAddress = [
      formData.value.city,
      formData.value.district,
      formData.value.section,
      formData.value.subSection,
      formData.value.village,
      formData.value.neighborhood ? `${formData.value.neighborhood}鄰` : '',
      formData.value.street,
      formData.value.streetSection ? `${formData.value.streetSection}段` : '',
      formData.value.lane ? `${formData.value.lane}巷` : '',
      formData.value.alley ? `${formData.value.alley}弄` : '',
      formData.value.houseNumber ? `${formData.value.houseNumber}號` : '',
      formData.value.floor ? `${formData.value.floor}樓` : '',
    ]
      .filter(Boolean)
      .join('');

    const caseData = {
      number: formData.value.number,
      company: formData.value.company,
      debtor: debtorNames.join('、'),
      creditor: creditorNames.join('、'),
      address: fullAddress,
      city: formData.value.city,
      district: formData.value.district,
      section: formData.value.section,
      sub_section: formData.value.subSection,
      village: formData.value.village,
      neighborhood: formData.value.neighborhood,
      street: formData.value.street,
      street_section: formData.value.streetSection,
      lane: formData.value.lane,
      alley: formData.value.alley,
      house_number: formData.value.houseNumber,
      floor: formData.value.floor,
      status: '進行中',
    };

    if (props.editMode) {
      // 編輯模式：更新現有記錄
      const { data, error } = await supabase
        .from('cases')
        .update(caseData)
        .eq('id', props.initialData.id)
        .select();

      if (error) throw error;
      emit('submit', data[0]);
    } else {
      // 新增模式：插入新記錄
      const { data, error } = await supabase
        .from('cases')
        .insert([caseData])
        .select();

      if (error) throw error;
      emit('submit', data[0]);
    }

    // 關閉 Modal
    emit('update:show', false);

    // 只在新增模式下重置表單
    if (!props.editMode) {
      formData.value = {
        number: '',
        company: '',
        city: '',
        district: '',
        section: '',
        subSection: '',
        village: '',
        neighborhood: '',
        street: '',
        streetSection: '',
        lane: '',
        alley: '',
        houseNumber: '',
        floor: '',
        debtors: [{ name: '' }],
        creditors: [{ name: '' }],
      };
    }
  } catch (error) {
    console.error('Error submitting case:', error);
    alert(props.editMode ? '更新失敗' : '新增失敗');
  } finally {
    isLoading.value = false;
  }
};

// 新增債務人
const addDebtor = () => {
  formData.value.debtors.push({ name: '' });
};

// 移除債務人
const removeDebtor = (index) => {
  if (formData.value.debtors.length > 1) {
    formData.value.debtors.splice(index, 1);
  }
};

// 新增債權人
const addCreditor = () => {
  formData.value.creditors.push({ name: '' });
};

// 移除債權人
const removeCreditor = (index) => {
  if (formData.value.creditors.length > 1) {
    formData.value.creditors.splice(index, 1);
  }
};

// 關閉 Modal 的方法
const closeModal = () => {
  emit('update:show', false);
  // 如果不是編輯模式，重置表單
  if (!props.editMode) {
    formData.value = {
      number: '',
      company: '',
      city: '',
      district: '',
      section: '',
      subSection: '',
      village: '',
      neighborhood: '',
      street: '',
      streetSection: '',
      lane: '',
      alley: '',
      houseNumber: '',
      floor: '',
      debtors: [{ name: '' }],
      creditors: [{ name: '' }],
    };
  }
};

// 可以添加一個計算屬性來控制按鈕文字
const submitButtonText = computed(() => {
  if (isLoading.value) return '處理中...';
  return props.editMode ? '修改' : '新增';
});
</script>
