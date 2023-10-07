export default {
  data() {
    return {
      orderData: {
        data: [],
        color: ['#5773F9', '#249EFF', '#21CCFF', '#81E2FF']
      },
      stackBarData: {},
      reasonData: []
    }
  },
  methods: {
    handleEchartsToggle(index) {
      this.$nextTick(() => {
        if (index === 0) {
          this.initOrderEcharts(this.orderData)
        } else if (index === 1) {
          this.initStackBarDataEcharts(this.stackBarData)
        } else {
          this.initReasonEcharts(this.reasonData)
        }
      })
    },
    initOrderEcharts({ data, color }, currentIndex) {
      const option = {
        color,
        grid: {
          left: '0',
          right: '0',
          bottom: '14%',
          containLabel: true
        },
        legend: {
          orient: 'vertical',
          bottom: '30px',
          // y: 'center',
          // 设置图例形状
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            fontSize: 12,
            rich: {
              active: {
                color: 'blue'
              }
            },
          },
          formatter(name) {
            const { value } = data.find((item) => item.name === name)
            const index = data.findIndex((item) => item.name === name)
            const all = data.reduce((item, next) => {
              return item + next.value
            }, 0)
            const rate = (value / all) * 100
            if (index === currentIndex) {
              return `{active|${name} ${value}项 ${rate}%}`
            }
            return `${name} {a| ${value}项 ${rate}%}`
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '25%'],
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 12,
                formatter({ name, value }) {
                  return `{a|${value}项}\n{b| ${name}}`
                },
                rich: {
                  a: {
                    lineHeight: 20,
                    fontWeight: '700'
                  },
                  b: {
                    color: '#505968'
                  }
                }
              }
            },
            data
          }
        ]
      }
      this.initChart('order-echart', option, () => {
        // myChart.on('mouseover', ({ dataIndex }) => {
        //   if (this.orderCurrentIndex === dataIndex) return
        //   this.orderCurrentIndex = dataIndex
        //   this.initOrderEcharts(this.orderData, this.orderCurrentIndex)
        // });
      })
    },
    // 驳回次数分布
    initStackBarDataEcharts(industryDataVal) {
      const newIndustryDataVal = JSON.parse(JSON.stringify(industryDataVal));
      const { xData, yDataDy, yDataDe, yDataDs, yDataDsi, AllCount } = newIndustryDataVal
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          trigger: 'axis',
          formatter: (serie) => {
            let countAll = 0
            serie.map((item) => {
              countAll += item.value
            })
            let paramsList = ''
            paramsList += serie
              .map((item) => {
                return `
                    <p class="charts-tooltip-p w50"><span class="serieName"><span class="charts-tooltip-dot" style="background: ${item.color};"></span>${item.seriesName}</span><span>${item.value}项</span></p>`
              })
              .join('')
            const name = serie[0].axisValueLabel
            let params = '<p class="charts-tooltip-p fontw black">驳回次数</p>'
            params += `<p class="charts-tooltip-p black"><span>${name}</span><span>${countAll}项</span><span>全行占比${
              countAll / AllCount
            }%</span></p>`
            params += `<div class="charts-tooltip-box">${paramsList}</div>`
            return params
          }
        },
        legend: {
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          bottom: 0,
          align: 'left',
          itemGap: 20,
          left: 'center',
          textStyle: {
            color: '#88909B'
          }
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '14%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '项',
          minInterval: 1
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        dataZoom: [
          {
            start: 0,
            end: 100,
            bottom: '8%',
            height: 8,
            backgroundColor: '#F9F9FB',
            borderColor: '#fff',
            fillerColor: '#FCF8E3',
            moveHandleSize: 0,
            handleSize: '180%',
            handleIcon:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALWSURBVHgBzZe9bhNBEMf/M2s7NgLiCCU0gGwpJRIJVNDwUVGaJ4A3AJ4g5AlI3oC8QTroAk06RJAoQbEIVUQUJ4qwnfPtsHPOB7F3z3Z8UvhVdzt7O7OzczOzhCER2SzHLVMj5ofubU4EFTdcPhI3iFAHaEOs/WSK8SpRtTHMujRoQrO5WSkY81IsvfhH4eCFid4d2mixVKrWU+eFBLpj2zYLAnqFMSDIEk/EiyGPeA1Idk35NYFUkAlUjyR67PMG9w4cHvyay1a5IpW8W1PX7pWc8UD2O+9T1+eJEwO6Z57/kqZcbBs4+AZpbzlXbUM6+91FCtNAbhJUmgVdvo1BRpiJaP44Jk4MiFs/36YFnPz5DrvzHlAj0shdBU8+SDVEA9MUb73uPqPr+jzlNoPKd9dg9z9jFLjsjHCGhIikU9WjSIIwz/mF0ERprI+sXLH6nTM8RI448TbJrstwpdyuV7k7b7vzAePAM7UkNvogNEyhU+W4aGqhj+3eOsbF/g7EjaAcudTOSHK7R+52j6MoH8+CNqyu5cE43Uwic14Dmj+QGa0t/7jTzYKkqvXLOnvICom2/eOEiv4F/gp36P/oXISO0sUB44JRA/yNg8tomVGY8Y+7X5FdKqx7ZYXryAoy/s2QoM6x2K9e6cQNZGbApdmAgDaYQR99MtZiwkWMjVbJQGHS/pFNK16FLw54AnztKcaFJ+8HZdq8Mk1VG86SFd8EdR1duYfzQuVwWdamVXuCocqxVjYZsS7Q1bvgqSdB+ZlyrA9isRyarLU9OQ53ngNxccPTtVTlLvsuH7dlpy2ZK8u2lN6SJfO0RLvuCPH+abbUnJGfcbpvdl3u4idMoCVTLqIpPZOKVRB38IzcRGQO1a1bu/du8P9dTJQkOpvRfFpgDosGnJ556I441OXUwLxhoucYnobArnTELp37ctrL8fXcAo8M0Z2jRub0eq5FjUa/nv8FKoBOInHeUAMAAAAASUVORK5CYII='
          },
          {
            type: 'inside',
            start: 5,
            end: 95
          }
        ],
        series: [
          {
            barWidth: '16px',
            name: industryDataVal.seriesName[0],
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            itemStyle: {
              color: '#F9CC45'
            },
            emphasis: {
              focus: 'series'
            },
            data: yDataDy
          },
          {
            name: industryDataVal.seriesName[1],
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            itemStyle: {
              color: '#FFE7BA'
            },
            emphasis: {
              focus: 'series'
            },
            data: yDataDe
          },
          {
            name: industryDataVal.seriesName[2],
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            itemStyle: {
              color: '#FFA940'
            },
            emphasis: {
              focus: 'series'
            },
            data: yDataDs
          },
          {
            name: industryDataVal.seriesName[3],
            type: 'bar',
            stack: 'total',
            label: {
              show: false
            },
            itemStyle: {
              color: '#F76560',
              borderRadius: [5, 5, 0, 0]
            },
            emphasis: {
              focus: 'series'
            },
            data: yDataDsi
          }
        ]
      }
      this.initChart('stackBar-echart', option)
    },
    // 原因分布
    initReasonEcharts(originData) {
      const yDataDy1 = []
      const xData1 = []

      originData.map(item => {
        xData1.push(item.name)
        yDataDy1.push(item.value)
      })
      const color = [
        '#249EFF',
        '#65CFE4',
        '#74E4BD',
        '#14C9C9',
        '#2D5CF6',
        '#21CCFF'
      ]
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: 'rgba(255,255,255,0.8)',
          formatter(params) {
            let child = ''
            const idx = params.dataIndex
            originData[idx].children.forEach(item => {
              child += `
                <div style="width:45%;display:flex;align-items:center;gap:12px;font-size:20px;zoom:0.5">
                  <span>${item.name}</span>
                  <span>${item.value}项</span>
                </div>
              `
            })
            const p = `
            <div style="min-width:200px;padding: 6px;display:flex;gap:8px;flex-direction:column;font-size:12px">
            <div style="line-height: 20px;color:rgba(29, 33, 40, 1);font-weight:700">驳回原因</div>
            <div>
              <div style="display:flex;align-items:center;gap:12px;color:#1D2128;">
                <span style="margin-right:4px;border-radius:10px;width:10px;height:10px;background-color: ${params.color};"></span>
                <span>${params.name}</span>
                <span>${params.data}项</span>
              </div>
              <div style="display:flex;gap:12px;">
                <span style="margin-right:4px;border-radius:10px;width:10px;height:10px;"></span>

                <div style="flex:1;display:flex;justify-content: space-between;flex-wrap:wrap">
                ${child}
              </div>
              </div>
            </div>
            </div>
            `
            return p
          }
        },
        grid: {
          top: '0',
          left: '0',
          right: '10',
          bottom: '10',
          containLabel: true
        },
        legend: {
          show: false,
          top: '0',
          icon: 'rect',
        },
        xAxis: {},
        yAxis: { type: 'category', data: xData1 },
        series: {
          type: 'bar',
          itemStyle: {
            color: (params) => {
              return color[params.dataIndex]
            }
          },

          data: yDataDy1
        }
      }
      this.initChart('reason-echart', option)
    },
    initChart(ref, option, callback) {
      const chart = this.$refs[ref]
      let myChart
      if (chart) {
        myChart = this.$echarts.init(chart)
        myChart.setOption(option)
        window.addEventListener('resize', () => {
          myChart.resize()
        })
      }
      callback && callback(myChart)
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          myChart.resize()
        })
      })
    }
  }
}
