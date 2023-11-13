<template>
  <div class="data-overview" v-loading="isShow">
    <template v-for="(item, index) in list">
      <div class="item" :key="'total' + item.id">
        <div class="top">
          <img class="left" :src="item.title.src" alt="" />
          <span class="right">
            <div class="right-top">
              <span class="top-name">{{ item.title.name }}</span>

              <el-tooltip placement="top">
                <div slot="content">{{ item.title.info }}</div>
                <i class="iconfont icon-tishi1 top-icon"></i>
              </el-tooltip>
            </div>
            <div class="right-content">
              <i class="content-number">{{ item.content.unifiedReturn }}</i
              >{{ item.title.unit }}
            </div>
          </span>
        </div>
        <div class="bottom" v-if="index === 0">
          <div class="btn-item">
            有实质性意见
            <i class="color-blue">{{ item.content.haveSubstantiveOpinionFormRatio }}</i> 项 占
            <i class="color-blue">{{ item.content.haveSubstantiveOpinionFormRatio }}</i> %
          </div>
          <div class="btn-item">
            无实质性意见
            <i class="color-blue">{{ item.content.noHaveSubstantiveOpinionForm }}</i> 项 占
            <i class="color-blue">{{ item.content.noHaveSubstantiveOpinionFormRatio }}</i> %
          </div>
        </div>
        <div class="bottom" v-else-if="index === 1">
          <div class="btn-item">
            有实质性意见
            <i class="color-blue">{{ item.content.havingSubstantiveOpinion }}</i> 项 总接受
            <i class="color-blue">{{ item.content.opinionAdoptTotal }} </i> 条
          </div>
          <div class="btn-item">
            无实质性意见
            <i class="color-blue">{{ item.content.nothingSubstantiveOpinion }}</i> 条
          </div>
        </div>
        <div class="bottom" v-else-if="index === 2">
          <div class="btn-item">
            最长审查时长 <i class="color-blue">{{ item.content.maximumReviewTime }}</i> h
          </div>
          <div class="btn-item">
            最短审查时长
            <i class="color-blue">{{ item.content.minimumReviewTime }}</i> h
          </div>
        </div>
        <div class="bottom" v-else-if="index === 3">
          <div class="btn-item">
            有实质性意见的接受条数
            <i class="color-blue">{{ item.content.receivingWorkOrdersCount }}</i> 项
          </div>
        </div>
        <div class="bottom" v-else-if="index === 4">
          <div class="btn-item">
            通过率最高的审查类型：<i class="color-blue">{{
              item.content.theHighestPassRateCategory
            }}</i>
          </div>
          <div class="btn-item">
            通过率最低的审查类型：<i class="color-blue">{{
              item.content.theLowestPassRateCategory
            }}</i>
          </div>
        </div>
      </div>
      <span class="item-line" :key="item.id" v-show="index !== 4"></span>
    </template>
  </div>
</template>

<script>
import { overviewOfReviewData } from '@/api/statistical-center'
export default {
  data() {
    return {
      isShow: true,
      list: [
        {
          id: '134',
          title: {
            name: '审查总量',
            info: '展示选中的所提交审查任务的数量',
            src: require('@/assets/image/statistical-center/overview-1.svg'),
            unit: '项'
          },
          content: {
            unifiedReturn: 0,
            haveSubstantiveOpinionFormRatio: 0,
            hasPercentage: 0,
            noHaveSubstantiveOpinionForm: 0,
            noHaveSubstantiveOpinionFormRatio: 0
          }
        },
        {
          id: '1234',
          title: {
            name: '审查意见总量',
            info: '展示选中所提的任务单收到的审查意见条数',
            src: require('@/assets/image/statistical-center/overview-2.svg'),
            unit: '条'
          },
          content: {
            unifiedReturn: 0,
            havingSubstantiveOpinion: 0,
            opinionAdoptTotal: 0,
            nothingSubstantiveOpinion: 0
          }
        },
        {
          id: '4332',
          title: {
            name: '平均审查时长',
            info: '展示选中所审批的任务单的平均处理时长',
            src: require('@/assets/image/statistical-center/overview-3.svg'),
            unit: 'h'
          },
          content: {
            unifiedReturn: 0,
            maximumReviewTime: 0,
            minimumReviewTime: 0
          }
        },
        {
          id: '4545',
          title: {
            name: '接受率',
            info: '接受率为有实质性修改意见的接受率',
            src: require('@/assets/image/statistical-center/overview-4.svg'),
            unit: '%'
          },
          content: {
            receivingWorkOrdersCount: 0,
            unifiedReturn: 0,
          }
        },
        {
          id: '3421',
          title: {
            name: '一次性通过率',
            info: '一审通过率为该机构所提任务单申请人确认时对全部意见点击采纳（第一次点击）和确认总数的占比',
            src: require('@/assets/image/statistical-center/overview-5.svg'),
            unit: '%'
          },
          content: {
            unifiedReturn: 0,
            theHighestPassRateCategory: '',
            theLowestPassRateCategory: ''
          }
        }
      ]
    }
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    async initData(data) {
      this.isShow = true
      const { data: res } = await overviewOfReviewData(data)
      if (res.success) {
        const res1 = [
          res.data.reviewTotalAmount,
          res.data.totalNumberOfReviewOpinions,
          res.data.averageReviewFrequency,
          res.data.acceptanceRate,
          res.data.oneTimePassRate
        ]
        this.list.forEach((item, index) => {
          item.content = res1[index]
        })
        this.isShow = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@color-1: #1d2128;
@color-2: #2d5cf6;
@color-3: #86909c;
@color-4: #e5e6eb;
@color-5: rgba(172, 177, 185, 1);
.data-overview {
  display: flex;
  gap: 16px;
  border: 1px solid;
  border-image: linear-gradient(rgba(123, 97, 255) 0%, rgba(97, 160, 255) 30%);
  line-height: 22px;
  .color-blue {
    color: @color-2;
  }
  .item {
    flex: 1;
    padding: 20px 0 20px 24px;
    .top {
      display: flex;
      margin-bottom: 8px;
      .left {
        margin-right: 16px;
      }
      .right {
        flex: 1;
        &-top {
          display: flex;
          .top-name {
            margin-right: 4px;
            font-weight: 700;
            color: @color-1;
          }
          .top-icon {
            color: @color-5;
            font-size: 18px;
          }
        }
        &-content {
          color: @color-3;
          .content-number {
            line-height: 28px;
            font-size: 20px;
            font-weight: 700;
            color: @color-2;
            margin-right: 4px;
          }
        }
      }
    }
    .bottom {
      .btn-item {
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
  .item-line {
    width: 1px;
    margin: 39px 0;
    background-color: @color-4;
  }
}
</style>
