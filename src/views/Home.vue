<template>
  <el-row :gutter="15">
    <el-col :span="6">
      <el-card shadow="hover" class="count">
        <template #header>
          <span class="count-title">页面访问量</span>
        </template>
        <div class="count-body">
          <span>{{ siteCount.today_pv }}</span>
          <span>
            <p>比昨天</p>
            <p v-if="siteCount.compare_pv < 0" class="down">
              <el-icon><caret-bottom/></el-icon>{{ siteCount.compare_pv }}%</p>
            <p v-else class="up">
              <el-icon><caret-top/></el-icon>{{ siteCount.compare_pv }}%</p>
          </span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="count">
        <template #header>
          <span class="count-title">访问用户数</span>
        </template>
        <div class="count-body">
          <span>{{ siteCount.today_uv }}</span>
          <span>
            <p>比昨天</p>
            <p v-if="siteCount.compare_uv < 0" class="down">
              <el-icon><caret-bottom/></el-icon>{{ siteCount.compare_uv }}%</p>
            <p v-else class="up">
              <el-icon><caret-top/></el-icon>{{ siteCount.compare_uv }}%</p>
          </span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="count">
        <template #header>
          <span class="count-title">平均访问时长</span>
        </template>
        <div class="count-body">
          <span>{{ siteCount.today_time }}</span>
          <span>
            <p>比昨天</p>
            <p v-if="siteCount.compare_time < 0" class="down">
              <el-icon><caret-bottom/></el-icon>{{ siteCount.compare_time }}%</p>
            <p v-else class="up">
              <el-icon><caret-top/></el-icon>{{ siteCount.compare_time }}%</p>
          </span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="count">
        <template #header>
          <span class="count-title">平均访问页数</span>
        </template>
        <div class="count-body">
          <span>{{ siteCount.today_page }}</span>
          <span>
            <p>比昨天</p>
            <p v-if="siteCount.compare_page < 0" class="down">
              <el-icon><caret-bottom/></el-icon>{{ siteCount.compare_page }}%</p>
            <p v-else class="up">
              <el-icon><caret-top/></el-icon>{{ siteCount.compare_page }}%</p>
          </span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="15">
      <el-card shadow="hover">
        <template #header>
          <span>浏量趋势</span>
        </template>
        <div id="trend" :style="{ 'min-height': '320px' }"></div>
      </el-card>
    </el-col>
    <el-col :span="9">
      <el-card shadow="hover">
        <template #header>
          <span>主机性能</span>
        </template>
        <div class="server-progress">
          <p>CPU使用率</p>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="serverCount.cpu_rate"
                       :color="customColorMethod"/>
          <p>系统负载(15分钟)</p>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="serverCount.load_15"
                       :color="customColorMethod"/>
          <p>内存使用率</p>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="serverCount.memory_rate"
                       :color="customColorMethod"/>
          <p>磁盘使用率</p>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="serverCount.disk_rate"
                       :color="customColorMethod"/>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover">
        <template #header>
          <span>访客设备分布</span>
        </template>
        <div id="equipment" :style="{ 'min-height': '320px' }"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="hover">
        <template #header>
          <span>受访页面TOP5</span>
        </template>
        <!--        <div id="trend" :style="{ 'min-height': '320px' }"></div>-->
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover">
        <template #header>
          <span>访客地域分布</span>
        </template>
        <div id="area" :style="{ 'min-height': '320px' }"></div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import {onMounted, reactive, ref} from "vue";
import {CaretBottom, CaretTop} from "@element-plus/icons-vue"
import {getServerCount, getSiteCount, getSiteEcharts} from "@/api/home";
import * as echarts from 'echarts'
import * as china from "@/assets/echarts-china.js"
// 数据统计
const siteCount = reactive({})

// 获取站点统计数据
async function getSiteCountData() {
  Object.assign(siteCount, await getSiteCount())
  console.log("siteCount", siteCount)
}

// 服务器性能
const serverCount = reactive({})

// 获取服务器性能数据
async function getServerCountData() {
  Object.assign(serverCount, await getServerCount())
  console.log("serverCount", serverCount)
}

// 进度条颜色
const customColorMethod = (percentage) => {
  if (percentage < 50) {
    return '#2ecc71'
  }
  if (percentage < 80) {
    return '#f1c40f'
  }
  return '#e74c3c'
}
// echarts曲线颜色
const color = ref([
  '#c22931',
  '#e8ad29',
  '#008dd0',
  '#157623',
  '#00549d',
  '#08919d',
  '#009a7c',
  '#8e44ad',
  '#2ecc71',
  '#f39c12',
  '#e74c3c'
])

// 流量趋势折线图
async function trend() {
  const query = {chart: 'trend'}
  const chartData = await getSiteEcharts(query)
  console.log("trend", chartData)
  const date = []
  const pv = []
  const uv = []
  const new_user = []
  const ip = []
  const time = []
  const page = []
  for (let i in chartData) {
    date.unshift(chartData[i].date)
    pv.unshift(chartData[i].pv)
    uv.unshift(chartData[i].uv)
    new_user.unshift(chartData[i].new_user)
    ip.unshift(chartData[i].ip)
    time.unshift(chartData[i].time)
    page.unshift(chartData[i].page)
  }
  let myChart;
  myChart = echarts.init(document.getElementById("trend"));
  // 绘制图表
  myChart.setOption({
    color: color.value,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['平均访问页面数', '平均访问时长', '新增访客数', 'IP数', '访客数', '浏览量']
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: date
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '平均访问页面数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: page
      },
      {
        name: '平均访问时长',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: time
      },
      {
        name: '新增访客数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: new_user
      },
      {
        name: 'IP数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: ip
      },
      {
        name: '访客数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: uv
      },
      {
        name: '浏览量',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: pv
      }
    ]
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
}
// 浏览设备饼图
async function equipment() {
  const query = {chart: 'equipment'}
  const chartData = await getSiteEcharts(query)
  console.log("equipment", chartData)
  let myChart;
  myChart = echarts.init(document.getElementById("equipment"));
  // 绘制图表
  myChart.setOption({
    color: color.value,
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
}
// 访问用户地图
async function area() {
  const query = {chart: 'area'}
  const chartData = await getSiteEcharts(query)
  console.log("area", chartData)
  let myChart;
  myChart = echarts.init(document.getElementById("area"));
  // 绘制图表
  myChart.setOption({
    color: color.value,
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br/>{a}:{c}'
    },
    visualMap: {
      min: 0,
      max: 1097,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],           // 文本，默认为数值文本
      calculable: true,
      inRange: {
        color: ['lightskyblue', 'yellow', 'orangered']
      }
    },
    series: [
      {
        name: '浏览量',
        type: 'map',
        mapType: 'china',
        roam: false,
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: true
          }
        },
        data: chartData
      }
    ]
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
}
onMounted(() => {
  getSiteCountData()
  getServerCountData()
  trend()
  equipment()
  // area()
})
</script>

<style scoped lang="scss">
h1 {
  color: var(--color-text);
}

:deep(.el-card__header) {
  font-weight: bolder;
}

.el-card {
  margin-bottom: 15px;
}

.count {
  :deep(.el-card__body) {
    padding: 0;
  }

  :deep(.el-card__header) {
    padding: 0;
  }

  .count-title {
    display: flex;
    justify-content: center;
    font-weight: bolder;
    padding: 10px;
  }

  .count-body {
    display: flex;
    align-items: center;
    text-align: center;

    span:nth-child(1) {
      flex: 2;
      font-size: 40px;
      font-weight: bold;
    }

    span:nth-child(2) {
      flex: 1;
      border-left: 1px solid #dfe3ea;
      font-size: 13px;
      padding: 8px 0;

      p {
        margin: 8px;
      }

      .up {
        color: #2ecc71;
      }

      .down {
        color: #e74c3c;
      }
    }
  }
}

.server-progress {
  .el-progress--line {
    margin-bottom: 15px;
  }
}
</style>
