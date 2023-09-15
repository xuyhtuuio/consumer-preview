<template>
  <div class="bar-echarts" ref="barEcharts"></div>
</template>

<script>
export default {
  name: 'bar-echarts',
  props: {
    industryData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {

    };
  },
  created() {
    this.$nextTick(() => {
      this.initEcharts(JSON.parse(JSON.stringify(this.industryData)));
    })
  },
  mounted() {

  },
  methods: {
    initEcharts(industryDataVal) {
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          trigger: 'axis',
          formatter: (serie) => {
            const name = serie[0].axisValueLabel
            let params = `<p class="charts-tooltip-p fontw black"><span class="serieName"><span class="charts-tooltip-dot" style="background:${industryDataVal.emphasisItemStyle ? industryDataVal.emphasisItemStyle[1] : '#5773F9'}"></span>${name}</span><span><span class="blue">${serie[0].data}</span>人</span></p>`
            if (industryDataVal.rate && industryDataVal.rate.length) {
              params += `<p class="charts-tooltip-p black">占全部人员  <span class="blue">${industryDataVal.rate[serie[0].dataIndex]}</span>%</p>`
            }
            return params
          },
        },
        legend: {
          bottom: 0,
          itemWidth: 8,
          itemHeight: 8,
          itemStyle: {
            color: industryDataVal.emphasisItemStyle ? industryDataVal.emphasisItemStyle[1] : '#2D5CF6'
          }
        },
        grid: {
          left: '0',
          right: '0',
          top: '14%',
          bottom: '12%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '人',
          minInterval: 1,
        },
        xAxis: {
          type: 'category',
          data: industryDataVal.xData.reverse(),
        },
        series: [
          {
            barWidth: '16px',
            name: industryDataVal.name,
            type: 'bar',
            label: {
              show: false
            },
            itemStyle: {
              normal: {
                borderRadius: [8, 8, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: industryDataVal.seriesItemStyle ? industryDataVal.seriesItemStyle[0] : 'rgba(33,204,255,0.6)' // 100% 处的颜色
                    },
                    {
                      offset: 1, color: industryDataVal.seriesItemStyle ? industryDataVal.seriesItemStyle[1] : 'rgba(33,204,255,0.6)' // 0% 处的颜色
                    }
                  ],
                },
              },
            },
            emphasis: {
              itemStyle: {
                borderRadius: [8, 8, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: industryDataVal.emphasisItemStyle ? industryDataVal.emphasisItemStyle[0] : '#21CCFF' // 100% 处的颜色
                    },
                    {
                      offset: 1, color: industryDataVal.emphasisItemStyle ? industryDataVal.emphasisItemStyle[1] : '#2D5CF6' // 0% 处的颜色
                    }
                  ],
                },
              },
            },
            data: industryDataVal.yData.reverse(),
          },
        ]
      };
      this.initChart('barEcharts', option)
    },
    initChart(ref, option) {
      const chart = this.$refs[ref];
      let myChart;
      if (chart) {
        myChart = this.$echarts.init(chart);
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
  },
  watch: {
    industryData: {
      handler(valData) {
        this.initEcharts(JSON.parse(JSON.stringify(valData)));
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="less">
.bar-echarts {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
.charts-tooltip-p {
  text-align: left;
  min-width: 80px;
  color: '#505968';
  line-height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;

  &.fontw {
    font-weight: 700;
  }

  &.black {
    color: #333;
  }

  // span {
  //   margin-right: 10px;
  // }

  .charts_span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #2D5CF6;
    border: 2px solid #FFFFFF;
    box-sizing: border-box;
    border-radius: 50%;
    margin-right: 8px;
  }

  .charts_num {
    margin-left: 6px;
  }

  // transform: scale(0.83);
  &.charts-tooltip-p {
    margin-top: 6px;
  }

  .charts-tooltip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
  }

  .serieName {
    display: inline-block;
    width: fit-content;
    padding-right: 15px;
  }

  .blue {
    color: #2D5CF6;
  }

  .bold {
    font-weight: bold;
    color: '#1D2128';
    display: inline-block;
    width: fit-content;
    padding-left: 15px;
  }
}

.charts-tooltip-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 300px;

  .w50 {
    width: 49%;
  }
}

.charts-tooltip-box-s {
  width: 220px;
}

.el-picker-panel__footer {
  display: none;
}
</style>
