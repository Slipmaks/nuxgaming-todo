<template>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import router from "@/router";
import { useAppStore } from "./stores/app";
import { storeToRefs } from "pinia";
import { watch } from "vue";

const appStore = useAppStore(),
  { user } = storeToRefs(appStore);

watch(
  () => user.value,
  () => {
    localStorage.setItem("currentUser", JSON.stringify(user.value));
  }
);

let isAuthenticated = localStorage.getItem("isAuth");

router.beforeEach(async (to, from) => {
  isAuthenticated = localStorage.getItem("isAuth");
  if (!isAuthenticated && to.name !== "registration") return "/";
});
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
* {
  box-sizing: border-box;
}
</style>
