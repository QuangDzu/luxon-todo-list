<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    @click="closeOnOutside"
  >
    <div
      class="bg-white rounded-3xl w-full max-w-lg mx-4 shadow-2xl"
      @click.stop
    >
      <div class="p-8">
        <h2 class="text-2xl font-semibold mb-6">
          {{ isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới" }}
        </h2>

        <form @submit.prevent="save" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1"
                >Họ <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.first_name"
                type="text"
                required
                class="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2"
                :class="
                  errors.first_name
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-orange-300'
                "
              />
              <p v-if="errors.first_name" class="text-red-500 text-xs mt-1">
                {{ errors.first_name }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1"
                >Tên <span class="text-red-500">*</span></label
              >
              <input
                v-model="form.last_name"
                type="text"
                required
                class="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2"
                :class="
                  errors.last_name
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-orange-300'
                "
              />
              <p v-if="errors.last_name" class="text-red-500 text-xs mt-1">
                {{ errors.last_name }}
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"
              >Email <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2"
              :class="
                errors.email
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-200 focus:ring-orange-300'
              "
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">
              {{ errors.email }}
            </p>
          </div>

          <div v-if="!isEdit">
            <label class="block text-sm font-medium mb-1"
              >Mật khẩu <span class="text-red-500">*</span></label
            >
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2"
              :class="
                errors.password
                  ? 'border-red-500 focus:ring-red-300'
                  : 'border-gray-200 focus:ring-orange-300'
              "
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">
              {{ errors.password }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Vai trò</label>
            <select
              v-model="form.role"
              class="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="close"
              class="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-medium transition"
            >
              {{ isEdit ? "Cập nhật" : "Tạo mới" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  user: Object,
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "user",
});

const errors = ref({});

// Trim khoảng trắng thừa
const trimForm = () => {
  form.value.first_name = form.value.first_name.trim();
  form.value.last_name = form.value.last_name.trim();
  form.value.email = form.value.email.trim().toLowerCase();
};

// Validation
const validateForm = () => {
  errors.value = {};

  // Họ
  if (!form.value.first_name) {
    errors.value.first_name = "Họ không được để trống";
  } else if (form.value.first_name.length < 2) {
    errors.value.first_name = "Họ phải có ít nhất 2 ký tự";
  }

  // Tên
  if (!form.value.last_name) {
    errors.value.last_name = "Tên không được để trống";
  } else if (form.value.last_name.length < 2) {
    errors.value.last_name = "Tên phải có ít nhất 2 ký tự";
  }

  // Email
  if (!form.value.email) {
    errors.value.email = "Email không được để trống";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "Email không đúng định dạng";
  }

  // Password
  if (!props.isEdit) {
    if (!form.value.password) {
      errors.value.password = "Mật khẩu không được để trống";
    } else if (form.value.password.length < 6) {
      errors.value.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
  }

  return Object.keys(errors.value).length === 0;
};

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (props.isEdit && props.user) {
        form.value = {
          first_name: props.user.first_name || "",
          last_name: props.user.last_name || "",
          email: props.user.email || "",
          password: "",
          role: props.user.role || "user",
        };
      } else {
        form.value = {
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          role: "user",
        };
      }
      errors.value = {}; // Reset lỗi khi mở modal
    }
  },
);

const save = () => {
  trimForm(); // Xóa khoảng trắng thừa
  if (validateForm()) {
    emit("save", { ...form.value });
  }
};

const close = () => emit("close");

const closeOnOutside = (e) => {
  if (e.target === e.currentTarget) close();
};
</script>
