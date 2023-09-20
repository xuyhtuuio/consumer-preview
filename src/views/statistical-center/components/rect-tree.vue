<template>
  <div class="rect-tree" v-loading="isShow">
    <div class="my-echart" ref="my-chart"></div>
  </div>
</template>

<script>
import { reviewTaskDistributionChart } from '@/api/statistical-center'
export default {
  data() {
    return {
      isShow: true,
    }
  },
  methods: {
    async initData(data) {
      this.isShow = true
      this.searchData = data
      const { data: res } = await reviewTaskDistributionChart(data)
      if (res.success) {
        this.isShow = false
        this.$nextTick(() => {
          this.initEcharts(res.data.length === 1 ? res.data[0].children : res.data)
        })
      }
    },
    initEcharts(originData) {
      const data = originData
      const color = [
        '#2D5CF6',
        '#5ACFD6',
        '#FAAD14',
        'rgba(246, 189, 22, 0.8)',
        'rgba(255, 241, 184, 1)'
      ]
      const option = {
        color,
        tooltip: {
          show: true,
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: 'rgba(255,255,255,0.8)',
          trigger: 'item',
          formatter: ({ dataIndex }) => {
            const p = `
                  <div style="line-height: 20px;color:rgba(29, 33, 40, 1);font-weight:700">审查任务数</div>
                  <div>
                    <div style="display:flex;align-items:center;gap:12px;color:#1D2128">
                      <span style="margin-right:4px;border-radius:10px;width:10px;height:10px;background-color: ${color[dataIndex - 1]};"></span>
                      <span>北京分行</span>
                      <span>230项</span>
                      <span>全行占比8%</span>
                    </div>
                  </div>
              `
            const box = `<div style="width:230px;padding:16px;font-size:12px">${p}</div>`
            return box
          }
        },
        series: [
          {
            type: 'treemap',
            nodeClick: false,
            roam: false,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            itemStyle: {
              gapWidth: 6
            },
            upperLabel: {
              show: false
            },
            breadcrumb: {
              show: false
            },
            label: {
              position: ['5%', '5%'],
              align: 'left',
              fontSize: 10,
              lineHeight: 18,
              formatter: '{b}\n 占比{c}%'
            },
            // levels: [
            //   {
            //     itemStyle: {
            //       gapWidth: 3,
            //     },
            //   },
            // ],
            data
          }
        ]
      }
      this.initChart('my-chart', option)
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
.rect-tree {
  flex: 1;
  .my-echart {
    height: 100%;
    width: 100%;
  }
}
</style>
