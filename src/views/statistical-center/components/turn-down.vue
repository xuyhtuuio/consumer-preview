<template>
  <div class="turn-down">
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
        <div class="main" v-show="currentTabListIndex === 0">
          <div class="left">
            <div class="top">
              总驳回数: <span class="high">{{ 123 }}</span> 单
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
                :cell-style="{ 'text-align': 'center', 'font-size': '12px' }"
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
        </div>
        <div class="main" v-show="currentTabListIndex === 1">
          <div class="my-echart" ref="stackBar-echart"></div>
        </div>
        <div class="main" v-show="currentTabListIndex === 2">
          <div class="my-echart" ref="reason-echart"></div>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import tableMixin from '../mixins/turn-down-table'
import echartMixin from '../mixins/turn-down-echarts'
export default {
  mixins: [tableMixin, echartMixin],
  data() {
    return {
      title: '驳回统计',
      tabList: [
        { id: 1, name: '驳回单及驳回率' },
        { id: 2, name: '驳回次数分布' },
        { id: 3, name: '驳回原因分布' }
      ],
      currentTabListIndex: 0,
    }
  },
  methods: {
    handleTabToggle(index) {
      if (this.currentTabListIndex !== index) {
        this.currentTabListIndex = index
        this.handleEchartsToggle(index)
      }
    },
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
    .my-echart {
      height: 100%;
    }
    &>.my-echart {
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