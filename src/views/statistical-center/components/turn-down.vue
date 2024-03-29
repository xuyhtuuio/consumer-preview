<template>
  <div class="turn-down" v-loading="isShow">
    <g-table-card :title="title">
      <template #content>
        <div class="tab">
          <template v-for="(item, index) in tabList">
            <div
              :class="['tab-name', currentTabListIndex === index && 'active']"
              :key="'total' + item.id"
              @click="handleTabToggle(index)"
            >
              {{ item.name }}
            </div>
            <span v-if="index !== 2" class="line" :key="item.id"></span>
          </template>
        </div>
        <template>
          <div class="main" v-show="currentTabListIndex === 0">
            <template v-if="orderData.data.length">
              <div class="left">
                <div class="top" v-show="totalCount > 0">
                  总驳回数: <span class="high">{{ totalCount }}</span> 单
                </div>
                <div class="my-echart" ref="order-echart"></div>
              </div>
              <div class="right">
                <div class="my-table">
                  <TrsTable
                    theme="TRS-table-gray"
                    :data="data"
                    :colConfig="colConfig"
                    @sort-change="sortChange"
                    @submitEdit="submitEdit"
                    :header-cell-style="{
                      'text-align': 'center',
                      'font-weight': 400,
                      'font-size': '12px'
                    }"
                    :cell-style="{
                      'text-align': 'center',
                      'font-size': '12px'
                    }"
                  >
                  </TrsTable>
                  <TrsPagination
                    :pageSize="page.pageSize"
                    :pageNow="page.pageNow"
                    :total="page.total"
                    @getList="handleCurrentChange"
                  >
                  </TrsPagination>
                </div>
              </div>
            </template>
            <el-empty v-else style="width: 100%;"></el-empty>
          </div>
          <div class="main" v-show="currentTabListIndex === 1">
            <div class="my-echart" ref="stackBar-echart"></div>
          </div>
          <div class="main main-legend" v-show="currentTabListIndex === 2">
            <div class="my-echart" ref="reason-echart"></div>
            <div class="legend">
              <div
                class="legend-item"
                v-for="(item, index) in reasonData"
                :key="'legend' + index"
              >
                <span
                  class="legend-icon"
                  :style="{ backgroundColor: reasonData.color[index] }"
                ></span>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </template>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import { rejectStatistics } from '@/api/statistical-center'
import tableMixin from '../mixins/turn-down-table'
import echartMixin from '../mixins/turn-down-echarts'
export default {
  mixins: [tableMixin, echartMixin],
  data() {
    return {
      title: '驳回统计',
      isShow: true,
      tabList: [
        {
          id: 1,
          name: '驳回单及驳回率',
          url: '/cpr/Statistics/refusalReceiptAndRejectionRate'
        },
        {
          id: 2,
          name: '驳回次数分布',
          url: '/cpr/Statistics/distributionOfRejectionTimes'
        },
        {
          id: 3,
          name: '驳回原因分布',
          url: '/cpr/Statistics/distributionOfRejectionReasons'
        }
      ],
      dataMap: ['orderData', 'stackBarData', 'reasonData'],
      currentTabListIndex: 0,
      totalCount: 0
    }
  },
  methods: {
    async initData(data, sortSign, lineId) {
      this.searchData = data
      this.isShow = true
      let requestArr = []
      this.tabList.forEach((item) => {
        if (item.id === 1) {
          data.pageSize = this.page.pageSize
          data.pageNow = this.page.pageNow
          data = sortSign ? { ...data, sortSign, lineId } : data
        }
        requestArr.push(rejectStatistics(data, item.url))
      })
      if (sortSign) {
        requestArr = [requestArr[0]]
      }
      const [{ value: res1 }, { value: res2 }, { value: res3 }] = await Promise.allSettled(requestArr)
      if (res1.data && res1.data.success) {
        if (res1.data.success) {
          const { head, data: colData, chart } = res1.data.data
          this.colConfig = head
          this.data = colData.list
          this.page.pageNow = colData.pageNow
          this.page.total = colData.totalCount
          this.orderData.data = chart
          this.totalCount = colData.totalCount || 0
        }
      }
      if (res2.data && res2.data.success) {
        this.stackBarData = res2.data.data
      }
      if (res3.data && res3.data.data) {
        this.reasonData = res3.data.data
        this.reasonData.color = [
          '#249EFF',
          '#65CFE4',
          '#74E4BD',
          '#14C9C9',
          '#2D5CF6',
          '#21CCFF'
        ]
      }
      this.isShow = false
      this.handleEchartsToggle(this.currentTabListIndex)
    },
    handleTabToggle(index) {
      if (this.currentTabListIndex !== index) {
        this.currentTabListIndex = index
        this.handleEchartsToggle(index)
      }
    }
  }
}
</script>
<style lang="less" scoped>
@color-1: #cacdd3;
@color-2: #1d2128;
@color-3: #2d5cf6;
.turn-down {
  width: 55%;
  /deep/.tableCard {
    .content {
      display: flex;
      flex-direction: column;
    }
  }
  .tab {
    display: flex;
    gap: 12px;
    align-items: center;
    line-height: 22px;
    color: @color-2;
    &-name {
      font-weight: 700;
      cursor: pointer;
      &.active {
        color: @color-3;
      }
    }
    .line {
      padding: 4px 0;
      width: 1px;
      background-color: @color-1;
    }
  }

  .main {
    flex: 1;
    width: 100%;
    display: flex;
    &.main-legend {
      flex-direction: column;
      .legend {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        padding: 0 40px;
        font-size: 12px;
        &-item {
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 20px;
          margin-top: 8px;
          &:not(:first-child) {
            margin-left: 24px;
          }
        }
        &-icon {
          width: 8px;
          height: 8px;
        }
      }
    }
    .my-echart {
      height: 100%;
    }
    & > .my-echart {
      width: 100%;
    }
    .left {
      width: 30%;
      flex-shrink: 0;
      .top {
        text-align: center;
        line-height: 20px;
        color: @color-2;
        .high {
          line-height: 22px;
          color: @color-3;
          font-weight: 700;
        }
      }
    }
    .right {
      width: 70%;
      .my-table {
        width: 100%;
      }
    }
  }
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

  span {
    margin-right: 10px;
  }

  .charts_span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #2d5cf6;
    border: 2px solid #ffffff;
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
</style>
