<template>
  <div class="high-word">
    <g-table-card :title="title">
      <template #content>
        <div class="my-echart" ref="my-echart"></div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '高频词汇'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initData()
    })
  },
  methods: {
    initData() {
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
            data: [
              {
                value: '50', // 词典大小配置
                name: '场景化', // 词典名称配置
                textStyle: {
                  // 单独配置某个词典样式
                  shadowBlur: 4,
                  shadowOffsetY: 14,
                  color: '#BDBEFA'
                }
              },
              { value: '30', name: '稳 赚 不 赔 ' },
              { value: '29', name: '场景化' },
              { value: '28', name: '弹性' },
              { value: '27', name: '弹性足' },
              { value: '26', name: '主题' },
              { value: '25', name: '全龄' },
              { value: '24', name: '资质优' },
              { value: '23', name: '协作' },
              { value: '22', name: '安全 ' },
              { value: '21', name: '智能化' },
              { value: '20', name: '正在热售' },
              { value: '16', name: '策略' },
            ]
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
