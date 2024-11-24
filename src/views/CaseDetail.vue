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

      <!-- 基本資料組件 -->
      <BaseData
        v-if="caseData"
        v-model:caseData="caseData"
        @update:caseData="handleDataUpdate"
      />

      <!-- 土地資料組件 -->
      <Land v-if="caseData" :case-id="route.params.id" />

      <!-- 建物資料組件 -->
      <Build v-if="caseData" :case-id="route.params.id" />

      <!-- 拍賣資料組件 -->
      <Auction v-if="caseData" :case-id="route.params.id" />

      <!-- 勘查報告 -->
      <Survey v-if="caseData" :case-id="route.params.id" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';
import BaseData from './subCaseTemplates/BaseData.vue';
import Land from './subCaseTemplates/Land.vue';
import Build from './subCaseTemplates/Build.vue';
import Auction from './subCaseTemplates/Auction.vue';
import Survey from './subCaseTemplates/Survey.vue';

const route = useRoute();
const caseData = ref(null);
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

// 處理資料更新
const handleDataUpdate = async () => {
  await fetchCaseDetail();
};

onMounted(() => {
  fetchCaseDetail();
});
</script>
