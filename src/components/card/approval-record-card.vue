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
            <span class="taskname">{{ activity.name }}</span>
            <span class="staff">
              <i>{{ activity.nodeUserName }}</i>
              <i class="post" v-if="activity.orgName">（{{ activity.orgName }}）</i>
              <img src="@/assets/image/ai-approval/record-avatar.svg" alt="" />
            </span>
          </p>
          <div class="time-notes">
            <div v-if="activity.activityId == 'root'">
              任务发起：{{ activity.createTime | timeFormat }}
            </div>
            <div class="time-note" v-else>
              <span>任务到达：{{ activity.createTime | timeFormat }}</span>
              <span class="handle-time">处理：<i>{{ activity | handleTimeFormat }}</i> 小时</span>
              <span>任务结束：{{ activity.endTime | timeFormat }}</span>
            </div>
          </div>
          <div class="opinions" v-if="activity.activityId !== 'root'">
            <!-- ocr审批有个关联的审查要点 -->
            <!-- <div class="point opinions-item">
            <div class="opinion-tag">
              <span class="approval-point-icon guanzhu" style="background: #505968;color: #fff">
                <i class="iconfont icon icon-tubiao4"></i>审查要点
              </span>
            </div>
            <div>
              <span>缺少以下要点</span><br />
              <span><i style="color: #86909C;">产品要点：</i>重要提示(理财有风险、投资需谨慎等）</span><br />
              <span>不符合以下要点</span><br />
              <span><i style="color: #86909C;">审查要点：</i>承担义务不得低于宣传所承诺的标准</span>
            </div>
          </div> -->
          <!-- 有无实质意见-start -->
            <div v-for="(item, idx) in activity.optionVOList" :key="idx" class="opinions-item">
              <!-- v-if="activity.targetPage === 'ocr'" -->
              <div class="opinion-tag">
                <span v-if="item.opinion == 1" class="guanzhu">
                  <i class="iconfont icon icon-guanzhu"></i>
                  有实质意见
                </span>
                <span v-if="item.opinion == 0" class="guanzhu2">
                  <i class="iconfont icon icon-guanzhu2"></i>
                  无实质意见
                </span>
              </div>
              <p class="opinion-text">
                <i v-if="activity.optionVOList.length > 1">{{ idx + 1 }}</i>
                {{ item.str }}
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
                            <!-- 领导审批通过/驳回 --start-->
          <!-- <div v-for="(item, idx) in activity.optionVOList" :key="idx" class="opinions-item">
                    <div class="leader-approval">
            <div class="opinion-tag">
                <span v-if="item.opinion == 1" class="guanzhu2">
                  <i class="iconfont icon icon-tubiao"></i>
                  通过
                </span>
                <span v-if="item.opinion == 0" class="guanzhu">
                  <i class="iconfont icon icon-tuihui1 pass"></i>
                  驳回
                </span>
              </div>

              <p class="opinion-text"  v-if="item.opinion == 1">
                1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权；
              </p>
               <div class="opinion-text reject-desc" v-if="item.opinion == 0">
                <p>驳回节点：<i>发起人</i></p>
                <p>驳回原因：<i>附件材料与审批项目不匹配附件材料与审批项目不匹配</i></p>
                <p>原因描述：<i>附件中“景顺长城集英成长策划”与审批项目不匹配，不能作为该项目的审查材料，请重新提交申请。</i></p>
              </div>
          </div>
        </div> -->
          <!-- 领导审批通过/驳回 --end-->
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
      // const res = {data:xx}
      // console.log('dd',xx)
      // const { detailVOList } = res.data.data
      // if (!detailVOList) {
      //   return this.hasData = false
      // }
      // // detailVOList
      // const keys = Object.keys(detailVOList)
      // let arr = []
      // for (let i in keys) {
      //   let obj = {
      //     ...detailVOList[keys[i]][0],
      //     name:detailVOList[keys[i]][0].activityId=='endEventNode'?'已结束':detailVOList[keys[i]][0].name
      //   }
      //   arr.push(obj)
      // }
      // const arr_handler = arr.sort((a,b)=> {
      //   return dayjs(a.createTime)-dayjs(b.createTime)
      // })
      // this.recordList = arr_handler instanceof Array && arr_handler.length ? arr_handler.map(v => {
      //   const comments = v.optionVOList && v.optionVOList[0].comments
      //   return {
      //     ...v,
      //     optionVOList: JSON.parse(comments),
      //   }
      // }) : []
      // return this.hasData = true

      instanceInfo({
        processInstanceId:
          (this.$route.params && this.$route.params.processInstanceId) || (this.sidebarParam && this.sidebarParam.processInstanceId)
      })
        .then((res) => {
          const { detailVOList } = res.data.data
          if (!detailVOList) {
            this.hasData = false
            return false
          }
          // detailVOList
          const keys = Object.keys(detailVOList)
          const arr = []
          for (const i in keys) {
            const obj = {
              ...detailVOList[keys[i]][0],
              name:
                detailVOList[keys[i]][0].activityId === 'endEventNode'
                  ? '已结束'
                  : detailVOList[keys[i]][0].name
            }
            arr.push(obj)
          }
          // eslint-disable-next-line
          const arr_handler = arr.sort((a, b) => {
            return dayjs(a.createTime) - dayjs(b.createTime)
          })
          // eslint-disable-next-line
          this.recordList = arr_handler instanceof Array && arr_handler.length ? arr_handler.map((v) => {
            const comments = v.optionVOList && v.optionVOList[0].comments
            const handlerComents = JSON.parse(comments)
            // handlerComents = handlerComents?.map(m => {
            //   return {
            //     ...m,
            //     files: m.files?.map(m => {
            //       let arr = m.split('_')
            //       arr = arr.slice(2)
            //       return arr.join('_')
            //     }) || []
            //   }
            // })||[]
            return {
              ...v,
              optionVOList: handlerComents
            }
          })
            : []
          this.hasData = true
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  filters: {
    timeFormat(val) {
      return val ? dayjs(val).format('MM-DD HH:mm') : '--'
    },
    handleTimeFormat(val) {
      let timediff = dayjs(val.endTime).diff(dayjs(val.createTime), 'second')
      const _timediff = timediff > 0 ? (timediff / 3600).toFixed(1) : 0
      _timediff < 0.1
        ? (timediff = (timediff / 3600).toFixed(2))
        : (timediff = _timediff)
      return val.endTime ? timediff : '--'
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
          .pass{
            color: #fff;
          }
        }
        .opinion-text {
          color: #1d2128;
          text-align: justify;
          margin-bottom: 6px;
        }
        .reject-desc{
          p{
            display: flex;
            color: #86909C;
            i{
              color: #1D2128;
              flex: 1;
            }
          }
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
}</style>
