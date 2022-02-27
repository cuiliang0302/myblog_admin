import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({
	// history: createWebHashHistory(),  // hash模式，
	history: createWebHistory(),  //h5模式createWebHistory
	routes: [
		{path: '/', component: () => import('@/views/Home.vue')},
		{path: '/test', component: () => import('@/views/Test.vue')}
	]
})
// 路由导航守卫
// router.beforeEach((to, from, next) => {
// 	// to 访问的路径 from 从哪来 next 响应路径
// 	if (to.meta.isAuth === true && JSON.stringify(store.state.userSession) === '{}') {
// 		Toast.fail('还未登录，即将跳转至登录页')
// 		return next('/login_register')
// 	} else {
// 		next()
// 	}
// })
export default router;
