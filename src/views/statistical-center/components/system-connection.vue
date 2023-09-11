<template>
  <div class="system-connection">
    <g-table-card :title="title">
      <template #content>
        <div class="my-echart" ref="my-chart"></div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: '业务系统对接',
    echartData: [
      {
        name: '财富开放平台',
        value: 100,
        taskNum: 372,
        rate: 8
      },
      {
        name: '陪伴系统',
        value: 200,
        taskNum: 372,
        rate: 8
      },
      {
        name: '协同-基金系统',
        value: 330,
        taskNum: 372,
        rate: 8
      },
      {
        name: '神笔系统',
        value: 240,
        taskNum: 372,
        rate: 8
      },
      {
        name: '天工系统',
        value: 450,
        taskNum: 372,
        rate: 8
      }
    ]
  }),
  mounted() {
    this.$nextTick(() => {
      this.initEcharts(this.echartData)
    })
  },
  methods: {
    initEcharts(echartData) {
      const xData = []
      const data = []
      echartData.map((item) => {
        xData.push(item.name)
        data.push(item.value)
      })

      const option = {
        color: ['#5784FF', '#FAAD14'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: 'rgba(255,255,255,0.8)',
          // extraCssText: 'width:240px;',
          formatter: ([{ dataIndex }]) => {
            const { name, taskNum, rate } = echartData[dataIndex]
            const box = `<div style="border-radius:6px;padding:6px;color:#1D2128;font-size:12px">
              <div style="display:flex; gap:8px;align-items:center">
                 <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#2D5CF6 "></span>
                <span>对接系统-${name}</span>
              </div>
              <div style="display:flex; gap:8px;align-items:center">
                 <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#2D5CF6;"></span>
                <span>任务条数</span>
                <span>${taskNum}</span>
                <span>全行占比</span>
                <span>${rate}</span>
              </div>
            </div>`
            return box
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#CACDD3'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            alignTicks: true,
            name: '条',
            splitLine: {
              // 网格线
              show: true,
              lineStyle: {
                color: '#F3F3F5'
              }
            },
            axisLine: {
              onZero: true,
              lineStyle: {
                color: '#88909B'
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '22%',
            data,
            color: '#2D5CF6',
            itemStyle: {
              normal: {
                barBorderRadius: [20, 20, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#21CCFF'
                  },
                  {
                    offset: 1,
                    color: '#2D5CF6'
                  }
                ]),
                opacity: 0.3
              },
              emphasis: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#21CCFF'
                  },
                  {
                    offset: 1,
                    color: '#2D5CF6'
                  }
                ]),
                opacity: 1
              }
            }
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
.system-connection {
  width: 45%;
  .my-echart {
    width: 100%;
    height: 100%;
  }
}
</style>
