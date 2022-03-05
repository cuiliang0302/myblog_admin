import index from './index'

// 获取笔记名称列表
export function getNote() {
	return index.get('/blog/note/')
}

// 获取笔记目录列表
export function getCatalogueList(id) {
	return index.get('/blog/catalogueList/' + id + '/')
}

// 修改笔记章节名称
export function putCatalogue(id, params) {
	const url = '/blog/catalogue/' + id + '/'
	return index.put(url, params)
}

// 新增笔记章节名称
export function postCatalogue(params) {
	return index.post('/blog/catalogue/', params)
}

// 删除笔记章节名称
export function deleteCatalogue(id) {
	return index.delete('/blog/catalogue/' + id + '/')
}

// 提交笔记目录编排
export function putCatalogueList(id, params) {
	const url = '/blog/catalogueList/' + id + '/'
	return index.put(url, params)
}
