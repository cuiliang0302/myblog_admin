<template>
  <h1>{{ msg }}</h1>
</template>
<script setup>
import { ref } from "vue";
import { ElMessage } from 'element-plus'
const props = defineProps({
  msg: {
    type: String,
    required: true,
    default: '1'
  },
})

const count = ref(0);
const input = ref("element-plus");

const curDate = ''

const toast = () => {
  ElMessage.success('Hello')
}
</script>
