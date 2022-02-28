import index from './index'

// 获取网站流量总数统计
export function getSiteCount() {
	return index.get('/management/siteCount/')
}

// 获取服务器性能统计
export function getServerCount() {
	return index.get('/management/serverCount/')
}

// 获取echarts数据
export function getSiteEcharts(params) {
	const url = '/management/siteEcharts/'
	return index.get(url, params)
}

