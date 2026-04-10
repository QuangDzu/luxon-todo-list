<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "../api/axios";

const email = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const isLogin = ref(true);
const loading = ref(false);
const error = ref("");

const router = useRouter();

const title = computed(() => (isLogin.value ? "Đăng nhập" : "Tạo tài khoản"));
const subtitle = computed(() =>
  isLogin.value ? "Welcome back developer 🚀" : "Bắt đầu hành trình của bạn ✨",
);

const isFormValid = computed(() => {
  if (!email.value || !password.value) return false;
  if (!isLogin.value && (!firstName.value || !lastName.value)) return false;
  return true;
});

const switchMode = () => {
  isLogin.value = !isLogin.value;
  error.value = "";
  email.value = "";
  password.value = "";
  firstName.value = "";
  lastName.value = "";
};

const submit = async () => {
  error.value = "";

  if (!isFormValid.value) {
    error.value = "Vui lòng nhập đầy đủ thông tin";
    return;
  }

  try {
    loading.value = true;

    const url = isLogin.value ? "/auth/login" : "/auth/register";
    const payload = isLogin.value
      ? { email: email.value, password: password.value }
      : {
          email: email.value,
          password: password.value,
          first_name: firstName.value,
          last_name: lastName.value,
        };

    const res = await axios.post(url, payload);

    if (isLogin.value) {
      const token =
        res.data.access_token ?? res.data.token ?? res.data.data?.access_token;
      localStorage.setItem("token", token);
      router.push("/home");
    } else {
      isLogin.value = true;
<<<<<<< HEAD
      error.value = "";
=======
      error.value = ""; // clear
>>>>>>> e1996a4 (Feat: Update UI Login/Register)
    }
  } catch (e) {
    error.value = isLogin.value
      ? "Sai email hoặc mật khẩu"
      : "Email đã tồn tại hoặc có lỗi xảy ra";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300 p-4"
  >
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
      <!-- HEADER -->
      <div class="bg-orange-500 text-white px-8 pt-8 pb-6">
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <p class="text-sm opacity-80 mt-1">{{ subtitle }}</p>
      </div>

      <!-- FORM -->
      <div class="px-8 py-6 space-y-3">
        <!-- ERROR -->
        <div
          v-if="error"
          class="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-xl"
        >
          <span>⚠️</span>
          <span>{{ error }}</span>
        </div>

<<<<<<< HEAD
        <!-- FIRST NAME + LAST NAME -->
=======
        <!-- FIRST NAME + LAST NAME — chỉ hiện khi đăng ký -->
>>>>>>> e1996a4 (Feat: Update UI Login/Register)
        <transition name="slide">
          <div v-if="!isLogin" class="flex gap-2">
            <div class="flex-1">
              <label class="text-xs text-gray-500 mb-1 block">Họ</label>
              <input
                v-model="lastName"
                placeholder="Nguyễn"
                class="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
              />
            </div>
            <div class="flex-1">
              <label class="text-xs text-gray-500 mb-1 block">Tên</label>
              <input
                v-model="firstName"
                placeholder="Văn A"
                class="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
              />
            </div>
          </div>
        </transition>

        <!-- EMAIL -->
        <div>
          <label class="text-xs text-gray-500 mb-1 block">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="example@email.com"
            @keydown.enter="submit"
            class="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="text-xs text-gray-500 mb-1 block">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            @keydown.enter="submit"
            class="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          />
        </div>

        <!-- SUBMIT BUTTON -->
        <button
          @click="submit"
          :disabled="loading || !isFormValid"
          class="w-full py-2.5 rounded-xl font-semibold text-sm transition-all mt-1"
          :class="
            isFormValid && !loading
              ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
              : 'bg-orange-200 text-white cursor-not-allowed'
          "
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Đang xử lý...
          </span>
          <span v-else>{{ isLogin ? "Đăng nhập" : "Tạo tài khoản" }}</span>
        </button>
      </div>

      <!-- FOOTER SWITCH -->
      <div class="px-8 pb-6 text-center">
        <p class="text-sm text-gray-400">
          {{ isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?" }}
          <span
            class="text-orange-500 font-semibold cursor-pointer hover:underline ml-1"
            @click="switchMode"
          >
            {{ isLogin ? "Đăng ký ngay" : "Đăng nhập" }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 100px;
}
<<<<<<< HEAD

=======
>>>>>>> e1996a4 (Feat: Update UI Login/Register)
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
