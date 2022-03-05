<template>
  <div class="main">
    <el-card shadow="hover">
      <el-form ref="formRef" :model="form" label-width="120px">
        <el-form-item label="笔记名称：">
          <el-select v-model="form.note" @change="changeNote" placeholder="请选择编排的笔记名称" size="large">
            <el-option
                v-for="item in noteList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover" v-loading="loading">
      <el-tree :data="catalogList" @node-drop="handleDrop" @node-click="handleNodeClick" draggable>
        <template #default="{ node, data }">
        <span class="directory-label">
          <span>{{ node.label }}</span>
          <span class="directory-btn"
                v-show="data.id===currentNodeKey && (data.children.length || data.children.length===0)">
            <el-button size="small" :icon="Edit" @click="currentEdit(data)"></el-button>
            <el-button size="small" :icon="Plus" @click="isAddDialog = true"></el-button>
            <el-popconfirm title="确定要删除此章节吗" @confirm="currentDelete(data)">
              <template #reference>
                <el-button size="small" :icon="Delete"></el-button>
              </template>
            </el-popconfirm>
            <el-button size="small" :icon="CircleCloseFilled" @click="currentClose"></el-button>
          </span>
        </span>
        </template>
      </el-tree>
      <div class="catalog-btn" v-show="catalogList.length!==0">
        <el-button type="primary" @click="catalogSubmit">提交</el-button>
        <el-button @click="catalogReset">重置</el-button>
      </div>
    </el-card>
    <el-dialog
        v-model="isEditDialog"
        title="编辑章节名称"
        width="30%"
    >
      <el-form :model="editForm">
        <el-form-item label="章节名称:">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="isEditDialog = false">取消</el-button>
        <el-button type="primary" @click="editCommit">提交</el-button>
      </span>
      </template>
    </el-dialog>
    <el-dialog
        v-model="isAddDialog"
        title="新增章节名称"
        width="30%"
    >
      <el-form :model="addForm">
        <el-form-item label="章节名称:">
          <el-input v-model="addForm.name" placeholder="请输入新章节名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="isAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addCommit">提交</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {Edit, Plus, Delete, CircleCloseFilled} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import {
  deleteCatalogue,
  getCatalogueList,
  getNote,
  postCatalogue,
  putCatalogue,
  putCatalogueList
} from "@/api/directory";
import {ElMessage} from "element-plus";
// 选择笔记表单
const form = reactive({
  'note': ''
})
// 笔记列表
const noteList = ref()

// 获取笔记列表
async function getNoteData() {
  noteList.value = await getNote()
  console.log(noteList.value)
}

// 是否加载中
const loading = ref(false)
// 笔记目录列表
const catalogList = ref([])
// 获取笔记目录结构
const getCatalogue = () => {
  loading.value = true
  getCatalogueList(noteID.value).then((response) => {
    console.log(response)
    catalogList.value = response.map((i, index) => {
      return {
        id: i['id'],
        label: '第' + (index + 1) + '章：' + i['name'],
        name: i['name'],
        children: i['child'].map((j, index) => {
          return {
            id: j['section_id'],
            label: (index + 1) + '. ' + j['name'],
            name: j['name'],
            children: NaN,
            section_id: j['section_id']
          }
        })
      }
    });
    loading.value = false
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取笔记目录失败！')
  });
}
// 笔记目录选择笔记事件
const changeNote = (value) => {
  console.log(value)
  noteID.value = value
  getCatalogue()
}
// 当前需要编辑的笔记目录ID
const noteID = ref(1)

// 节点拖拽完成事件
const handleDrop = () => {
  try {
    catalogList.value.forEach((i, father_index) => {
      let father_str_index = i['label'].lastIndexOf("章：");
      i['label'] = '第' + (father_index + 1) + '章：' + i['label'].substring(father_str_index + 2, i['label'].length)
      i.children.forEach((j, son_index) => {
        let son_str_index = j['label'].lastIndexOf(". ");
        j['label'] = (son_index + 1) + '. ' + j['label'].substring(son_str_index + 2, j['label'].length)
      })
    })
  } catch (error) {
    console.log(error)
    ElMessage.error('非法操作，请重置结构后重新调整！')
  }
}
// 当前选中的节点id
const currentNodeKey = ref(0)
// 节点选中事件
const handleNodeClick = (data) => {
  if (currentNodeKey.value !== '') {
    currentNodeKey.value = data.id
  } else {
    currentNodeKey.value = 0
  }
}
// 章节名称编辑弹窗是否显示
const isEditDialog = ref(false)
// 章节名称编辑提交表单
const editForm = reactive({
  name: '',
  edit_id: '',
})
// 章节名称编辑事件
const currentEdit = (data) => {
  console.log("编辑节点了")
  console.log(data)
  isEditDialog.value = true
  editForm.name = data.name
  editForm.edit_id = data.id
}
// 章节名称编辑提交事件
const editCommit = () => {
  console.log("提交了编辑哦")
  putCatalogue(editForm.edit_id, editForm).then((response) => {
    console.log(response)
    ElMessage({
      message: '修改笔记章节名称成功！',
      type: 'success',
    })
    getCatalogue()
    isEditDialog.value = false
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('修改笔记章节名称失败！')
  });
}
// 章节名称新增弹窗是否显示
const isAddDialog = ref(false)
// 章节名称新增提交表单
const addForm = reactive({
  name: '',
  note: '',
})
// 章节名称新增提交事件
const addCommit = () => {
  console.log("提交了新增哦")
  addForm.note = noteID.value
  console.log(addForm)
  postCatalogue(addForm).then((response) => {
    console.log(response)
    ElMessage({
      message: '新增笔记章节名称成功！',
      type: 'success',
    })
    getCatalogue()
    isAddDialog.value = false
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('新增笔记章节名称失败！')
  });
}
// 章节名称删除事件
const currentDelete = (data) => {
  console.log("执行删除了")
  console.log(data.children)
  if (data.children.length !== 0) {
    ElMessage.error('请先移除该章节下的笔记再删除！')
  } else {
    deleteCatalogue(data.id).then((response) => {
      console.log(response)
      ElMessage({
        message: '删除笔记章节名称成功！',
        type: 'success',
      })
      getCatalogue()
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('删除笔记章节名称失败！')
    });
  }
}
// 节点取消事件
const currentClose = () => {
  console.log("执行取消了")
  currentNodeKey.value = ''
}
// 目录编排提交事件
const catalogSubmit = () => {
  console.log("目录提交了")
  const params = {value: catalogList.value}
  putCatalogueList(noteID.value, params).then((response) => {
    console.log(response)
    ElMessage({
      message: '笔记编排成功！',
      type: 'success',
    })
    getCatalogue()
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('笔记编排失败！')
  });
}
// 目录编排重置事件
const catalogReset = () => {
  console.log("重置了")
  loading.value = true
  getCatalogueList(noteID.value).then((response) => {
    console.log(response)
    catalogList.value = response.map((i, index) => {
      return {
        id: i['id'],
        label: '第' + (index + 1) + '章：' + i['name'],
        children: i['child'].map((j, index) => {
          return {
            id: j['section_id'],
            label: (index + 1) + '. ' + j['name'],
            children: NaN
          }
        })
      }
    });
    loading.value = false
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取笔记目录失败！')
  });
}
onMounted(() => {
  getNoteData()
})
</script>
<style scoped lang="scss">
.main {
  padding: 15px;
}

.el-card {
  margin-bottom: 15px;
}

.el-select {
  width: 100%;
}

//:deep(.el-tree) {
//  span {
//    font-size: 18px;
//  }
//}
//
:deep(.el-tree-node) {
  margin: 10px 0;
}

.catalog-btn {
  text-align: center;
  margin-top: 20px;

  button:first-child {
    margin-right: 30px;
  }
}

.directory-label {
  width: 100%;
  position: relative;

  .directory-btn {
    position: absolute;
    right: 30px;
    top: -6px;
  }
}

:deep(.el-button--small) {
  min-height: 20px;
}
</style>
