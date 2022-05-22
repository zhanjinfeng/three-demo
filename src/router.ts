import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
let routes: RouteRecordRaw[] = [];

// 自动加载页面路由文件
const files = import.meta.globEager('/src/pages/*/router.ts');
const configs = Object.keys(files);

routes = configs.map((item) => files[item].default as RouteRecordRaw);

export default createRouter({
    history: createWebHistory(),
    routes,
});
