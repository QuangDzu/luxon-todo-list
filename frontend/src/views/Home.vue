<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "../api/axios";

const tasks = ref([]);
const input = ref("");

// ===== FETCH =====
const fetchTasks = async () => {
  const res = await axios.get("/tasks");

  console.log(res);

  tasks.value = res.data.data.map((task) => ({
    ...task,
    done: task.done === "true",
  }));
};

// ===== ADD =====
const addTask = async () => {
  if (!input.value.trim()) return;
  await axios.post("/tasks", { text: input.value });
  input.value = "";
  fetchTasks();
};

// ===== EDIT =====
const editingId = ref(null);
const editingText = ref("");

const startEdit = (task) => {
  if (task.done) return; // không cho sửa task đã hoàn thành
  editingId.value = task.id;
  editingText.value = task.text;
};

const confirmEdit = async (task) => {
  if (!editingText.value.trim() || editingText.value === task.text) {
    cancelEdit();
    return;
  }
  await axios.put(`/tasks/${task.id}`, { text: editingText.value });
  cancelEdit();
  fetchTasks();
};

const cancelEdit = () => {
  editingId.value = null;
  editingText.value = "";
};

// ===== TOGGLE =====
const toggleTask = async (task) => {
  await axios.patch(`/tasks/${task.id}/toggle`);
  fetchTasks();
};

// ===== DELETE =====
const deleteTask = async (id) => {
  await axios.delete(`/tasks/${id}`);
  fetchTasks();
};

// ===== COMPUTED =====
const doneCount = computed(() => tasks.value.filter((t) => t.done).length);
const progress = computed(() =>
  tasks.value.length ? (doneCount.value / tasks.value.length) * 100 : 0,
);

onMounted(fetchTasks);

const vFocus = {
  mounted: (el) => el.focus(),
};
</script>

<template>
  <div class="min-h-screen bg-orange-50 p-6">
    <div
      class="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden"
    >
      <!-- HEADER -->
      <div class="bg-orange-500 text-white p-6">
        <h1 class="text-2xl font-bold">Chào QUANGDZU 👋</h1>
        <p class="text-sm opacity-80">Hôm nay bạn đã làm gì?</p>

        <!-- PROGRESS -->
        <div class="mt-4">
          <div class="flex justify-between text-xs mb-1">
            <span>Tiến độ</span>
            <span>{{ Math.round(progress) }}%</span>
          </div>
          <div class="bg-orange-300 h-2 rounded-full">
            <div
              class="bg-white h-2 rounded-full transition-all"
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- ADD TASK -->
      <div class="p-4 border-b">
        <div class="flex gap-2">
          <input
            v-model="input"
            @keydown.enter="addTask"
            placeholder="Thêm công việc..."
            class="flex-1 border rounded-xl px-3 py-2 focus:outline-orange-400"
          />
          <button
            @click="addTask"
            class="bg-orange-500 text-white px-4 rounded-xl hover:bg-orange-600"
          >
            Add
          </button>
        </div>
      </div>

      <!-- TASK LIST -->
      <div class="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="flex items-center p-4 rounded-2xl border transition group"
          :class="
            task.done
              ? 'bg-gray-50 border-gray-100'
              : 'bg-white hover:border-orange-200'
          "
        >
          <!-- CHECK -->
          <button @click="toggleTask(task)">
            <span v-if="task.done">✅</span>
            <span v-else>⭕</span>
          </button>

          <!-- TEXT -->
          <span
            v-if="editingId !== task.id"
            class="ml-3 flex-1 text-sm cursor-text"
            :class="task.done ? 'line-through text-gray-400' : 'text-gray-700'"
            @dblclick="startEdit(task)"
            :title="task.done ? '' : 'Double click để sửa'"
          >
            {{ task.text }}
          </span>

          <!-- INPUT EDIT -->
          <input
            v-else
            v-model="editingText"
            class="ml-3 flex-1 text-sm border-b border-orange-400 focus:outline-none bg-transparent"
            @keydown.enter="confirmEdit(task)"
            @keydown.esc="cancelEdit"
            @blur="confirmEdit(task)"
            v-focus
          />

          <!-- DELETE -->
          <button
            @click="deleteTask(task.id)"
            class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="p-4 bg-orange-50 text-xs text-orange-600 italic text-center">
        “Code sạch, tâm trí thảnh thơi 🚀”
      </div>
    </div>
  </div>
</template>
