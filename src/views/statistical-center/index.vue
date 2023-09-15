<template>
  <div class="statistical-center">
    <div class="header">
      <div class="tips">
        <i class="iconfont icon-xiaoxi-tongzhi"></i>消保审查个人月报已生成
        <span>立即查看 ↓</span>
      </div>
      <div class="scrren-right">
        <div class="scrren-com" :class="search.cascader ? 'active' : ''">
          选择机构
          <img
            src="../../assets/image/person-center/down.png"
            class="down"
            alt=""
          />
          <el-cascader
            class="my-hidden"
            v-model="search.cascader"
            :options="organOptions"
            :props="{ label: 'name',value: 'id',checkStrictly: true }"
            @change="handleOrganChange"
            @visible-change="handleOrganChange"
          ></el-cascader>
        </div>
        <div class="scrren-com" :class="search.billValue ? 'active' : ''">
          审查类型
          <img
            src="../../assets/image/person-center/down.png"
            class="down"
            alt=""
          />
          <el-select
            v-model="search.billValue"
            placeholder="请选择"
            @change="handleSearchBlur"
          >
            <el-option
              v-for="item in billOptions"
              :key="item.value"
              :label="item.examineTypesName"
              :value="item.recordId"
            >
            </el-option>
          </el-select>
        </div>

        <div class="scrren-com" :class="search.datePicker ? 'active' : ''">
          <el-popover
            ref="ref-popover"
            width="400"
            placement="bottom-start"
            trigger="click"
            @show="handlePopoverShow"
            @hide="handlePopoverHide"
          >
            <el-date-picker
              class="my-date-picker"
              ref="my-date-picker"
              v-model="search.datePicker"
              type="monthrange"
              value-format="yyyy-MM"
              align="right"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              :picker-options="pickerOptions"
              @change="handleDatePicker"
            >
            </el-date-picker>
            <div slot="reference">
              提单时间
              <img
                src="../../assets/image/person-center/down.png"
                class="down"
                alt=""
              />
            </div>
          </el-popover>
        </div>
        <div class="scrren-btn" @click="handleReset">
          <img
            src="@/assets/image/person-center/reset.png"
            alt=""
            class="btnIcon"
          />
          重置
        </div>
        <div class="scrren-btn">
          <img
            src="@/assets/image/person-center/share.png"
            alt=""
            class="btnIcon"
          />
          导出数据
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-item common" style="padding: 0">
        <DataOverview ref="ref-data-overview" />
      </div>
      <div class="main-item flex" style="gap: 16px">
        <TypeDistribution class="common" ref="ref-type-distribution" />
        <MissionTrends class="common" />
      </div>
      <div class="main-item common">
        <g-table-card title="审查任务分布">
          <template #content>
            <RectTree></RectTree>
            <ReviewForm></ReviewForm>
          </template>
        </g-table-card>
      </div>
      <div class="main-item common">
        <ReachingConsumers />
      </div>
      <div class="main-item flex" style="gap: 16px; height: 430px">
        <SystemConnection class="common" />
        <TurnDown class="common" />
      </div>
      <div class="main-item flex" style="gap: 16px">
        <SensitiveProhibited
          class="common"
          style="width: 60%"
        ></SensitiveProhibited>
        <HighWord class="common" style="flex: 1"></HighWord>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { onlyBankOrgTree, getFormCategoryArray } from '@/api/statistical-center'
import HighWord from './components/high-word'
import SensitiveProhibited from './components/sensitive-prohibited'
import TurnDown from './components/turn-down'
import SystemConnection from './components/system-connection'
import ReachingConsumers from './components/reaching-consumers'
import ReviewForm from './components/review-form'
import RectTree from './components/rect-tree'
import DataOverview from './components/data-overview'
import MissionTrends from './components/mission-trends'
import TypeDistribution from './components/type-distribution'

export default {
  components: {
    HighWord,
    SensitiveProhibited,
    TurnDown,
    SystemConnection,
    ReachingConsumers,
    ReviewForm,
    RectTree,
    DataOverview,
    MissionTrends,
    TypeDistribution
  },
  async created() {
    await this.initData()
    this.passData()
  },
  data() {
    return {
      search: {
        billValue: '',
        datePicker: [],
        cascader: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近一个季度',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 12)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      billOptions: [],
      organOptions: []
    }
  },
  methods: {

    async  initData() {
      const newMonth = dayjs().format('YYYY-MM');
      const oldMonth = newMonth.split('')
      oldMonth[newMonth.length - 1] = newMonth.at(-1) - 1
      this.search.datePicker = [oldMonth.join(''), newMonth]
      const [{ data: res1 }, { data: res2 }] = await Promise.all([onlyBankOrgTree(), getFormCategoryArray()])
      if (res1.success) {
        this.organOptions = res1.data || []
      }
      if (res2.success) {
        this.billOptions = res2.data[0] || []
      }
    },
    passData() {
      // const { billValue, cascader, datePicker } = this.search
      // const data = {
      //   orgId: billValue,
      //   formCategoryId: cascader[cascader.length - 1] || '',
      //   startTime: '2023-08-01 00:00:00',
      //   endTime: '2023-09-15 17:55:00'
      // }
      // this.$refs['ref-data-overview'].initData(data)
      // this.$refs['ref-type-distribution'].initData(data)
    },
    handleReset() {
      this.search = {
        billValue: '',
        datePicker: [],
        cascader: []
      }
    },
    billChange() {
    },
    handleDatePicker() {
      this.$refs['ref-popover'].handleBlur()
    },
    handlePopoverHide() {
      if (this.search.datePicker) {
        this.handleSearchBlur()
      }
    },
    handleOrganChange(item) {
      if (!item && this.search.cascader.length) {
        this.handleSearchBlur()
      }
    },
    handlePopoverShow() {
      this.$refs['my-date-picker'].handleFocus()
    },
    handleSearchBlur() {
    }
  }
}
</script>

<style lang="less" scoped>
.statistical-center {
  font-size: 14px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .tips {
      display: inline-block;
      color: #2d5cf6;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      padding: 6px 12px;
      border-radius: 20px;
      background: linear-gradient(
        90deg,
        rgba(209, 226, 255, 0.7) 0%,
        rgba(209, 226, 255, 0) 70%
      );
      margin-bottom: 8px;
      width: 400px;
      cursor: default;
      align-items: center;

      span {
        border-bottom: 1px solid #2d5cf6;
        display: inline-block;
        cursor: pointer;
        margin-left: 5px;
      }

      i {
        margin-right: 8px;
        font-size: 16px;
      }
    }

    .scrren-right {
      display: flex;
      align-items: center;
      gap: 12px;

      .scrren-com {
        cursor: pointer;
        color: #1d2128;
        font-size: 16px;
        line-height: 24px;
        width: fit-content;
        padding: 0 6px;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 4px;
        position: relative;

        &.active {
          color: #2d5cf6;
        }
        .my-hidden {
          position: absolute;
          opacity: 0;
        }

        .el-select {
          position: absolute;
          opacity: 0;
        }

        .down {
          width: 12px;
          margin-left: 4px;
        }

        .hintIcon {
          width: 20px;
          margin-left: 4px;
        }
      }

      .scrren-btn {
        cursor: pointer;
        width: fit-content;
        display: flex;
        align-items: center;
        height: 36px;
        padding: 6px 16px 6px 16px;
        border-radius: 4px;
        gap: 4px;
        background: #2d5cf6;
        color: #ffffff;
        font-size: 14px;

        .btnIcon {
          width: 20px;
        }
      }
    }
  }

  .main {
    .common {
      padding: 24px;
      border-radius: 10px;
      background-color: #fff;
    }
    .main-item {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
    /deep/.tableCard {
      height: 100%;
      padding: 0;
      display: flex;
      flex-direction: column;
      & > .content {
        width: 100%;
        flex: 1;
        display: flex;
        gap: 10px;
        margin-top: 16px;
      }
    }
  }
}
.my-date-picker {
  width: 100%;
  /deep/.el-range-separator {
    width: 10%;
  }
}
</style>
