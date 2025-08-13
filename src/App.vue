<!--
 * @Author: 羚羊公子
 * @FilePath: \welfare_tip\src\App.vue
-->
<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
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
