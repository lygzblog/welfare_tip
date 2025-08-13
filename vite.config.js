/*
 * @Author: 羚羊公子
 * @FilePath: \welfare_tip\vite.config.js
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  server: {
    host: '0.0.0.0',
    open: true,//启动项目自动弹出浏览器
    port: "8080",
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:5733',
    //     changeOrigin: true,  // 允许跨域
    //     rewrite: path => path.replace(/^\/api/, '')
    //   },
    // },
    allowedHosts: [
      'chainroad.cn', // 允许访问的域名地址，即frp网穿透的地址
      '.chainroad.cn'   // .是二级域名的通配符   
    ],
  },
})
