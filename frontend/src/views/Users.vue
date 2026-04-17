<script setup>
import Swal from "sweetalert2";
import { computed, onMounted, ref } from "vue";
import axios from "../api/axios";
import UserModal from "../components/UserModal.vue";

const users = ref([]);
const pagination = ref({
  current_page: 1,
  total: 0,
  per_page: 20,
  from: 0,
  to: 0,
});
const loading = ref(true);
const search = ref("");
const pageDefault = ref(1);
const limit = 5;
const selected = ref([]);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await axios.get("/users", {
      params: { page: pageDefault.value, limit },
    });

    users.value = res.data?.data || [];
    pagination.value = res.data?.pagination || {};

    console.log("Users loaded:", users.value.length);
  } catch (error) {
    console.error("Lỗi tải users:", error);
    users.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);

// Computed
const totalPages = computed(
  () => Math.ceil(pagination.value.total / pagination.value.per_page) || 1,
);

const filtered = computed(() => {
  if (!search.value) return users.value;
  const query = search.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.email?.toLowerCase().includes(query) ||
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query),
  );
});

// CheckAll
const toggleAll = (e) => {
  selected.value = e.target.checked
    ? filtered.value.map((user) => user.id)
    : [];
};

// Initials user
const initials = (user) => {
  const fistName = user.first_name?.[0] ?? "";
  const lastName = user.last_name?.[0] ?? "";
  return (fistName + lastName).toUpperCase() || user.email[0].toUpperCase();
};

// Avatar
const avatarColor = (id) => {
  const colors = [
    "bg-blue-400",
    "bg-purple-400",
    "bg-green-400",
    "bg-orange-400",
    "bg-pink-400",
    "bg-teal-400",
  ];
  return colors[id % colors.length];
};

// Format Date
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "—";

// MODAL
const showModal = ref(false);
const isEdit = ref(false);
const currentUser = ref(null);

// Open Modal
const openCreate = () => {
  isEdit.value = false;
  currentUser.value = null;
  showModal.value = true;
};

const openEdit = (user) => {
  isEdit.value = true;
  currentUser.value = user;
  showModal.value = true;
};

// Save
const handleSave = async (formData) => {
  try {
    if (isEdit.value) {
      await axios.put(`/users/${currentUser.value.id}`, formData);
      Swal.fire("Thành công", "Cập nhật user thành công!", "success");
    } else {
      await axios.post("/users", formData);
      Swal.fire("Thành công", "Tạo user mới thành công!", "success");
    }

    showModal.value = false;
    fetchUsers();
  } catch (error) {
    Swal.fire("Lỗi", error.response?.data?.message || "Có lỗi xảy ra", "error");
  }
};

// Delete user
const deleteUser = async (id) => {
  const result = await Swal.fire({
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Hành động này không thể hoàn tác!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  });

  if (!result.isConfirmed) return;

  try {
    await axios.delete(`/users/${id}`);
    Swal.fire("Đã xóa!", "Người dùng đã được xóa thành công.", "success");
    fetchUsers();
  } catch (error) {
    Swal.fire(
      "Lỗi",
      error.response?.data?.message || "Không thể xóa user này",
      "error",
    );
  }
};

// Pagination
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  pageDefault.value = page;
  fetchUsers();
};

const nextPage = () => goToPage(pageDefault.value + 1);
const prevPage = () => goToPage(pageDefault.value - 1);
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-800">Users Management</h1>
        <p class="text-sm text-gray-400 mt-0.5">
          Quản lý thành viên trong hệ thống
        </p>
      </div>
      <button
        class="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition active:scale-95"
        @click="openCreate"
      >
        <span class="text-base leading-none"
          ><i class="fa-solid fa-plus"></i
        ></span>
        Thêm user
      </button>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <!-- Toolbar -->
      <div
        class="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100"
      >
        <!-- Search -->
        <div class="relative flex-1 min-w-[180px] max-w-xs">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            ><i class="fa-solid fa-magnifying-glass"></i
          ></span>
          <input
            v-model="search"
            placeholder="Tìm theo tên, email..."
            class="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <!-- Bulk action info -->
        <span
          v-if="selected.length"
          class="text-sm text-orange-600 font-medium"
        >
          {{ selected.length }} đã chọn
        </span>

        <!-- Refresh -->
        <button
          @click="fetchUsers"
          class="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
        >
          <i class="fa-solid fa-arrows-rotate"></i> Làm mới
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide"
            >
              <th class="w-10 px-4 py-3">
                <input type="checkbox" @change="toggleAll" class="rounded" />
              </th>
              <th class="px-4 py-3 text-left">Người dùng</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Trạng thái</th>
              <th class="px-4 py-3 text-left">Ngày tạo</th>
              <th class="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="5" class="text-center py-12 text-gray-400">
                <div
                  class="inline-block w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mb-2"
                ></div>
                <div class="text-sm">Đang tải...</div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else-if="filtered.length === 0">
              <td colspan="5" class="text-center py-12 text-gray-400 text-sm">
                Không tìm thấy người dùng nào
              </td>
            </tr>

            <!-- Rows -->
            <tr
              v-else
              v-for="user in filtered"
              :key="user.id"
              class="border-b border-gray-50 hover:bg-gray-50 transition group"
            >
              <!-- Checkbox -->
              <td class="px-4 py-3">
                <input
                  type="checkbox"
                  :value="user.id"
                  v-model="selected"
                  class="rounded"
                />
              </td>

              <!-- Avatar + Name/Email -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    :class="`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${avatarColor(user.id)}`"
                  >
                    {{ initials(user) }}
                  </div>
                  <div>
                    <div class="font-medium">
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="px-6 py-4">
                <span
                  :class="
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  "
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ user.role === "admin" ? "Quản trị viên" : "Người dùng" }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  :class="
                    user.verified_at
                      ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                  "
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="user.verified_at ? 'bg-green-500' : 'bg-yellow-400'"
                  ></span>
                  {{ user.verified_at ? "Đã xác thực" : "Chờ xác thực" }}
                </span>
              </td>

              <!-- Created at -->
              <td class="px-4 py-3 text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <button
                  @click="openEdit(user)"
                  class="text-blue-600 hover:text-blue-700 px-3 py-2"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button
                  @click="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-700 px-3 py-2"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500"
      >
        <div>
          Hiển thị
          <span class="font-medium text-gray-800">
            {{ pagination.from }} - {{ pagination.to }}
          </span>
          trong tổng
          <span class="font-medium text-gray-800">{{ pagination.total }}</span>
          users
        </div>

        <div class="flex items-center gap-1">
          <button
            @click="goToPage(pageDefault - 1)"
            :disabled="pageDefault === 1"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ‹
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition"
            :class="
              page === pageDefault
                ? 'bg-orange-500 text-white'
                : 'hover:bg-gray-100 text-gray-600'
            "
          >
            {{ page }}
          </button>

          <button
            @click="goToPage(pageDefault + 1)"
            :disabled="pageDefault === totalPages"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            ›
          </button>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <UserModal
      :show="showModal"
      :is-edit="isEdit"
      :user="currentUser"
      @close="showModal = false"
      @save="handleSave"
    />
  </div>
</template>
