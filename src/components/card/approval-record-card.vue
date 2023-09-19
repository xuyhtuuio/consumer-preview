<template>
  <div class="record-detail" v-loading="loading">
    <empty v-if="!hasData"></empty>
    <div v-else>
      <div v-for="(activity, index) in recordList" :key="index" class="task-item">
        <div class="left">
          <div class="top-line"></div>
          <img src="@/assets/image/ai-approval/timeline-ellipse.svg" alt="" class="dot" />
          <div class="bottom-line"></div>
        </div>
        <div class="right">
          <p class="taskname-staff">
            <span class="taskname">{{ activity.nodeName }}</span>
            <span class="staff">
              <i>{{ activity.userInfoList.name }}</i>
              <i class="post" v-if="activity.userInfoList.name">（{{ activity.userInfoList.org }}）</i>
              <img src="@/assets/image/ai-approval/record-avatar.svg" alt="" />
            </span>
          </p>
          <div class="time-notes">
            <div v-if="activity.nodeId == 'root'">
              任务发起：{{ activity.created | timeFormat }}
            </div>
            <div class="time-note" v-else>
              <span>任务到达：{{ activity.created | timeFormat }}</span>
              <span class="handle-time">处理：<i>{{ activity | handleTimeFormat }}</i> 小时</span>
              <span>任务结束：{{ activity.ended | timeFormat }}</span>
            </div>
          </div>
          <div class="opinions" v-if="activity.nodeId !== 'root'">
            <div v-if="activity.nodeType == 'XIAOBAO'">
              <!-- ocr审批有个关联的审查要点 -->
              <div v-if="activity.keyPointsForVerification && activity.keyPointsForVerification.length"
                class="point opinions-item">
                <div class="opinion-tag">
                  <span class="approval-point-icon guanzhu" style="background: #505968;color: #fff">
                    <i class="iconfont icon icon-tubiao4"></i>审查要点
                  </span>
                </div>
                <div v-for="(keyPoint, index) in activity.keyPointsForVerification" :key="index" class="prod-point">
                  <!-- 如果是 -->
                  <div v-html="handleKeyPointer(keyPoint)">
                  </div>
                </div>
              </div>
              <!-- 有无实质意见-start -->
              <div v-for="(item, idx) in activity.substantiveOpinionList" :key="idx" class="opinions-item">
                <!-- v-if="activity.targetPage === 'ocr'" -->
                <div class="opinion-tag">
                  <span v-if="item.substantiveOpinons == 1" class="guanzhu">
                    <i class="iconfont icon icon-guanzhu"></i>
                    有实质意见
                  </span>
                  <span v-if="item.substantiveOpinons == 0" class="guanzhu2">
                    <i class="iconfont icon icon-guanzhu2"></i>
                    无实质意见
                  </span>
                </div>
                <p class="opinion-text">
                  <i>{{ idx + 1 }}</i>
                  {{ item.content }}
                </p>
                <div class="relevant-file" v-if="item.files && item.files.length">
                  关联文件：<i class="file-name ellipsis ellipsis_1">{{ item.files && item.files[0] }}
                  </i>
                  <el-popover placement="bottom-end" popper-class="file-overview-popper" trigger="click"
                    v-if="item.files && item.files.length > 1">
                    <div class="file-list">
                      <div class="file-list-item ellipsis ellipsis_1" v-for="(file, idx) in item.files" :key="idx">
                        {{ file }}
                      </div>
                    </div>
                    <i slot="reference" class="pointer">+{{ item.files.length - 1 }}</i>
                  </el-popover>
                </div>
              </div>
              <!-- 有无实质意见-end -->
            </div>
            <!-- 领导审批通过/驳回 --start-->
            <div v-if="activity.nodeType == 'LEADER'" class="opinions-item">
              <div class="leader-approval" v-if="activity.opinion">
                <div class="opinion-tag">
                  <span v-if="activity.opinion.success" class="guanzhu2">
                    <i class="iconfont icon icon-tubiao"></i>
                    通过
                  </span>
                  <span v-else class="guanzhu">
                    <i class="iconfont icon icon-tuihui1 pass"></i>
                    驳回
                  </span>
                </div>

                <p class="opinion-text" v-if="activity.opinion.success">
                  {{ activity.opinion?.msg || '暂无审批意见' }}
                </p>
              </div>
            </div>
            <!-- 领导审批通过/驳回 --end -->
            <!-- 消保的驳回 -->
            <div v-if="activity.nodeType == 'REFUSE'" class="opinions-item">
              <div class="opinion-tag">
                <span class="guanzhu">
                  <i class="iconfont icon icon-tuihui1 pass"></i>
                  驳回
                </span>
              </div>
              <div class="opinion-text reject-desc">
                <p v-if="activity.refuseName">驳回节点：<i>{{ activity.refuseName }}</i></p>
                <p>
                  驳回原因：<i>{{ activity.opinion }}</i>
                </p>
                <p v-if="activity.refuseDesc">
                  原因描述：<i>{{ activity.refuseDesc }}</i>
                </p>
              </div>
            </div>
            <!-- 确认--start  -->
            <div v-if="activity.nodeType == 'CONFIRM'" class="opinions-item">
              <div class="opinion-text">
                <p>
                  已采纳意见<i style="color: #2d5cf6">{{
                    activity.adoptedResults || '0'
                  }}</i>条，不采纳意见<i style="color: #2d5cf6">{{
  activity.unAdoptedResults || '0'
}}</i>条；
                </p>
                <p style="color: #86909c; margin-top: 6px">
                  可在审查意见书查看详情
                </p>
              </div>
            </div>
            <!-- 确认--end  -->
            <!-- 转办--start  -->
            <div v-if="activity.nodeType == 'TRANSFER'" class="opinions-item">
              <div class="opinion-text">
                转办
              </div>
            </div>
            <!-- 转办--end  -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import * as dayjs from 'dayjs'
import { instanceInfo } from '@/api/applyCenter'
import empty from '@/components/common/empty'
export default {
  components: { empty },
  name: 'approved-record-card',
  props: {
    sidebarParam: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      hasData: false,
      loading: false,
      recordList: []
    }
  },
  mounted() {
    if (this.sidebarParam || this.$route.params) {
      this.init()
    }
  },
  activated() { },
  methods: {
    init() {
      this.loading = true
      instanceInfo({
        formId: this.$route.params?.formId || this.sidebarParam?.recordId,
        templateId: this.$route.params?.processTemplateId || this.sidebarParam?.processTemplateId,
        processInstanceId: this.$route.params?.processInstanceId || this.sidebarParam?.processInstanceId
      })
        .then((res) => {
          const { detailVOList } = res.data?.data
          if (!detailVOList) {
            this.hasData = false
            return false
          }
          // eslint-disable-next-line
          this.recordList =
            detailVOList instanceof Array && detailVOList.length
              ? detailVOList.map((v) => {
                let opinion = null
                let refuseDesc = null
                if (v.nodeType === 'REFUSE') {
                  const len = v.opinion?.indexOf('-')
                  opinion = len > 0 ? v.opinion?.substring(0, len) : v.opinion
                  refuseDesc = len > 0 ? v.opinion?.substring(len + 1, v.opinion.length) : ''
                } else {
                  opinion = v.opinion ? JSON.parse(v.opinion) : ''
                }
                return {
                  ...v,
                  opinion,
                  refuseDesc,
                  keyPointsForVerification: v.keyPointsForVerification ? JSON.parse(v.keyPointsForVerification) : '',
                  userInfoList: v.userInfoList?.[0] || []
                }
              })
              : []
          this.hasData = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleKeyPointer(val) {
      let box = ''
      // 用户配置的选项组
      const { options } = val.props
      // 用户针对配置的选项组后做的勾选
      const { value } = val
      if (val.name === 'MultipleSelect') {
        const missPoint = options.filter(v => !value.includes(v.id))
        if (missPoint.length) {
          box += '<p style="color:#505968;">（缺少以下要点）</p>'
          missPoint.forEach(m => {
            box += `<p style='margin-bottom:4px;color:#1D2128;'>${m.value}</p>`
          })
        } else {
          box += '<p style="color:#505968;">符合所有要点</p>'
        }
      } else if (val.name === 'SingleGroupsSelect') {
        const relativeValue = options.map((labelItem) => {
          const isRelative = labelItem.children.filter((childValue) => val.value.includes(childValue.id))[0]?.value || ''
          return {
            point: labelItem.value,
            isRelative
          }
        })
        relativeValue.forEach(m => {
          box += `<p style='margin-bottom:4px;display:flex; justify-content: space-between;align-items:flex-start;'><span style="margin-right:10px;">${m.point}</span><span style='color:#86909C;'>${m.isRelative}</span></p>`
        })
      }
      return box
    }
  },
  filters: {
    timeFormat(val) {
      return val ? dayjs(val).format('MM-DD HH:mm') : '--'
    },
    handleTimeFormat(val) {
      let timediff = dayjs(val.ended).diff(dayjs(val.created), 'second')
      const _timediff = timediff > 0 ? (timediff / 3600).toFixed(1) : 0
      _timediff < 0.1
        ? (timediff = (timediff / 3600).toFixed(2))
        : (timediff = _timediff)
      return val.ended ? timediff : '--'
    }
  }
}
</script>
<style lang="less" scoped>
.record-detail {
  .task-item:hover {
    .right {
      border-radius: 6px;
      background: #f0f6ff !important;

      .opinions-item {
        background: #fff;
      }
    }
  }

  .task-item {
    width: 100%;

    .taskname-staff {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .taskname {
        color: #1d2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
      }

      .staff {
        display: flex;
        color: #1d2128;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;

        img {
          width: 20px;
          height: 20px;
        }

        .avatar {
          width: 20px;
          height: 20px;
          background: #80a6ff;
          text-align: center;
          line-height: 20px;
          border-radius: 20px;
          font-weight: 600;
          color: #fff;
          font-size: 12px;
        }

        /* 166.667% */
      }
    }

    .time-notes {
      width: 120%;
      color: #1d2128;
      font-size: 10px;
      font-weight: 400;
      line-height: 18px;
      display: flex;
      margin-bottom: 8px;
      font-size: 10px;
      transform: scale(0.83333);
      transform-origin: 0 0;

      .time-note {
        display: flex;
        width: 100%;
        padding-bottom: 8px;
        justify-content: space-between;
        border-bottom: 1px dashed #e5e6eb;

        span {
          flex: 1;
        }

        .handle-time {
          color: #2d5cf6;
          text-align: center;
          font-style: normal;
          font-weight: 400;
          line-height: 18px;

          i {
            font-weight: 700;
          }

          /* 180% */
        }
      }
    }

    .opinions {
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;

      .opinions-item {
        border-radius: 10px;
        background: #f7f8fa;
        padding: 16px 16px 12px 16px;
        margin-bottom: 8px;
        position: relative;

        .relevant-file {
          color: #86909c;
          display: flex;
          align-items: center;
          word-break: keep-all;

          .file-name {
            margin: 0 8px 0 0;
            background: #fff;
            padding: 2px 12px;
            word-break: break-all;
          }

          i {
            color: #306ef5;
          }
        }
      }
    }

    .opinion-tag {
      position: absolute;
      top: -2px;
      left: -8px;
      border-radius: 0px 6px 6px 6px;
      color: #fff;
      font-style: normal;
      line-height: 14px;
      overflow: hidden;
      font-size: 10px;
      -webkit-transform: scale(0.8);

      .guanzhu {
        display: inline-block;
        padding: 2px 4px;
        border-radius: 0px 6px 6px 6px;
        background: linear-gradient(90deg, #e85167 0%, #ff8193 100%);
      }

      .guanzhu2 {
        display: inline-block;
        padding: 2px 4px;
        border-radius: 0px 6px 6px 6px;
        background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 100%);
      }

      .pass {
        color: #fff;
      }
    }

    .opinion-text {
      color: #1d2128;
      text-align: justify;
      margin-bottom: 6px;
    }

    .reject-desc {
      p {
        display: flex;
        color: #86909c;

        i {
          color: #1d2128;
          flex: 1;
        }
      }
    }

    .prod-point {
      border-bottom: 1px dashed #E5E6EB;
      padding-bottom: 2px;
      margin: 6px 0;
    }

    .prod-point:last-of-type {
      border-bottom: none;
      padding-bottom: 0;
      margin: 0;
    }
  }

  .task-item {
    display: flex;
    justify-content: flex-start;
    position: relative;

    .left {
      width: 13px;
      // left: -20px;
      // height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-height: 100%;
      margin-right: 8px;

      .dot {
        width: 13px;
        height: 13px;
      }

      .top-line {
        height: 16px;
        width: 1px;
        background-repeat: no-repeat;
        background-repeat-y: inherit;
        background-image: url(../../assets//image/ai-approval/record-line.svg);
      }

      .bottom-line {
        height: calc(100% - 30px);
        width: 1px;
        background-repeat: no-repeat;
        background-repeat-y: inherit;
        background-image: url(../../assets//image/ai-approval/record-line.svg);
      }
    }

    .right {
      flex: 1;
      padding: 12px;
    }
  }
}
</style>
<style lang="less">
.file-overview-popper {
  max-width: 422px;
  padding: 8px 12px;
  padding-bottom: 0;
  box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);

  .file-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .file-list-item {
      width: fit-content;
      display: inline-block;
      border-radius: 4px;
      background: #f7f8fa;
      padding: 2px 12px;
      color: #306ef5;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      margin-bottom: 8px;
    }
  }
}
</style>
