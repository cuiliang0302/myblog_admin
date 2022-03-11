import {createRouter, createWebHashHistory} from 'vue-router';
import store from '@/store/index'
const router = createRouter({
	history: createWebHashHistory(),  // hash模式，
	// history: createWebHistory('/static/dist'),  //h5模式createWebHistory
	routes: [
		{
			path: '/',
			redirect: '/index'
		},
		{
			path: '/index',
			name: 'Index',
			component: () => import('@/views/Index.vue')
		},
		{
			path: '/directory',
			name: 'Directory',
			component: () => import('@/views/Directory.vue')
		},
		{
			path: '/image',
			name: 'Image',
			component: () => import('@/views/Image.vue')
		}
	]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
	store.commit('setMessageShow',false)
	next()
})
export default router;
