/*
 * @Author: 羚羊公子
 * @FilePath: \welfare_tips\src\main.js
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue/client'
import './style.css'
import App from './App.vue'
// 引入路由
import router from './router/index'

const app = createApp(App)
const pinia = createPinia();
const head = createHead()
app.use(head)
app.use(pinia)
app.use(router)
app.mount('#app')
