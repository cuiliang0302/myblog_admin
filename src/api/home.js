import index from './index'
// 切换测试数据
export function getBGC() {
	return index.get('/public/backgroundImage/')
}
