<template>
  <div class="person-center">
    <div class="person-approval">
      <div class="approval-top">
        <div class="top-com">
          <div class="com-tit">贡献值分布</div>
          <div class="com-echarts" ref="contribution"></div>
        </div>
        <div class="top-com">
          <div class="com-tit">接受率分布</div>
          <div class="com-echarts" ref="acceptance"></div>
        </div>
        <div class="top-com">
          <div class="com-tit">平均处理时长分布</div>
          <div class="com-echarts" ref="processing"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  name: 'person-center-index',
  data() {
    return {
      contributionData: {
        xData: ['＜100', '100(含)-200', '200(含)-300', '300(含)-400', '400(含)-500'],
        yData: [800, 1200, 390, 200, 1500],
      }
    }
  },
  mounted() {
  },
  watch: {
  },
  created() {
    this.$nextTick(() => {
      this.initPassingEcharts(this.contributionData)
      this.initAcceptanceEcharts(this.contributionData)
    })
  },
  methods: {
    // 贡献值分布
    initPassingEcharts(industryDataVal) {
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          trigger: 'axis',
          formatter: (serie) => {
            const name = serie[0].axisValueLabel
            let params = '<p class="charts-tooltip-p fontw black">一次通过率</p>'
            params += `<p class="charts-tooltip-p black"><span>${name}</span><span>一次通过率 ${serie[0].data}%</span></p>`
            // params += `<div class="charts-tooltip-box charts-tooltip-box-s"><p class="charts-tooltip-p w50"><span class="serieName">产品类</span><span>${industryDataVal.yDataHint[serie[0].dataIndex].cp}</span></p><p class="charts-tooltip-p w50"><span class="serieName">活动类</span><span>${industryDataVal.yDataHint[serie[0].dataIndex].hd}</span></p><p class="charts-tooltip-p w50"><span class="serieName">客户类</span><span>${industryDataVal.yDataHint[serie[0].dataIndex].kh}</span></p><p class="charts-tooltip-p w50"><span class="serieName">其他</span><span>${industryDataVal.yDataHint[serie[0].dataIndex].qt}</span></p></div>`
            return params
          },
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '8%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '单位：h',
          minInterval: 1,
        },
        xAxis: {
          type: 'category',
          data: industryDataVal.xData.reverse(),
        },
        series: [
          {
            // barWidth: '16px',
            name: '审查任务数',
            type: 'bar',
            label: {
              show: false
            },
            itemStyle: {
              normal: {
                // borderRadius: [8, 8, 0, 0],
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: '#21CCFF' // 100% 处的颜色
                    },
                    {
                      offset: 1, color: '#2D5CF6' // 0% 处的颜色
                    }
                  ],
                },
              },
            },
            emphasis: {
              focus: 'series'
            },
            data: industryDataVal.yData.reverse(),
          },
        ]
      };
      this.initChart('contribution', option)
    },
    // 接受率分布
    initAcceptanceEcharts(industryDataVal) {
      const option = {
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          trigger: 'axis',
          formatter: (serie) => {
            const name = serie[0].axisValueLabel
            let params = '<p class="charts-tooltip-p fontw black">一次通过率</p>'
            params += `<p class="charts-tooltip-p black"><span>${name}</span><span>一次通过率 ${serie[0].data}%</span></p>`
            // params += `<div class="charts-tooltip-box charts-tooltip-box-s"><p class="charts-tooltip-p w50"><span class="serieName">产品类</span><span>${industryDataVal.yDataHint[serie[0].dataIndex].cp}</span></p><p class="charts-tooltip-p w50"><span class="serieName">活动类</span><span>${industryDataVal.yDataHint[serie[0].dataIndex].hd}</span></p><p class="charts-tooltip-p w50"><span class="serieName">客户类</span><span>${industryDataVal.yDataHint[serie[0].dataIndex].kh}</span></p><p class="charts-tooltip-p w50"><span class="serieName">其他</span><span>${industryDataVal.yDataHint[serie[0].dataIndex].qt}</span></p></div>`
            return params
          },
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '8%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '单位：h',
          minInterval: 1,
        },
        xAxis: {
          type: 'category',
          data: industryDataVal.xData.reverse(),
        },
        series: [
          {
            barWidth: '16px',
            name: '审查任务数',
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
                      offset: 0, color: '#21CCFF' // 100% 处的颜色
                    },
                    {
                      offset: 1, color: '#2D5CF6' // 0% 处的颜色
                    }
                  ],
                },
              },
            },
            emphasis: {
              focus: 'series'
            },
            data: industryDataVal.yData.reverse(),
          },
        ]
      };
      this.initChart('acceptance', option)
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
}
</script>
<style lang="less" scoped>
.person-center {
  .person-approval {
    .approval-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .top-com {
        width: calc((100% - 32px) / 3);
        height: 290px;
        padding: 16px;
        box-sizing: border-box;
        border-radius: 10px;
        background: #FFFFFF;

        .com-tit {
          position: relative;
          padding-left: 13px;
          font-size: 14px;
          font-weight: 700;
          line-height: 22px;
          color: #1D2128;

          &::before {
            content: '';
            display: block;
            width: 5px;
            height: 20px;
            background: #306EF5;
            border-radius: 0px 10px 0px 10px;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .com-echarts {
          width: 100%;
          height: 220px;
          margin-top: 16px;
        }
      }
    }
  }
}
</style>
