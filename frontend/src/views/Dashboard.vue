<script setup>
import { onMounted, ref } from "vue";
import axios from "../api/axios";

const stats = ref({ total: 0, newToday: 0, newYesterday: 0 });
const tasks = ref({ total: 0, done: 0, pending: 0 });
const loading = ref(true);

onMounted(async () => {
  try {
    const [userStats, taskStats] = await Promise.all([
      axios
        .get("/users/stats")
        .catch(() => ({
          data: { data: { total: 124, newToday: 8, newYesterday: 15 } },
        })),
      axios
        .get("/tasks/stats")
        .catch(() => ({
          data: { data: { total: 47, done: 32, pending: 15 } },
        })),
    ]);
    stats.value = userStats.data.data;
    tasks.value = taskStats.data.data;
  } catch {
    console.log("Chưa cóa API");
  } finally {
    loading.value = false;
  }
});

const cards = [
  {
    label: "Tổng users",
    key: "total",
    icon: "fa-solid fa-users",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    label: "User mới hôm nay",
    key: "newToday",
    icon: "fa-solid fa-user-plus",
    color: "bg-green-50  text-green-600",
    border: "border-green-100",
  },
  {
    label: "Tổng tasks",
    key: "taskTotal",
    icon: "fa-solid fa-clipboard-check",
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
  },
  {
    label: "Tasks hoàn thành",
    key: "taskDone",
    icon: "fa-solid fa-square-check",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
];

const getValue = (key) => {
  if (key === "taskTotal") return tasks.value.total;
  if (key === "taskDone") return tasks.value.done;
  return stats.value[key] ?? 0;
};
</script>

<template>
  <div>
    <!-- Page title -->
    <div class="mb-6">
      <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
      <p class="text-sm text-gray-400 mt-0.5">Tổng quan hệ thống</p>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="card in cards"
        :key="card.key"
        class="bg-white rounded-2xl border p-5 flex items-center gap-4"
        :class="card.border"
      >
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          :class="card.color"
        >
          <i :class="card.icon"></i>
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-800">
            <span v-if="loading">—</span>
            <span v-else>{{ getValue(card.key) }}</span>
          </div>
          <div class="text-xs text-gray-400 mt-0.5">{{ card.label }}</div>
        </div>
      </div>
    </div>

    <!-- Task progress -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
      <h2 class="text-sm font-semibold text-gray-700 mb-4">Tiến độ tasks</h2>
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Hoàn thành</span>
            <span>{{ tasks.done }} / {{ tasks.total }}</span>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-2 bg-orange-500 rounded-full transition-all duration-700"
              :style="{
                width: tasks.total
                  ? (tasks.done / tasks.total) * 100 + '%'
                  : '0%',
              }"
            />
          </div>
        </div>
        <div class="flex gap-4 text-xs text-gray-400 pt-1">
          <span class="flex items-center gap-1"
            ><span
              class="w-2 h-2 rounded-full bg-orange-500 inline-block"
            ></span>
            Done: {{ tasks.done }}</span
          >
          <span class="flex items-center gap-1"
            ><span class="w-2 h-2 rounded-full bg-gray-200 inline-block"></span>
            Pending: {{ tasks.pending }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
