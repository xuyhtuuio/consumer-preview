<template>
  <div class="type-distribution" v-loading="isShow">
    <g-table-card :title="title">
      <template #head-right>
        <div class="btns flex" v-if="timesData.length">
          <span
            :class="{ 'btn-item': true, active: currentEchartType === 1 }"
            @click="handleEchartsToggle(1)"
            >已审批</span
          >
          <span
            :class="{ 'btn-item': true, active: currentEchartType === 2 }"
            @click="handleEchartsToggle(2)"
            >已上线</span
          >
        </div>
      </template>
      <template v-slot:content>
        <div class="content" v-if="timesData.length">
          <div
            class="content-title"
            v-show="isToggleNext"
            @click="handleReturn"
          >
            返回上一级
          </div>
          <div class="content-main">
            <div class="echarts-box" ref="my-echarts"></div>
          </div>
        </div>
        <empty v-else></empty>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import { distributionOfReviewTypes } from '@/api/statistical-center'
export default {
  props: {
    list: {
      typeof: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: '审查类型分布',
      isShow: true,
      currentEchartType: 1,
      colorListTimes: ['#5773F9', '#249EFF', '#21CCFF', '#81E2FF'],
      colorListTimesTwo: ['#65CFE4', '#FADC6D', '#CF84CD'],
      timesData: [],
      isToggleNext: false,
      isToggleNextData: null
    }
  },
  methods: {
    async initData(data = this.searchData) {
      this.isShow = true
      this.searchData = data
      const { data: res } = await distributionOfReviewTypes({ ...data, distributionOfReviewTypesSign: this.currentEchartType })
      if (res.success) {
        this.timesData = res.data
        this.$nextTick(() => {
          this.initMyEcharts(res.data)
        })
      }
      this.isShow = false
    },
    initMyEcharts(timesData, colorListTimes = this.colorListTimes) {
      const option = {
        color: colorListTimes,
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderColor: 'rgba(255,255,255,0.8)',
          extraCssText: 'backdrop-filter:blur(2px)',
          formatter(params) {
            const { value, name, color, rate } = params
            return `
              <div style="display:flex;gap: 12px; align-items: center;padding: 6px;font-size:12px;color:#1D2128;">
                <span style="width:8px;height:8px;border-radius: 50%;background-color:${color}"></span>
                <span>${name}</span>
                <span>${value}项（${rate}%）</span>
              </div>
            `
          }
        },
        legend: {
          type: 'scroll',
          pageIconSize: 8,
          pageIconColor: '#2d5cf6',
          orient: 'vertical',
          right: 50,
          top: 5,
          y: 'center',
          // 设置图例形状
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 15,
          textStyle: {
            fontSize: 12,
            rich: {
              a: {
                fontWeight: 700
              },
              b: {
                lintHeight: '28px'
              }
            }
          },
          formatter(name) {
            const { value, rate } = timesData.find((item) => item.name === name)
            return `{b|${name}} {a| ${value}项 ${rate}%}`
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['20%', '50%'],
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
            data: timesData
          }
        ]
      }
      this.initChart('my-echarts', option)
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
    },
    handleEchartsToggle(type) {
      if (type !== this.currentEchartType) {
        this.currentEchartType = type
        this.isToggleNext = false
        this.initData()
      }
    },
    handleToggleEchartItem(data) {
      if (this.isToggleNext) return
      this.isToggleNext = true
      this.isToggleNextData = data
      this.initMyEcharts(data.children)
    },
    handleReturn() {
      this.isToggleNext = false
      this.isToggleNextData = null
      this.initMyEcharts(this.timesData, this.colorListTimes)
    }
  }
}
</script>

<style lang="less" scoped>
@color-1: #f3f3f5;
@color-2: #505968;
@color-3: #f0f6ff;
@color-4: #2d5cf6;
.type-distribution {
  width: 530px;
  height: 310px;
  padding: 24px;
  /deep/.tableCard {
    padding: 0;
    .head {
      justify-content: space-between;
    }
  }
  .btns {
    font-size: 12px;
    .btn-item {
      &:first-child {
        margin-right: 8px;
      }
      display: flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 4px;
      height: 24px;
      line-height: 20px;
      background-color: @color-1;
      color: @color-2;
      cursor: pointer;
      &.active {
        background-color: @color-3;
        font-weight: 700;
        color: @color-4;
      }
    }
  }
  .content {
    position: relative;
    padding-top: 22px;
    width: 100%;
    padding-left: 20px;
    &-title {
      position: absolute;
      top: 0px;
      margin-left: 20px;
      line-height: 22px;
      color: @color-4;
      cursor: pointer;
    }
    &-main {
      height: 100%;
      .echarts-box {
        height: 100%;
      }
    }
  }
}
</style>
