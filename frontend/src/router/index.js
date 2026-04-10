import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import Home from "../views/Home.vue";

const routes = [
  { path: "/", component: Auth },
  { path: "/home", component: Home },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
