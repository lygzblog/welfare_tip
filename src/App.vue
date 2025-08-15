<!--
 * @Author: 羚羊公子
 * @FilePath: \welfare_tips\src\App.vue
-->
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useHead, useSeoMeta } from "@unhead/vue";
const Title = ref(window.ENV_CONFIG && window.ENV_CONFIG.VITE_title);
const Description = ref(window.ENV_CONFIG && window.ENV_CONFIG.VITE_description);
const Keywords = ref(window.ENV_CONFIG && window.ENV_CONFIG.VITE_keywords);
const Icon = ref(window.ENV_CONFIG && window.ENV_CONFIG.VITE_Icon);
const route = useRoute();
// 网站SEO优化配置
useHead({
  link: [{ rel: "icon", href: Icon.value }],
});
useSeoMeta({
  title: Title.value,
  description: Description.value,
  keywords: Keywords.value,
  ogTitle: Title.value,
  ogDescription: Description.value,
  ogKeywords: Keywords.value,
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <!-- 如果当前路由设置了 keepAlive，则缓存 -->
    <keep-alive>
      <component :is="Component" v-if="$route.meta && $route.meta.keepAlive" />
    </keep-alive>
    <!-- 普通页面正常加载 -->
    <component :is="Component" v-if="!($route.meta && $route.meta.keepAlive)" />
  </router-view>
</template>

<style>
.van-nav-bar .van-icon {
  color: #c8c8c9 !important;
}
.van-share-sheet__options {
  justify-content: space-around;
  box-sizing: border-box;
  padding: 6px 0px !important;
}
</style>
