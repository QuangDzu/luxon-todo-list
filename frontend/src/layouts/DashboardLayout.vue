<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const menuItems = [
  {
    label: "Dashboard",
    icon: "fa-regular fa-chart-bar",
    to: "/dashboard",
  },
  { label: "Users", icon: "fa-solid fa-users", to: "/users" },
  { label: "Tasks", icon: "fa-solid fa-clipboard-check", to: "/tasks" },
];

const sidebarOpen = ref(true);

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

// Lấy tên user
const getUsername = () => {
  try {
    const token = localStorage.getItem("token");
    // const payload = JSON.parse(atob(token.split(".")[1]));
    // console.log(payload);

    return payload.email ?? "User";
  } catch {
    return "User";
  }
};

onMounted(fetchUsers);

console.log(getUsername());
</script>

<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- SIDEBAR -->
    <aside
      class="flex flex-col bg-white border-r border-gray-100 transition-all duration-300"
      :class="sidebarOpen ? 'w-56' : 'w-16'"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div
          class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
        >
          T
        </div>
        <span v-if="sidebarOpen" class="font-semibold text-gray-800 truncate"
          >TodoApp</span
        >
      </div>

      <!-- Menu -->
      <nav class="flex-1 py-4 space-y-1 px-2">
        <router-link
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="
            route.path === item.to
              ? 'bg-orange-50 text-orange-600'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
          "
        >
          <span class="text-base flex-shrink-0"
            ><i :class="item.icon" class="text-xl"></i
          ></span>
          <span v-if="sidebarOpen" class="truncate">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Toggle collapse -->
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="mx-2 mb-4 p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition text-xs"
      >
        <i v-if="sidebarOpen" class="fa-solid fa-caret-left"></i>
        <i v-else class="fa-solid fa-caret-right"></i>

        <!-- Text -->
        <span>{{ sidebarOpen ? "Thu gọn" : "" }}</span>
      </button>
    </aside>

    <!-- MAIN -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- HEADER -->
      <header
        class="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4"
      >
        <!-- Search -->
        <div class="flex-1 max-w-md relative">
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            ><i class="fa-solid fa-magnifying-glass"></i
          ></span>
          <input
            placeholder="Tìm kiếm..."
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>

        <div class="flex items-center gap-3 ml-auto">
          <!-- Bell -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 transition relative"
          >
            <i class="fa-regular fa-bell"></i>
            <span
              class="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"
            ></span>
          </button>

          <!-- Help -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-500 transition"
          >
            <i class="fa-solid fa-question"></i>
          </button>

          <!-- Avatar + logout -->
          <div class="flex items-center gap-2 pl-3 border-l border-gray-100">
            <div
              class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase"
            >
              {{ getUsername().charAt(0) }}
            </div>
            <span
              class="text-sm text-gray-700 font-medium hidden sm:block max-w-[120px] truncate"
            >
              {{ getUsername() }}
            </span>
            <button
              @click="logout"
              class="text-xs text-gray-400 hover:text-red-500 transition ml-1"
              title="Đăng xuất"
            >
              <i class="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- PAGE CONTENT -->
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
