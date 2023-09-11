<template>
  <div class="type-distribution">
    <g-table-card :title="title">
      <template #head-right>
        <div class="btns flex">
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
        <div class="content">
          <div
            class="content-title"
            v-show="isToggleNext"
            @click="handleReturn"
          >
            返回上一级 >
          </div>
          <div class="content-main">
            <div class="echarts-box" ref="my-echarts"></div>
            <div class="echarts-lengd">
              <template v-if="!isToggleNext">
                <div
                  class="lengd-com"
                  v-for="(item, index) in timesData"
                  :key="index"
                >
                  <div
                    class="lengd-point"
                    :style="{ 'background-color': colorListTimes[index] }"
                  ></div>
                  <span>{{ item.name }}</span>
                  <span class="black">{{ item.value }}项</span>
                  <span class="black">{{ item.rate }}</span>
                </div>
              </template>
              <template v-else>
                <div>
                  {{ isToggleNextData.name }}
                </div>
                <div
                  class="lengd-com"
                  v-for="(item, index) in timesDataTwo"
                  :key="index"
                >
                  <div
                    class="lengd-point"
                    :style="{ 'background-color': colorListTimes[index] }"
                  ></div>
                  <span>{{ item.name }}</span>
                  <span class="black">{{ item.value }}项</span>
                  <span class="black">{{ item.rate }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
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
      currentEchartType: 1,
      colorListTimes: ['#5773F9', '#249EFF', '#21CCFF', '#81E2FF'],
      colorListTimesTwo: ['#65CFE4', '#FADC6D', '#CF84CD'],
      timesData: [
        { value: 200, name: '产品类', rate: '20%' },
        { value: 400, name: '活动类', rate: '40%' },
        { value: 300, name: '客户类', rate: '30%' },
        { value: 100, name: '其他', rate: '10%' }
      ],
      timesDataTwo: [
        { value: 400, name: '有实质意见', rate: '40%' },
        { value: 300, name: '非实质意见', rate: '30%' },
        { value: 100, name: '活动未开展', rate: '10%' }
      ],
      isToggleNext: false,
      isToggleNextData: null
    }
  },
  mounted() {
    this.initMyEcharts(this.timesData, this.colorListTimes)
  },
  methods: {
    initMyEcharts(timesData, colorListTimes) {
      const option = {
        color: colorListTimes,
        // tooltip: {
        //   trigger: 'item',
        //   backgroundColor: 'rgba(255,255,255,0.8)',
        //   formatter: '{a} <br/>{b} : {c} ({d}%)'
        // },
        grid: {
          left: '0',
          right: '0',
          bottom: '14%',
          containLabel: true
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: [10, 80],
            center: ['50%', '50%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: false
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
      }
    },
    handleToggleEchartItem(data) {
      if (this.isToggleNext) return
      this.isToggleNext = true
      this.isToggleNextData = data
      this.initMyEcharts(this.timesDataTwo, this.colorListTimesTwo)
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
    margin-top: 24px;
    padding-left: 20px;
    &-title {
      margin-left: 20px;
      line-height: 22px;
      color: @color-4;
      cursor: pointer;
    }
    &-main {
      display: flex;
      align-items: center;
      .echarts-box {
        width: 200px;
        height: 180px;
        margin-right: 60px;
      }
      .echarts-lengd {
        font-size: 12px;
        .lengd-com {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1d2128;
          margin-top: 4px;
          height: 24px;
          &:last-of-type {
            border-bottom: none;
          }
          .black {
            font-weight: 700;
          }
          .lengd-point {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
