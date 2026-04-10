<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "../api/axios";

const email = ref("");
const password = ref("");
const isLogin = ref(true);
const loading = ref(false);
const error = ref("");

const router = useRouter();

const submit = async () => {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "Vui lòng nhập đầy đủ thông tin";
    return;
  }

  try {
    loading.value = true;

    const url = isLogin.value ? "/auth/login" : "/auth/register";

    const res = await axios.post(url, {
      email: email.value,
      password: password.value,
    });

    console.log("Full response:", res.data);

    if (isLogin.value) {
      const token =
        res.data.access_token ?? res.data.token ?? res.data.data?.access_token;

      console.log("Token saved:", token);

      localStorage.setItem("token", token);
      router.push("/home");
    } else {
      isLogin.value = true;
    }
  } catch (e) {
    error.value = "Sai tài khoản hoặc mật khẩu";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-300"
  >
    <div class="bg-white p-8 rounded-3xl shadow-xl w-80">
      <!-- TITLE -->
      <h2 class="text-2xl font-bold text-center mb-2">
        {{ isLogin ? "Đăng nhập" : "Đăng ký" }}
      </h2>
      <p class="text-center text-gray-400 text-sm mb-6">
        Welcome back developer 🚀
      </p>

      <!-- ERROR -->
      <p v-if="error" class="text-red-500 text-sm mb-3">
        {{ error }}
      </p>

      <!-- INPUT -->
      <input
        v-model="email"
        placeholder="Email"
        class="w-full border rounded-xl px-3 py-2 mb-3 focus:outline-orange-400"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border rounded-xl px-3 py-2 mb-4 focus:outline-orange-400"
      />

      <!-- BUTTON -->
      <button
        @click="submit"
        :disabled="loading"
        class="w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition"
      >
        {{ loading ? "Loading..." : isLogin ? "Login" : "Register" }}
      </button>

      <!-- SWITCH -->
      <p
        class="text-center text-sm mt-4 cursor-pointer text-orange-500"
        @click="isLogin = !isLogin"
      >
        {{
          isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"
        }}
      </p>
    </div>
  </div>
</template>
