<template>
  <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
    >
      <div class="flex items-center gap-2 flex-1">
        <div class="relative w-full max-w-sm">
          <span
            class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"
          >
            <SearchIcon class="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            class="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <select
          class="rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Tất cả vai trò</option>
          <option v-for="role in roles" :key="role">{{ role }}</option>
        </select>
      </div>
      <button
        @click="$emit('add-user')"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        + Thêm mới
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              User
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Vai trò
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Trạng thái
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ngày tạo
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold"
                >
                  <!-- {{ user.avatar }} -->
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="
                  user.status === 'Active'
                    ? 'text-green-700 bg-green-50'
                    : 'text-red-700 bg-red-50'
                "
                class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="
                    user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'
                  "
                ></span>
                {{ user.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.createdAt }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <button
                @click="$emit('view-user', user)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                Xem
              </button>
              <button
                @click="$emit('edit-user', user)"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Sửa
              </button>
              <button
                @click="$emit('delete-user', user)"
                class="text-red-600 hover:text-red-900"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../api/axios";

const users = ref([]);
const input = ref("");
console.log(users);

// ===== FETCH =====
const fetchUser = async () => {
  const res = await axios.get("/users");

  console.log(res);

  users.value = res.data.data.map((user) => ({
    ...user,
  }));
};

console.log(users);

// onMounted(fetchUser);
</script>
