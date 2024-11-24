<template>
  <div
    class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-6"
  >
    <div class="p-6 text-gray-900 dark:text-gray-100">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center space-x-4">
          <h2 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            拍賣資訊
          </h2>
          <button
            @click="showAddModal = true"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
          >
            新增
          </button>
        </div>
      </div>

      <!-- 拍賣資料表格 -->
      <div class="relative overflow-x-auto">
        <table
          class="w-full text-sm text-left border-collapse border border-gray-200 dark:border-gray-700"
        >
          <thead class="text-xs bg-gray-100">
            <tr>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                拍賣日
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                拍別-進場判定<br />
                (可進場CP值)
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                底價(NT)<br />
                各拍進場底價
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                坪價(NT)<br />
                時價：256,832元
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">CP</th>
              <th scope="col" class="px-4 py-2 border border-gray-200">點閱</th>
              <th scope="col" class="px-4 py-2 border border-gray-200">監控</th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                成交件數
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                件數參考加價
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">
                保證金
              </th>
              <th scope="col" class="px-4 py-2 border border-gray-200">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="auction in auctionData"
              :key="auction.id"
              class="bg-white dark:bg-gray-800"
            >
              <td class="px-4 py-2 border border-gray-200">
                <template v-if="editingId === auction.id">
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
                      :id="'date-' + auction.id"
                      type="text"
                      class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5"
                      placeholder="選擇日期"
                      autocomplete="off"
                    />
                  </div>
                </template>
                <template v-else>
                  <span class="text-blue-600">{{
                    formatDate(auction.auction_date)
                  }}</span>
                </template>
              </td>
              <td class="px-4 py-2 border border-gray-200 bg-yellow-100">
                <template v-if="editingId === auction.id">
                  <select
                    v-model="editingData.auction_type"
                    class="w-full px-2 py-1 border rounded bg-white"
                  >
                    <option
                      v-for="option in auctionTypeOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </template>
                <template v-else>
                  {{ auction.auction_type }}(CP>{{ auction.cp_value }})
                </template>
              </td>
              <td class="px-4 py-2 border border-gray-200 text-right">
                <template v-if="editingId === auction.id">
                  <input
                    v-model="editingData.base_price"
                    @input="formatCurrency('base_price')"
                    type="text"
                    class="w-full px-2 py-1 border rounded text-right"
                  />
                </template>
                <template v-else>
                  {{ formatNumber(auction.base_price) }}
                </template>
              </td>
              <td class="px-4 py-2 border border-gray-200 text-right">
                {{ calculateSquarePrice(auction.base_price) }}
              </td>
              <td class="px-4 py-2 border border-gray-200 text-center">
                {{ auction.cp_value }}
              </td>
              <td class="px-4 py-2 border border-gray-200 text-center">0</td>
              <td class="px-4 py-2 border border-gray-200 text-center">0</td>
              <td class="px-4 py-2 border border-gray-200 text-center">
                <template v-if="editingId === auction.id">
                  <input
                    v-model="editingData.deal_count"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full px-2 py-1 border rounded text-center"
                  />
                </template>
                <template v-else>
                  {{ auction.deal_count }}
                </template>
              </td>
              <td class="px-4 py-2 border border-gray-200"></td>
              <td class="px-4 py-2 border border-gray-200 text-right">
                <template v-if="editingId === auction.id">
                  <input
                    v-model="editingData.deposit"
                    @input="formatCurrency('deposit')"
                    type="text"
                    class="w-full px-2 py-1 border rounded text-right"
                  />
                </template>
                <template v-else>
                  {{ formatNumber(auction.deposit) }}
                </template>
              </td>
              <td class="px-4 py-2 border border-gray-200">
                <div class="flex space-x-2">
                  <template v-if="editingId === auction.id">
                    <button
                      @click="handleSave(auction.id)"
                      class="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                    >
                      儲存
                    </button>
                    <button
                      @click="cancelEdit"
                      class="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                    >
                      取消
                    </button>
                  </template>
                  <template v-else>
                    <button
                      @click="startEdit(auction)"
                      class="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      修改
                    </button>
                    <button
                      @click="handleDelete(auction.id)"
                      class="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
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

      <!-- 說明文字 -->
      <div class="mt-4 text-sm text-gray-600">
        <p>
          成交件數：比較物件定義直徑2.5公里內/屋齡相近(10年)/最近一年成交件數
        </p>
        <p>a=底價*(1+成交件數/4.5/100)</p>
        <p>b=底價*((時價/坪價)/1.6)</p>
        <p>最多不得低於1.6(若a > b,以b加加價依據，反之，則為a)</p>
      </div>

      <!-- 新增拍賣 Modal -->
      <AddAuctionModal
        v-if="showAddModal"
        v-model:show="showAddModal"
        :case-id="caseId"
        @created="handleAuctionCreated"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { supabase } from '../../supabase';
import AddAuctionModal from '../../components/AddAuctionModal.vue';
import { auctionTypeOptions } from '../../utils/auctionOptions';
import Datepicker from 'flowbite-datepicker/Datepicker';

const props = defineProps({
  caseId: {
    type: String,
    required: true,
  },
});

const auctionData = ref([]);
const buildsData = ref([]);
const showAddModal = ref(false);
const isLoading = ref(false);
const editingId = ref(null);
const editingData = ref({});
let currentDatepicker = null;

// 計算所有建物的總持分面積
const totalShareArea = computed(() => {
  return buildsData.value.reduce((sum, build) => {
    // 使用 calculated_share_area（計算後的持分面積）
    return sum + Number(build.calculated_share_area || 0);
  }, 0);
});

// 格式化數字
const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-TW').format(Number(num));
};

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-TW');
};

// 計算坪價
const calculateSquarePrice = (basePrice) => {
  if (!totalShareArea.value) return 0;
  // 將平方公尺轉換為坪 (1坪 = 3.30578平方公尺)
  const totalPing = totalShareArea.value / 3.30578;
  // 計算坪價
  return formatNumber(Math.round(Number(basePrice) / totalPing));
};

// 載入拍賣資料
const fetchAuctionData = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .eq('case_id', props.caseId)
      .order('auction_date', { ascending: true });

    if (error) throw error;
    auctionData.value = data || [];
  } catch (error) {
    console.error('Error fetching auction data:', error);
    alert('載入資料失敗：' + error.message);
  } finally {
    isLoading.value = false;
  }
};

// 載入建物資料
const fetchBuildsData = async () => {
  try {
    const { data, error } = await supabase
      .from('builds')
      .select('*')
      .eq('case_id', props.caseId);

    if (error) throw error;
    buildsData.value = data || [];
  } catch (error) {
    console.error('Error fetching builds data:', error);
  }
};

// 處理刪除
const handleDelete = async (id) => {
  if (!confirm('確定要刪除這筆資料嗎？')) return;

  try {
    const { error } = await supabase.from('auctions').delete().eq('id', id);

    if (error) throw error;
    await fetchAuctionData();
    alert('刪除成功！');
  } catch (error) {
    console.error('Error deleting auction:', error);
    alert('刪除失敗：' + error.message);
  }
};

// 處理新增拍賣後的回調
const handleAuctionCreated = async () => {
  await fetchAuctionData();
};

// 開始編輯
const startEdit = async (auction) => {
  editingId.value = auction.id;
  editingData.value = { ...auction };

  // 等待 DOM 更新
  await nextTick();

  // 初始化日期選擇器
  const dateEl = document.getElementById('date-' + auction.id);
  if (dateEl) {
    // 設置初始日期值
    dateEl.value = formatDateForInput(auction.auction_date);

    // 初始化 Datepicker
    currentDatepicker = new Datepicker(dateEl, {
      format: 'yyyy-mm-dd',
      autohide: true,
      todayHighlight: true,
      language: 'zh-TW',
    });

    // 監聽日期變更
    dateEl.addEventListener('changeDate', (e) => {
      editingData.value.auction_date = e.target.value;
    });
  }
};

// 格式化日期為 input 格式 (YYYY-MM-DD)
const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 取消編輯
const cancelEdit = () => {
  if (currentDatepicker) {
    currentDatepicker.destroy();
    currentDatepicker = null;
  }
  editingId.value = null;
  editingData.value = {};
};

// 格式化貨幣輸入
const formatCurrency = (field) => {
  let value = editingData.value[field].toString().replace(/\D/g, '');
  editingData.value[field] = new Intl.NumberFormat('zh-TW').format(value);
};

// 儲存修改
const handleSave = async (id) => {
  try {
    // 準備更新的資料
    const updateData = {
      auction_date: editingData.value.auction_date,
      auction_type: editingData.value.auction_type,
      cp_value: auctionTypeOptions.find(
        (opt) => opt.value === editingData.value.auction_type,
      )?.cp,
      base_price: parseInt(
        editingData.value.base_price.toString().replace(/\D/g, ''),
      ),
      deal_count: parseInt(editingData.value.deal_count),
      deposit: parseInt(
        editingData.value.deposit.toString().replace(/\D/g, ''),
      ),
    };

    const { error } = await supabase
      .from('auctions')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    // 重新載入資料
    await fetchAuctionData();

    // 結束編輯狀態
    cancelEdit();

    alert('更新成功！');
  } catch (error) {
    console.error('Error updating auction:', error);
    alert('更新失敗：' + error.message);
  }
};

// 初始載入資料
onMounted(async () => {
  await Promise.all([fetchAuctionData(), fetchBuildsData()]);
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

/* 添加 Datepicker 相關樣式 */
.datepicker {
  z-index: 1000;
}

.datepicker-dropdown {
  padding: 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.datepicker-cell.selected {
  background-color: #3b82f6 !important;
  color: white !important;
}

.datepicker-cell:hover {
  background-color: #e5e7eb;
}
</style>
