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
            :props="{ checkStrictly: true }"
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
              :label="item.label"
              :value="item.value"
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
        <DataOverview />
      </div>
      <div class="main-item flex" style="gap: 16px">
        <TypeDistribution class="common" />
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
  data() {
    return {
      search: {
        billValue: '',
        datePicker: '',
        cascader: ''
      },
      pickerOptions: {
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
      billOptions: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '产品类',
          label: '产品类'
        },
        {
          value: '活动类',
          label: '活动类'
        },
        {
          value: '客户类',
          label: '客户类'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      organOptions: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                },
                {
                  value: 'color',
                  label: 'Color 色彩'
                },
                {
                  value: 'typography',
                  label: 'Typography 字体'
                },
                {
                  value: 'icon',
                  label: 'Icon 图标'
                },
                {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                },
                {
                  value: 'input',
                  label: 'Input 输入框'
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                },
                {
                  value: 'select',
                  label: 'Select 选择器'
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                },
                {
                  value: 'switch',
                  label: 'Switch 开关'
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块'
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                },
                {
                  value: 'upload',
                  label: 'Upload 上传'
                },
                {
                  value: 'rate',
                  label: 'Rate 评分'
                },
                {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                },
                {
                  value: 'tag',
                  label: 'Tag 标签'
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条'
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件'
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页'
                },
                {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告'
                },
                {
                  value: 'loading',
                  label: 'Loading 加载'
                },
                {
                  value: 'message',
                  label: 'Message 消息提示'
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框'
                },
                {
                  value: 'notification',
                  label: 'Notification 通知'
                }
              ]
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单'
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页'
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑'
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单'
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条'
                }
              ]
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框'
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示'
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框'
                },
                {
                  value: 'card',
                  label: 'Card 卡片'
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯'
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板'
                }
              ]
            }
          ]
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleReset() {
      this.search = {
        billValue: '',
        datePicker: '',
        cascader: ''
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
