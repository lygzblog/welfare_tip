/*
 * @Author: 羚羊公子
 * @FilePath: \welfare_tip\src\router\index.js
 */
// 安装vue-router@4  npm install vue-router@4
// 引入vue-router
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Details from '../pages/Details.vue'
// 定义路由
const routes = [
    { path: '/', name: 'Home', component: Home, meta: { keepAlive: true, defaultBackPath: '/' } }, // 开启缓存 
    { path: '/details', name: 'Details', component: Details, meta: { keepAlive: false } } // 开启缓存

]
// 创建路由
const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    //  hash模式使用 createWebHashHistory方法， history模式使用 createWebHistory方法。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})
// 并导出路由
export default router
