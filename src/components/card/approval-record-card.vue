<template>
  <div class="record-detail" v-loading="loading">
    <empty v-if="!hasData"></empty>
    <div v-else> 
    <div v-for="(activity, index) in recordList" :key="index" class="task-item pointer">
      <div class="left">
        <div class="top-line"></div>
        <img src="@/assets/image/ai-approval/timeline-ellipse.svg" alt="" class="dot" />
        <div class="bottom-line"></div>
      </div>
      <div class="right">
        <p class="taskname-staff">
          <span class="taskname">{{ activity.name }}</span>
          <span class="staff">
            <i>{{ activity.nodeUser }}</i>
            <i class="post" v-if="activity.orgName">（{{ activity.orgName }}）</i>
            <img src="@/assets/image/ai-approval/record-avatar.svg" alt="" />
          </span>
        </p>
        <div class="time-notes">
          <div v-if="activity.activityId == 'root'">
            任务发起：{{ activity.createTime|timeFormat }}
          </div>
          <div class="time-note" v-else>
            <span>任务到达：{{ activity.createTime | timeFormat }}</span>
            <span class="handle-time">处理：<i>{{ activity.handleTime }}</i></span>
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
          <div v-for="(item, idx) in activity.optionVOList" :key="idx" class="opinions-item">
               <!-- v-if="activity.targetPage === 'ocr'" -->
            <!-- <div class="opinion-tag">
              <span v-if="item.substantiveOpinions == 1" class="guanzhu">
             
                <i class="iconfont icon icon-guanzhu"></i>
                有实质意见
              </span>
              <span v-if="item.substantiveOpinions == 0" class="guanzhu2">
                <i class="iconfont icon icon-guanzhu2"></i>
                无实质意见
              </span>
            </div> -->
            <p class="opinion-text">{{ idx + 1 }} {{ item.comments }}</p>
            <!-- <div class="relevant-file">
              关联文件：<i class="file-name ellipsis ellipsis_1">{{ item.fileList && item.fileList[0] }} </i>
              <el-popover placement="bottom" popper-class="file-overview-popper" trigger="click"
                v-if="item.fileList && item.fileList.length > 1">
                <div class="file-list">
                  <div class="file-list-item pointer ellipsis ellipsis_1 " v-for="(file, idx) in item.fileList" :key="idx">
                    {{ file }}
                  </div>
                </div>
                <i slot="reference">+{{ item.fileList.length - 1 }}</i>
              </el-popover>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import moment from 'moment';
import { instanceInfo } from '@/api/applyCenter'
import empty from '@/components/common/empty'
export default {
  components: { empty },
  name:'approved-record-card',
  props: {
        sidebarParam: {
            type: Object,
            default: () => { }
        }
    },
  data() {
    return {
      hasData: false,
      loading:false,
      recordList: [],
    };
  },
  mounted() {
    this.init()
  },
  activated(){
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      instanceInfo({
        "processInstanceId": this.$route.params.processInstanceId||this.sidebarParam.processInstanceId||'32054c89-35d8-11ee-888e-d4d853dcb3dc',
      }).then(res => {
        const { endDetailsList } = res.data.data
        if (!endDetailsList) {
          return this.hasData = false
        }
        this.recordList = endDetailsList instanceof Array&& endDetailsList.length ? endDetailsList.map(v => {
          return {
            ...v,
            editedCommentsList: v.editedCommentsList&&v.editedCommentsList.length ? v.editedCommentsList.map(m => {
              return {
                ...m,
                fileList: m.associatedAttachmentsIds.split(',')
              }
            }) : []
          }
        }) : []
        return this.hasData = true

      }).finally(() => {
        this.loading = false
      })
    }
  },
  filters: {
    timeFormat(val) {
      return moment(val).format('MM-DD HH:mm')
    },
    handleTimeFormat(val) {
      let timediff = moment(val.updateTime).diff(moment(val.createTime), 'seconds');
      timediff = timediff > 0 ? (timediff / 3600).toFixed(1) : 0
      return timediff

    }
  }
};
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

        .opinion-tag {
          position: absolute;
          top: 0;
          left: -4px;
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
        }

        .opinion-text {
          color: #1d2128;
          text-align: justify;
          margin-bottom: 6px;
        }

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