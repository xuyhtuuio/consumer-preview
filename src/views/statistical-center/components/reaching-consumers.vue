<template>
  <div class="reaching-consumers">
    <g-table-card :title="title">
      <template #content>
        <div class="my-echart" ref="my-chart"></div>
        <div class="right">
          <div class="right-main">
            <div
              class="right-item"
              v-for="(item, index) in echartsData"
              :key="item.name"
            >
              <div
                :class="['item-left', currentEchartIndex === index && 'active']"
              >
                <span
                  :style="`margin-right:4px;border-radius:10px;width:10px;height:10px;background-color: ${color[index]};`"
                ></span>
                <span class="strong">{{ item.name }}</span>
                <span>{{ item.value }}</span>
                <span>{{ item.rate }}%</span>
              </div>
              <div class="item-right">
                <div
                  :class="['r-item', currentEchartIndex === index && 'active']"
                  v-for="iten in item.children"
                  :key="iten.name"
                >
                  <span class="r-item-span">{{ iten.name }}</span>
                  <span class="r-item-span">{{ iten.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '触达消费者渠道',
      color: [
        '#2D5CF6',
        '#81E2FF',
        '#249EFF',
        '#ee6666',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc'
      ],
      echartsTitle: '',
      echartsData: [
        {
          value: 1548,
          name: '总行渠道',
          rate: 25,
          children: [
            { name: '网点', value: 104 },
            { name: '官网', value: 33 },
            { name: '手机银行', value: 22 },
            { name: '手机银行直播平台', value: 44 },
            { name: '短信', value: 33 },
            { name: '电话银行', value: 65 },
            { name: '抖音，bilibili，小红书等视频等线上渠道', value: 23 }
          ]
        },
        {
          value: 775,
          rate: 25,
          name: '分行渠道',
          children: [
            { name: '网点(分行)', value: 104 },
            { name: '官网(分行)', value: 33 },
            { name: '抖音，bilibili，小红书等视频等线上渠道', value: 23 }
          ]
        },
        {
          value: 679,
          rate: 25,
          name: '支行渠道',
          children: [
            { name: '网点(支行)', value: 104 },
            { name: '短信(支行)', value: 33 }
          ]
        }
      ],
      currentEchartIndex: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initEcharts()
    })
  },
  methods: {
    initEcharts(title = '') {
      const oneData = this.echartsData
      const title1 = title || oneData[0].name
      this.echartsTitle = title1
      const twoData = oneData.find((item) => item.name === title1).children
      this.currentEchartIndex = oneData.findIndex(
        (item) => item.name === title1
      )
      const option = {
        color: this.color,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: 'rgba(255,255,255,0.8)',
          formatter: ({ data, color }) => {
            const box = `<div style="border-radius:6px;padding:6px;">
            <div style="font-size:12px">${title1}</div>
            <div style="display:flex;align-items: center;gap: 8px;font-size:14px;line-height:22px">
              <span style="border-radius:10px;width:8px;height:8px;background-color: ${color};"></span>
              <span>${data.name} </span>
              <span style="font-size:12px">${data.value}</span>
            </div>
            </div>`
            return box
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: [0, '60%'],
            label: {
              show: false,
              position: 'center',
              fontSize: 14,
              fontWeight: '700',
              lineHeight: 30,
              color: 'white',
              formatter: '{a|{c}} \n {b}',
              rich: {
                a: {
                  fontSize: 20,
                  fontWeight: 700
                }
              }
            },
            emphasis: {
              label: {
                show: true,
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: () => ''
            },
            labelLine: {
              show: false
            },
            data: oneData,
          },
          {
            name: 'Access From',
            type: 'pie',
            radius: ['80%', '95%'],
            labelLine: {
              length: 30
            },
            label: {
              show: false
            },
            data: twoData
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
        myChart.on('click', ({ seriesIndex, data }) => {
          if (seriesIndex === 0 && data.name !== this.echartsTitle) {
            this.handleToggleEchartItem(data)
          }
        })
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          myChart.resize()
        })
      })
    },
    handleToggleEchartItem(data) {
      this.initEcharts(data.name)
    }
  }
}
</script>

<style lang="less" scoped>
.reaching-consumers {
  /deep/.tableCard {
    height: 100%;
    & > .content {
      height: 360px
    }
  }
  .my-echart {
    width: 45%;
    right: -20px;
  }
  .right {
    flex: 1;
    display: flex;
    align-items: center;
    &-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      &:not(:last-child) {
        margin-bottom: 24px;
      }
      .item-left {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 155px;
        line-height: 30px;
        font-size: 12px;
        font-weight: 700;
        color: #1d2128;
        &.active {
          color: #2d5cf6;
        }
        .strong {
          font-size: 14px;
        }
      }
      .item-right {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        width: 420px;

        .r-item {
          display: flex;
          align-items: center;
          line-height: 26px;
          padding: 0 8px;
          border-radius: 4px;
          gap: 8px;
          border: 1px solid #f2f3f5;
          background-color: #f7f8fa;
          color: #1d2128;
          &.active {
            color: #2d5cf6;
            background-color: #f0f6ff;
          }
          .r-item-span {
            &:last-child {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
