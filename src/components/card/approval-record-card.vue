<template>
  <div class="record-detail">
    <div
      v-for="(activity, index) in recordList"
      :key="index"
      class="task-item pointer"
    >
      <div class="left">
        <div class="top-line"></div>
        <img
          src="@/assets/image/ai-approval/timeline-ellipse.svg"
          alt=""
          class="dot"
        />
        <div class="bottom-line"></div>
      </div>
      <div class="right">
        <p class="taskname-staff">
          <span class="taskname">{{ activity.taskName }}</span>
          <span class="staff">
            <i>{{ activity.initiator }}</i>
            <i class="post">（{{ activity.post }}）</i>
            <img src="@/assets/image/ai-approval/record-avatar.svg" alt="" />
          </span>
        </p>
        <div class="time-notes">
          <div v-if="activity.taskName == '发起申请'">
            任务发起：{{ activity.startingtime }}
          </div>
          <div class="time-note" v-else>
            <span>任务到达：07-08 09:12</span>
            <span class="handle-time">处理：<i>12 小时</i></span>
            <span>任务结束：07-08 09:12</span>
          </div>
        </div>
        <div class="opinions" v-if="activity.taskName !== '发起申请'">
          <div
            v-for="(item, idx) in activity.substantiveopinion"
            :key="idx"
            class="opinions-item"
          >
            <div class="opinion-tag" v-if="activity.targetPage === 'ocr'">
              <span v-if="item.isSubstantive" class="guanzhu">
                <i class="iconfont icon icon-guanzhu"></i>
                有实质意见
              </span>
              <span v-if="!item.isSubstantive" class="guanzhu2">
                <i class="iconfont icon icon-guanzhu2"></i>
                无实质意见
              </span>
            </div>
            <p class="opinion-text">{{ idx + 1 }} {{ item.opinion }}</p>
            <div class="relevant-file">
              关联文件：<i class="file-name">{{ item.relevantfile }} </i>
              <el-popover
                placement="bottom"
                popper-class="file-overview-popper"
                trigger="click"
                v-if="item.file && item.file.length"
              >
                <div class="file-list">
                  <div
                    class="file-list-item pointer"
                    v-for="(file, idx) in item.file"
                    :key="idx"
                  >
                    {{ file }}
                  </div>
                </div>
                <i slot="reference">+{{ item.file.length }}</i>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      recordList: [
        {
          startingtime: "07-08 09:12",
          initiator: "谭新宇",
          post: "产品研发与推广岗",
          taskName: "发起申请",
          arrivaltime: "07-08 09:12",
          finishtime: "07-08 09:12",
          handletime: "12",
          substantiveopinion: [
            {
              opinion:
                "1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: "理财公司理财.png",
              isSubstantive: false,
            },
          ],
          targetPage: "领导审批",
        },
        {
          startingtime: "07-08 09:12",
          initiator: "谭新宇",
          post: "产品研发与推广岗",
          taskName: "发起申请1",
          arrivaltime: "07-08 09:12",
          finishtime: "07-08 09:12",
          handletime: "12",
          substantiveopinion: [
            {
              opinion:
                "1.活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: "理财公司理财.png",
              isSubstantive: false,
            },
          ],

          targetPage: "领导审批",
        },
        {
          startingtime: "07-08 09:12",
          initiator: "谭新宇",
          post: "产品研发与推广岗",
          taskName: "发起申请1",
          arrivaltime: "07-08 09:12",
          finishtime: "07-08 09:12",
          handletime: "12",
          substantiveopinion: [
            {
              opinion:
                "活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: "理财公司理财.png",
              isSubstantive: false,
            },
          ],
          targetPage: "领导审批",
        },
        {
          startingtime: "07-08 09:12",
          initiator: "谭新宇",
          post: "产品研发与推广岗",
          taskName: "发起申请1",
          arrivaltime: "07-08 09:12",
          finishtime: "07-08 09:12",
          handletime: "12",
          substantiveopinion: [
            {
              opinion:
                "活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: "理财公司理财.png",
              isSubstantive: false,
            },
          ],
          targetPage: "领导审批",
        },
        {
          startingtime: "07-08 09:12",
          initiator: "谭新宇",
          post: "产品研发与推广岗",
          taskName: "发起申请1",
          arrivaltime: "07-08 09:12",
          finishtime: "07-08 09:12",
          handletime: "12",
          substantiveopinion: [
            {
              opinion:
                "活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: "理财公司理财.png",
              isSubstantive: false,
            },
          ],
          targetPage: "ocr",
        },
        {
          startingtime: "07-08 09:12",
          initiator: "谭新宇",
          post: "产品研发与推广岗",
          taskName: "发起申请1",
          arrivaltime: "07-08 09:12",
          finishtime: "07-08 09:12",
          handletime: "12",
          substantiveopinion: [
            {
              opinion:
                "活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: "理财公司理财.png",
              file: [
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
                "理财公司理财.png",
              ],
              isSubstantive: true,
            },
            {
              opinion:
                "ww活动应明确参与条件，如“达标私钻”专享，避免引起歧义，引发金融消费者不满；如存在收费情况，应提前向金融消费者明示，尊重金融消费者知情权",
              relevantfile: "理财公司理财.png",
              isSubstantive: false,
            },
          ],
          targetPage: "ocr",
        },
      ],
    };
  },
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

          .file-name {
            margin: 0 8px 0 0;
            background: #fff;
            padding: 2px 12px;
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
        height: 84%;
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
    flex-wrap: wrap;

    .file-list-item {
      width: 31%;
      border-radius: 4px;
      background: #f7f8fa;
      padding: 2px 12px;
      color: #306ef5;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      margin-right: 12px;
      margin-bottom: 8px;
    }
    .file-list-item:nth-of-type(3n) {
      margin-right: 0;
    }
  }
}
</style>