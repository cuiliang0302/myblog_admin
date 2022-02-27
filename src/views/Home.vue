<template>
  <h1>这是首页</h1>
  <h3>{{ bgc }}</h3>
  <el-button type="primary">主要按钮</el-button>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getBGC} from "@/api/home";
const bgc = ref()
// 获取告警数据
async function getBgcData() {
  let data = await getBGC()
  console.log(data)
  bgc.value = data.url
}
onMounted(()=>{
  getBgcData()
})
</script>

<style scoped lang="scss">

</style>
