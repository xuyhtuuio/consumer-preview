<template>
  <div class="high-word" v-loading="isShow">
    <g-table-card :title="title">
      <template #content>
        <div class="my-echart" ref="my-echart"></div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import { highFrequencyVocabulary } from '@/api/statistical-center'
export default {
  data() {
    return {
      title: '高频词汇',
      isShow: true,
    }
  },
  mounted() {
  },
  methods: {
    async initData(data) {
      this.isShow = true
      const { data: res } = await highFrequencyVocabulary(data)
      if (res.success) {
        this.$nextTick(() => {
          this.initEcharts(res.data)
          this.isShow = false
        })
      }
    },
    initEcharts(originData) {
      const option = {
        series: [
          {
            type: 'wordCloud',
            sizeRange: [12, 50], //  词典字体大小范围配置
            rotationRange: [-45, 45], // 词典字体旋转角度配置，默认不旋转
            gridSize: 10, // 词典字体间距配置
            layoutAnimation: true, // 为false词典过度会阻塞
            textStyle: {
              // 词典样式配置
              color() {
                // 颜色随机渐变
                const colors = [
                  '#F7BA1E',
                  '#BBB7D9',
                  '#B7DB57',
                  '#249EFF',
                  '#FA8C16',
                ]
                return colors[parseInt(Math.random() * 5)]
              }
            },
            // 渲染词典数据
            data: originData
          }
        ]
      }
      this.initChart('my-echart', option)
    },
    initChart(ref, option) {
      const chart = this.$refs[ref]
      let myChart
      if (chart) {
        myChart = this.$echarts.init(chart)
        myChart.setOption(option)
        window.addEventListener('resize', () => {
          myChart.resize()
        })
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          myChart.resize()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.high-word {
  .my-echart {
    width: 100%;
  }
}
</style>
