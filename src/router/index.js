import {createRouter, createWebHashHistory} from 'vue-router';

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
		}
	]
})
export default router;
