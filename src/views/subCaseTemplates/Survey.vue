<template>
  <div
    class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-6"
  >
    <div class="p-6 text-gray-900 dark:text-gray-100">
      <!-- 標題和新增按鈕 -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          勘查記錄
        </h2>
        <button
          @click="showAddModal = true"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
        >
          新增
        </button>
      </div>

      <!-- 勘查記錄資料表格 -->
      <div class="relative overflow-x-auto">
        <table
          class="w-full text-sm text-left border-collapse border border-gray-200 dark:border-gray-700"
        >
          <thead class="text-xs bg-yellow-100">
            <tr>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                初勘日
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                會勘日
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                法拍公告<br />
                (證物三)
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                998連結
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                物件照片<br />
                (證物四)
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                法拍記錄<br />
                (證物七)
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                標的物<br />
                (現場勘查)
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                收發文簿
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                流水帳
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="survey in surveyData"
              :key="survey.id"
              class="bg-white dark:bg-gray-800"
            >
              <!-- 初勘日 - 純文字顯示 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                {{ formatDate(survey.first_survey_date) }}
              </td>

              <!-- 會勘日 - 純文字顯示 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                {{ formatDate(survey.second_survey_date) }}
              </td>

              <!-- 法拍公告 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                <a
                  v-if="survey.announcement_url"
                  :href="survey.announcement_url"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    class="w-8 h-8 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </a>
              </td>

              <!-- 998連結 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                <a
                  v-if="survey.link_998_url"
                  :href="survey.link_998_url"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    class="w-8 h-8 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </a>
              </td>

              <!-- 物件照片 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                <a
                  v-if="survey.photos_url"
                  :href="survey.photos_url"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    class="w-8 h-8 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              </td>

              <!-- 法拍記錄 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                <a
                  v-if="survey.record_url"
                  :href="survey.record_url"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    class="w-8 h-8 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </a>
              </td>

              <!-- 標的物 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                <a
                  v-if="survey.site_survey_url"
                  :href="survey.site_survey_url"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    class="w-8 h-8 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </a>
              </td>

              <!-- 收發文簿 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                <a
                  v-if="survey.document_url"
                  :href="survey.document_url"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    class="w-8 h-8 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </a>
              </td>

              <!-- 流水帳 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                <a
                  v-if="survey.ledger_url"
                  :href="survey.ledger_url"
                  target="_blank"
                  class="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    class="w-8 h-8 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </a>
              </td>

              <!-- 操作按鈕 -->
              <td class="px-4 py-2 border border-gray-200 text-center">
                <button
                  @click="openEditModal(survey)"
                  class="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <svg
                    class="w-5 h-5 inline-block"
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
                </button>
                <button
                  @click="deleteSurvey(survey.id)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg
                    class="w-5 h-5 inline-block"
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 新增勘查記錄 Modal -->
      <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <!-- Modal 背景 -->
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <!-- Modal 內容 -->
          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                新增勘查記錄
              </h3>

              <!-- 表單內容 -->
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- 初勘日 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >初勘日</label
                  >
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                    >
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="first-survey-date-new"
                      v-model="newSurvey.first_survey_date"
                      class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                      placeholder="選擇日期"
                    />
                  </div>
                </div>

                <!-- 會勘日 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >會勘日</label
                  >
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                    >
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="second-survey-date-new"
                      v-model="newSurvey.second_survey_date"
                      class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                      placeholder="選擇日期"
                    />
                  </div>
                </div>

                <!-- URL 輸入欄位 -->
                <div v-for="field in urlFields" :key="field.name">
                  <label class="block text-sm font-medium text-gray-700">{{
                    field.label
                  }}</label>
                  <input
                    type="url"
                    v-model="newSurvey[field.name]"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :placeholder="'輸入' + field.label + ' URL'"
                  />
                </div>
              </form>
            </div>

            <!-- Modal 底部按鈕 -->
            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button
                @click="handleSubmit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                儲存
              </button>
              <button
                @click="showAddModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 編輯 Modal -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                編輯勘查記錄
              </h3>

              <form @submit.prevent="handleEdit" class="space-y-4">
                <!-- 初勘日 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >初勘日</label
                  >
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                    >
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="edit-first-survey-date"
                      v-model="editingSurvey.first_survey_date"
                      class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                      placeholder="選擇日期"
                    />
                  </div>
                </div>

                <!-- 會勘日 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >會勘日</label
                  >
                  <div class="relative">
                    <div
                      class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                    >
                      <svg
                        class="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="edit-second-survey-date"
                      v-model="editingSurvey.second_survey_date"
                      class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                      placeholder="選擇日期"
                    />
                  </div>
                </div>

                <!-- URL 輸入欄位 -->
                <div v-for="field in urlFields" :key="field.name">
                  <label class="block text-sm font-medium text-gray-700">{{
                    field.label
                  }}</label>
                  <input
                    type="url"
                    v-model="editingSurvey[field.name]"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :placeholder="'輸入' + field.label + ' URL'"
                  />
                </div>
              </form>
            </div>

            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <button
                @click="handleEdit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                儲存
              </button>
              <button
                @click="showEditModal = false"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import Datepicker from 'flowbite-datepicker/Datepicker';
import { supabase } from '../../supabase';

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
});

const surveyData = ref([]);
const isLoading = ref(false);
const showAddModal = ref(false);
const newSurvey = ref({
  first_survey_date: '',
  second_survey_date: '',
  announcement_url: '',
  link_998_url: '',
  photos_url: '',
  record_url: '',
  site_survey_url: '',
  document_url: '',
  ledger_url: '',
});

// URL 欄位設定
const urlFields = [
  { name: 'announcement_url', label: '法拍公告(證物三)' },
  { name: 'link_998_url', label: '998連結' },
  { name: 'photos_url', label: '物件照片(證物四)' },
  { name: 'record_url', label: '法拍記錄(證物七)' },
  { name: 'site_survey_url', label: '標的物(現場勘查)' },
  { name: 'document_url', label: '收發文簿' },
  { name: 'ledger_url', label: '流水帳' },
];

// 載入勘查記錄資料
const fetchSurveyData = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('case_id', props.caseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    surveyData.value = data || [];
  } catch (error) {
    console.error('Error fetching survey data:', error);
  } finally {
    isLoading.value = false;
  }
};

// 初始化日期選擇器
const initDatepickers = (survey) => {
  // 初始化第一個日期選擇器
  const firstDateEl = document.getElementById(`first-survey-date-${survey.id}`);
  if (firstDateEl) {
    const firstDatepicker = new Datepicker(firstDateEl, {
      format: 'yyyy/mm/dd',
      autohide: true,
      todayHighlight: true,
      language: 'zh-TW',
    });

    firstDateEl.addEventListener('changeDate', async (e) => {
      try {
        const { error } = await supabase
          .from('surveys')
          .update({ first_survey_date: e.target.value })
          .eq('id', survey.id);

        if (error) throw error;
        await fetchSurveyData();
      } catch (error) {
        console.error('Error updating date:', error);
      }
    });
  }

  // 初始化第二個日期選擇器
  const secondDateEl = document.getElementById(
    `second-survey-date-${survey.id}`,
  );
  if (secondDateEl) {
    const secondDatepicker = new Datepicker(secondDateEl, {
      format: 'yyyy/mm/dd',
      autohide: true,
      todayHighlight: true,
      language: 'zh-TW',
    });

    secondDateEl.addEventListener('changeDate', async (e) => {
      try {
        const { error } = await supabase
          .from('surveys')
          .update({ second_survey_date: e.target.value })
          .eq('id', survey.id);

        if (error) throw error;
        await fetchSurveyData();
      } catch (error) {
        console.error('Error updating date:', error);
      }
    });
  }
};

// 格式化日期顯示
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// 初始載入資料
onMounted(async () => {
  await fetchSurveyData();
  // 如果沒有資料，創建一條新記錄
  if (surveyData.value.length === 0) {
    try {
      const { error } = await supabase
        .from('surveys')
        .insert([{ case_id: props.caseId }]);

      if (error) throw error;
      await fetchSurveyData();
    } catch (error) {
      console.error('Error creating survey record:', error);
    }
  }
  // 為每條記錄初始化日期選擇器
  surveyData.value.forEach((survey) => {
    initDatepickers(survey);
  });
});

let firstNewDatepicker = null;
let secondNewDatepicker = null;

// 初始化新增表單的日期選擇器
const initNewDatepickers = () => {
  const firstDateEl = document.getElementById('first-survey-date-new');
  const secondDateEl = document.getElementById('second-survey-date-new');

  if (firstDateEl) {
    firstNewDatepicker = new Datepicker(firstDateEl, {
      format: 'yyyy/mm/dd',
      autohide: true,
      todayHighlight: true,
      language: 'zh-TW',
    });

    firstDateEl.addEventListener('changeDate', (e) => {
      newSurvey.value.first_survey_date = formatDateForDB(e.target.value);
    });
  }

  if (secondDateEl) {
    secondNewDatepicker = new Datepicker(secondDateEl, {
      format: 'yyyy/mm/dd',
      autohide: true,
      todayHighlight: true,
      language: 'zh-TW',
    });

    secondDateEl.addEventListener('changeDate', (e) => {
      newSurvey.value.second_survey_date = formatDateForDB(e.target.value);
    });
  }
};

// 格式化日期為資料庫格式 (YYYY-MM-DD)
const formatDateForDB = (dateStr) => {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

// 處理表單提交
const handleSubmit = async () => {
  try {
    // 準備要插入的數據
    const surveyData = {
      case_id: props.caseId,
      ...newSurvey.value,
    };

    // 如果日期為空字串，設為 null
    if (!surveyData.first_survey_date) {
      surveyData.first_survey_date = null;
    }
    if (!surveyData.second_survey_date) {
      surveyData.second_survey_date = null;
    }

    const { error } = await supabase.from('surveys').insert([surveyData]);

    if (error) throw error;

    showAddModal.value = false;
    await fetchSurveyData();

    // 清理日期選擇器
    if (firstNewDatepicker) {
      firstNewDatepicker.destroy();
      firstNewDatepicker = null;
    }
    if (secondNewDatepicker) {
      secondNewDatepicker.destroy();
      secondNewDatepicker = null;
    }

    // 重置表單
    newSurvey.value = {
      first_survey_date: '',
      second_survey_date: '',
      announcement_url: '',
      link_998_url: '',
      photos_url: '',
      record_url: '',
      site_survey_url: '',
      document_url: '',
      ledger_url: '',
    };
  } catch (error) {
    console.error('Error adding survey:', error);
    alert('新增失敗：' + error.message);
  }
};

// 監聽 Modal 開啟和關閉
watch(showAddModal, (newVal) => {
  if (newVal) {
    nextTick(() => {
      initNewDatepickers();
    });
  } else {
    // Modal 關閉時清理日期選擇器
    if (firstNewDatepicker) {
      firstNewDatepicker.destroy();
      firstNewDatepicker = null;
    }
    if (secondNewDatepicker) {
      secondNewDatepicker.destroy();
      secondNewDatepicker = null;
    }
  }
});

// 組件卸載時清理
onUnmounted(() => {
  if (firstNewDatepicker) {
    firstNewDatepicker.destroy();
  }
  if (secondNewDatepicker) {
    secondNewDatepicker.destroy();
  }
});

const showEditModal = ref(false);
const editingSurvey = ref({});
let editFirstDatepicker = null;
let editSecondDatepicker = null;

// 打開編輯 Modal
const openEditModal = (survey) => {
  editingSurvey.value = { ...survey };
  showEditModal.value = true;
  nextTick(() => {
    initEditDatepickers();
  });
};

// 初始化編輯表單的日期選擇器
const initEditDatepickers = () => {
  const firstDateEl = document.getElementById('edit-first-survey-date');
  const secondDateEl = document.getElementById('edit-second-survey-date');

  if (firstDateEl) {
    editFirstDatepicker = new Datepicker(firstDateEl, {
      format: 'yyyy/mm/dd',
      autohide: true,
      todayHighlight: true,
      language: 'zh-TW',
    });

    firstDateEl.addEventListener('changeDate', (e) => {
      editingSurvey.value.first_survey_date = formatDateForDB(e.target.value);
    });
  }

  if (secondDateEl) {
    editSecondDatepicker = new Datepicker(secondDateEl, {
      format: 'yyyy/mm/dd',
      autohide: true,
      todayHighlight: true,
      language: 'zh-TW',
    });

    secondDateEl.addEventListener('changeDate', (e) => {
      editingSurvey.value.second_survey_date = formatDateForDB(e.target.value);
    });
  }
};

// 處理編輯提交
const handleEdit = async () => {
  try {
    const { error } = await supabase
      .from('surveys')
      .update({
        first_survey_date: editingSurvey.value.first_survey_date,
        second_survey_date: editingSurvey.value.second_survey_date,
        announcement_url: editingSurvey.value.announcement_url,
        link_998_url: editingSurvey.value.link_998_url,
        photos_url: editingSurvey.value.photos_url,
        record_url: editingSurvey.value.record_url,
        site_survey_url: editingSurvey.value.site_survey_url,
        document_url: editingSurvey.value.document_url,
        ledger_url: editingSurvey.value.ledger_url,
      })
      .eq('id', editingSurvey.value.id);

    if (error) throw error;

    showEditModal.value = false;
    await fetchSurveyData();

    // 清理日期選擇器
    if (editFirstDatepicker) {
      editFirstDatepicker.destroy();
      editFirstDatepicker = null;
    }
    if (editSecondDatepicker) {
      editSecondDatepicker.destroy();
      editSecondDatepicker = null;
    }
  } catch (error) {
    console.error('Error updating survey:', error);
    alert('更新失敗：' + error.message);
  }
};

// 刪除記錄
const deleteSurvey = async (id) => {
  if (!confirm('確定要刪除這筆記錄嗎？')) return;

  try {
    const { error } = await supabase.from('surveys').delete().eq('id', id);

    if (error) throw error;

    await fetchSurveyData();
  } catch (error) {
    console.error('Error deleting survey:', error);
    alert('刪除失敗：' + error.message);
  }
};

// 組件卸載時清理
onUnmounted(() => {
  if (editFirstDatepicker) {
    editFirstDatepicker.destroy();
  }
  if (editSecondDatepicker) {
    editSecondDatepicker.destroy();
  }
});
</script>

<style scoped>
.border-collapse {
  border-collapse: collapse;
}

td,
th {
  white-space: nowrap;
}

.bg-yellow-100 {
  background-color: #fef9c3;
}

button {
  transition: all 0.2s;
}

button:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

/* 日期選擇器輸入框樣式 */
input[type='text'] {
  width: 130px;
}

/* 日期選擇器下拉框樣式 */
.datepicker-dropdown {
  z-index: 100;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

td {
  vertical-align: middle;
}
</style>
