<template>
  <div class="mission-trends">
    <g-table-card :title="title">
      <template #content>
        <div class="content">
          <div class="my-echart" ref="my-chart"></div>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '审查任务趋势'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initEcharts()
    })
  },
  methods: {
    initEcharts() {
      const year = [
        '2022-11',
        '2022-12',
        '2023-01',
        '2023-02',
        '2023-03',
        '2023-04',
        '2023-05',
        '2023-06',
        '2023-07',
        '2023-08'
      ]
      const newQuickRatio = [4, 2, 3, 10, 5, 2, 6, 4, 2, 5]
      const newCurrentRatio = [4, 5, 3, 1, 8, 5, 3, 8, 5, 2]
      const newAssetLiabilityRadio = [7, 8, 9, 1, 7, 6, 2, 5, 3, 7]
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: 'rgba(255,255,255,0.8)',
          extraCssText: 'width:240px;',
          formatter: (params) => {
            const myColor = ['#2D5CF6', '#21CCFF', '#F7BA1E']
            const title = `<div style="display:flex;align-items: center;justify-content: space-between;font-size:10px;color:#1D2128">${params[0].axisValue}</div>`
            let p = ''
            for (let i = 0; i < params.length; i++) {
              p += `<div style="display:flex;align-items: center;justify-content: space-between;margin-top:4px">
                        <div style="display:flex;align-items: center;">
                        <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color: ${myColor[i]};"></span>
                            <div style="font-weight: 400;font-size: 10px;line-height: 18px;color: #505968;margin-left:10px;margin-right:6px">${params[i].seriesName}</div>
                        </div>
                        <div style="font-weight: 700;font-size: 10px;line-height: 18px;color: #1D2128;">${params[i].value}项</div>
                    </div>`
            }
            const box = `<div style="border-radius:6px;padding:6px;">${title}${p}</div>`
            return box
          }
        },
        legend: {
          data: ['总审查任务', '无实质意见任务', '有实质意见任务'],
          bottom: '-20px'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: year
        },
        yAxis: {
          type: 'value',
          name: '项',
          // splitNumber,
          alignTicks: true,
          splitLine: {
            // 网格线
            show: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              // color: '#88909B'
            }
          }
        },
        series: [
          {
            name: '总审查任务',
            type: 'line',
            smooth: true,
            data: newQuickRatio,
            areaStyle: { normal: {} },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(55, 128, 243, 0.1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                  }
                ]), // 背景渐变色
                lineStyle: {
                  // 系列级个性化折线样式
                  color: '#2D5CF6'
                }
              }
            }
          },
          {
            name: '无实质意见任务',
            type: 'line',
            smooth: true,
            data: newCurrentRatio,
            areaStyle: { normal: {} },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(0, 194, 255, 0.05)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                  }
                ]), // 背景渐变色
                lineStyle: {
                  // 系列级个性化折线样式
                  color: '#21CCFF'
                }
              }
            }
          },
          {
            name: '有实质意见任务',
            type: 'line',
            smooth: true,
            data: newAssetLiabilityRadio,
            areaStyle: { normal: {} },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(247, 186, 30, 0.08)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#fff' // 100% 处的颜色
                  }
                ]), // 背景渐变色
                lineStyle: {
                  // 系列级个性化折线样式
                  color: '#F7BA1E'
                }
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
        myChart.on('click', ({ data }) => {
          this.handleToggleEchartItem(data)
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
.mission-trends {
  flex: 1;
  /deep/.tableCard {
    height: 100%;
    display: flex;
    flex-direction: column;
    .content {
      height: 100%;
      width: 100%;
      .my-echart {
        height: 100%;
        width: 100%;
      }
    }
  }
}
</style>
