import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import Task from "../views/Task.vue";

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/login", component: Auth },

  {
    path: "/",
    component: () => import("../layouts/DashboardLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "dashboard", component: () => import("../views/Dashboard.vue") },
      { path: "users", component: () => import("../views/Users.vue") },
      { path: "tasks", component: Task },
    ],
  },
];

const router = createRouter({ history: createWebHistory(), routes });

// Auth guard
router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) return "/login";
  if (to.path === "/login" && token) return "/dashboard";
});

export default router;
