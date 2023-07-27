<template>
  <div class="apply-event-card">
    <div class="event-info">
      <div class="event-name-status">
        <!-- 加急 -->
        <svg class="icon urgent-icon" aria-hidden="true" v-if="item.urgent == 1">
          <use xlink:href="#icon-shenpiyemiantubiao"></use>
        </svg>
        <svg class="icon urgent-icon" aria-hidden="true" v-if="item.dismissalMark == 1">
          <use xlink:href="#icon-tongyongtubiao2"></use>
        </svg>
        <span class="event-name" @click="toDetail(item)">{{
          item.name || "点击去详情页"
        }}</span>
        <!-- 任务状态（1：审查中 2：待修改 3：待确认 4：已完成 -->
        <span class="event-status">
          <i v-if="item.taskStatus === '0'" class="tag draft">草稿</i>
          <i v-if="item.taskStatus === '1'" class="tag in-approval">审批中>{{ item.approvalStage }}</i>
          <i v-if="item.taskStatus === '2'" class="tag in-modify">待修改>{{ item.approvalStage }}</i>
          <i v-if="item.taskStatus === '3'" class="tag check">待确认>{{ item.approvalStage }}</i>
          <i v-if="item.taskStatus === '4'" class="end">
            <i class="tag end-sign"> 已结束 </i>
          </i>
          <!-- 有无意见 -->
          <i v-if="item.taskStatus === '3' || item.taskStatus === '4'" class="flex">
            <i class="tag has-opinion" v-if="item.hasOpinions == 1">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-guanzhu2"></use>
              </svg>
              有实质性意见
            </i>
            <i class="tag has-no-opinion" v-if="item.hasOpinions !== 1">
              <i class="iconfont icon-guanzhu"></i>
              无实质性意见
            </i>
            <i class="tag check" v-if="item.adoptionStatus == 0">
              <i class="iconfont icon-guanzhu2"></i>
              不采纳
            </i>
            <i class="tag adoption" v-else>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tubiao"></use>
              </svg>
              采纳
            </i>
          </i>
        </span>
      </div>
      <div class="event-infos" v-if="!item.errorinfo">
        <span class="id">{{ item.taskNumber }}</span>
        <span class="sDate date">发起时间：{{ item.create_time || "--" }}</span>
        <span class="sDate date">更新时间：{{ item.update_time || "--" }}</span>
        <span class="sDate date">上线时间：{{ item.launchDate || "--" }}</span>
        <el-popover placement="bottom" trigger="click" popper-class="popper-persons"
          v-if="item.currentAssignee && item.currentAssignee.length">
          <div style="max-height: 270x; overflow-y: auto">
            <div v-for="(child, index) in item.currentAssignee" :key="index" class="person-item">
              <span>{{ child.name }}/{{ child.WorkId }}/{{ child.Institution }}/{{
                child.Dep
              }}</span>
              <span class="reminder" @click="reminderItem(child)">{{
                child.hasReminder ? "已催单" : "催一下"
              }}</span>
            </div>
          </div>
          <span slot="reference" class="handler">当前处理人：{{
            (item.currentAssignee && item.currentAssignee[0].name) || "--"
          }}
            <i v-if="item.currentAssignee && item.currentAssignee.length > 1">+{{ item.currentAssignee &&
              item.currentAssignee.length - 1 }}</i></span>
        </el-popover>
        <span class="handler" v-else>当前处理人：--</span>
      </div>
      <div class="event-infos error" v-else>
        <svg class="icon urgent-icon" aria-hidden="true">
          <use xlink:href="#icon-baocuo1"></use>
        </svg>
        文件未上传成功，请检查文件名是否包含特殊符号，并重新提交
      </div>
    </div>
    <div class="right-operation">
      <!--  审核中的工单，展示“催单、关注” 工作流配置（扩展配置）中若此节点可撤销 展示撤销按钮-->
      <div v-if="item.taskStatus == 1 && item.isQuash == 1" class="flex">
        <span class="modify icon-op" @click="cancel(item)">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-tubiao1"></use>
          </svg>
          撤销
        </span>
        <span class="attention icon-op" @click="showReminderDialog(item)">
          <svg class="icon urgent-icon" aria-hidden="true" @click="urgentOrder(item)">
            <use xlink:href="#icon-guanzhu1"></use>
          </svg>
          催单
        </span>
      </div>
      <!-- 待确认  展示【确认】、【关注】 流程配置中确认人配置的非工单的发起人 不展示确认按钮-->
      <div class="flex">
        <span class="check icon-op" @click="check(item)">
          <span class="iconfont icon icon-tubiao"></span>
          确认
        </span>
      </div>
      <!-- 待修改 已采纳意见所有“有实质意见”显示，显示“修改、关注”按钮 流程配置中确认人配置的非工单的发起人 不展示【确认】操作-->
      <div v-if="item.taskStatus == 2" class="flex">
        <span class="modify icon-op" v-if="item.hasOpinions == 1">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-xianxingtubiao"></use>
          </svg>
          修改
        </span>
      </div>
      <!-- 草稿 文件解析失败 显示修改和删除 但不显示关注按钮-->
      <div class="flex" v-if="item.taskStatus == 0">
        <span class="modify icon-op">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-xianxingtubiao"></use>
          </svg>修改
        </span>
        <span class="del icon-op" @click="del(item)">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-xianxingtubiao-1"></use>
          </svg>删除
        </span>
      </div>
      <!--  是否显示关注：草稿；文件解析失败；不显示-->
      <div v-if="item.taskStatus != 0">
        <span class="attention no-attention icon-op" v-if="item.concernId == 0" @click="concern(item)">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-tubiao-1"></use>
          </svg>
          关注</span>
        <span class="attention has-attention icon-op" v-else @click="concern(item)">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-guanzhu-1"></use>
          </svg>已关注</span>
      </div>
    </div>
    <!-- 审批浮窗 -->
    <el-dialog :visible.sync="reminderDialog" align="center" custom-class="reminderDialog" :before-close="closeReminder">
      <p slot="title">请选择催单对象</p>
      <div>
        <div v-for="(child, index) in persons" :key="index" class="person-item">
          <span>{{ child.name }}/{{ child.WorkId }}/{{ child.Institution }}/{{
            child.Dep
          }}</span>
          <span class="reminder" @click="reminderItem(child)">{{
            child.hasReminder ? "已催单" : "催一下"
          }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { concernApplication } from "@/api/applyCenter";
export default {
  props: {
    item: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      reminderDialog: false,
      allowConcernClick: true,
      persons: [],
    };
  },
  methods: {
    toDetail(item) {
      window.sessionStorage.setItem(
        "order-detail",
        JSON.stringify({
          item,
          pageFrom: "apply",
        })
      );
      this.$router.push({
        path: "details",
      });
    },
    check(item) {
      window.sessionStorage.setItem(
        "order-detail",
        JSON.stringify({
          item: item,
          pageFrom: "apply",
          op: "check",
        })
      );
      this.$router.push({
        name: "details",
      });
    },
    showReminderDialog(item) {
      if (item.currentAssignee && item.currentAssignee.length) {
        this.reminderDialog = true;
        return;
      } else {
        this.$message({
          type: "warning",
          message: "此工单当前不存在处理人，无法催单",
        });
      }
    },
    cancel(item) {
      this.$confirm("确定撤销该申请吗？", "", {
        customClass: "confirmBox",
        confirmButtonText: "撤销",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("quash", item);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤销",
          });
        });
    },
    del(item) {
      this.$confirm("确定删除该草稿吗？", "", {
        customClass: "confirmBox",
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("del", item.taskNumber);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    reminderItem(item) {
      if (item.hasReminder) {
        return;
      } else {
        item.hasReminder = !item.hasReminder;
      }
    },
    urgentOrder(item) {
      this.persons = item.currentAssignee;
    },
    closeReminder() {
      this.reminderDialog = false;
      this.persons = [];
    },
    concern(item) {
      if (!this.allowConcernClick) return;
      const param = {
        recordId: item.taskNumber,
      };
      this.allowConcernClick = false;
      concernApplication(param).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.data.msg);
          this.allowConcernClick = true;
          item.concernId = item.concernId == 1 ? 0 : 1;
        }
        this.allowConcernClick = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.apply-event-card {
  margin: 16px 0;
  padding: 12px 24px 12px 12px;
  border-radius: 8px;
  border: 1px solid #f2f3f5;
  background: #fff;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .event-info {
    flex: 1;

    .event-name-status {
      margin-bottom: 14px;
      display: flex;
      align-items: center;
    }

    .urgent-icon {
      margin-right: 8px;
      width: 16px;
      height: 16px;
    }

    .event-name {
      color: #1d2128;
      max-width: 50%;
      white-space: nowrap;
      overflow: hidden; //文本超出隐藏
      text-overflow: ellipsis; //文本超出省略号替代

      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px;
      /* 157.143% */
    }

    .event-status {
      display: flex;

      .tag {
        margin-left: 12px;
        display: inline-block;
        padding: 2px 12px;
        border-radius: 4px;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        display: flex;
        align-items: center;

        .icon {
          width: 20px;
          height: 20px;
          line-height: 22px;
          margin-right: 4px;
        }
      }

      .draft {
        background: #f0f6ff;
        color: #2d5cf6;
      }

      .end-sign {
        background: #ecfeec;
        color: #50b142;
      }

      .has-opinion {
        color: #fff;
        border-radius: 0px 6px 6px 6px;
        background: linear-gradient(90deg, #e85167 0%, #ff8193 100%);

        i {
          font-size: 16px;
        }
      }

      .has-no-opinion {
        border-radius: 0px 6px 6px 6px;
        color: #fff;
        background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 100%);

        i {
          font-size: 16px;
        }
      }

      .no-opinion {
        background: #e7f0ff;
        color: #2d5cf6;
      }

      .in-modify {
        background: #fff1f0;
        color: #eb5757;
      }

      .adoption {
        border-radius: 8px;
        border: 1px solid #f2f3f5;
        background: #e7f0ff;
        color: #2d5cf6;
      }

      .check {
        border-radius: 4px;
        background: #e6fffb;
        color: #0da5aa;
      }

      .in-approval {
        border-radius: 4px;
        background: #fff7e6;
        color: #fa8c16;
      }
    }

    .event-infos {
      .id {
        color: #2d5cf6;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-right: 12px;
        /* 157.143% */
      }

      .date:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 10px;
        background: #e5e6eb;
        margin: 0 12px;
      }

      .sDate {
        color: #86909c;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        /* 157.143% */
      }

      .handler {
        color: #1d2128;
        font-family: Microsoft YaHei;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;

        /* 157.143% */
        i {
          color: #2d5cf6;
        }
      }
    }

    .error {
      display: flex;
      align-items: center;
      border-radius: 2px;
      background: #f9f9fb;
      color: #eb5d78;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      padding: 2px 10px;
      margin-top: -3px;
    }

    .tips {
      color: #eb5757;
      margin-left: 12px;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 30px;
    }
  }

  .right-operation {
    width: 250px;
    display: flex;
    justify-content: flex-end;

    .icon {
      width: 20px;
      height: 20px;
      margin-right: 2px;
    }

    .icon-op {
      // padding: 4px 8px 4px 4px;
      display: flex;
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      // width: 76px;
      text-align: center;
      justify-content: center;
      padding: 4px 8px 4px 4px;
      margin-right: 16px;
    }

    .attention {
      padding: 4px 8px 4px 4px;
      display: flex;
      color: #2d5cf6;
      /* 157.143% */
    }

    .attention:hover {
      border-radius: 2px;
      background: #e7f0ff;
      padding: 4px 8px 4px 4px;
    }

    .no-attention {
      color: #2d5cf6;
    }

    .has-attention {
      color: #1d2128;
    }

    .modify {
      color: #ffa940;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }

    .modify:hover {
      border-radius: 2px;
      background: #fff7e6;
      padding: 4px 8px 4px 4px;
    }

    .del:hover {
      border-radius: 2px;
      background: #fff1f0;
      padding: 4px 8px 4px 4px;
    }

    .urges:hover {
      border-radius: 2px;
      background: #e7f0ff;
      padding: 4px 8px 4px 4px;
    }

    .check {
      color: #14c9c9;
    }

    .check:hover {
      padding: 4px 8px 4px 4px;
      background: #e6fffb;
      border-radius: 2px;
    }

    .no-attention,
    .del {
      margin-right: 16px !important;
    }
  }
}

.apply-event-card:hover {
  background: #f7f8fa;
}
</style>
<style lang="less">
.reminderDialog,
.popper-persons {
  padding: 16px;

  .person-item {
    border-radius: 4px;
    background: #f7f8fa;
    padding: 8px 16px;
    margin-bottom: 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .reminder {
      color: #306ef5;
      margin-left: 16px;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      /* 157.143% */
    }
  }

  .person-item:last-of-type {
    margin: 0;
  }

  .person-item:hover {
    background: #f2f3f5;
  }
}

.reminderDialog {
  width: 552px;
  padding: 36px;
  box-sizing: content-box;
  border-radius: 10px;

  .el-dialog__header {
    padding: 0;
    color: #1d2128;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 16px;

    .el-dialog__headerbtn {
      top: 36px;
      right: 36px;
      font-size: 22px;
    }

    /* 157.143% */
  }

  .el-dialog__body {
    padding: 0;
  }

  .person-item {
    width: 552px;
    padding: 8px 16px;
  }
}

.confirmBox {
  width: 500px;

  padding: 0px 0px 24px;
  border-radius: 10px;

  .el-message-box__content {
    height: 160px;

    .el-message-box__container {
      height: 100%;
    }
  }

  .el-message-box__status {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .el-message-box__message {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
  }

  .el-message-box__status::before {
    font-size: 54px;
  }

  .el-message-box__btns {
    .el-button--default {
      border-radius: 6px;
      border: 1px solid #cacdd3 !important;
      color: #1d2128;
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      /* 157.143% */
    }

    .el-button--primary {
      color: #fff;
      border: none !important;
      border-radius: 6px;
      background: linear-gradient(90deg, #2f54eb 0%, #5196ff 100%);
    }
  }
}
</style>