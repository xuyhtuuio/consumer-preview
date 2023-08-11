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
          item.taskName
        }}</span>
        <span class="event-status" v-if="!item.ocr_approval_status">
          <i v-if="item.taskStatus === '0'" class="tag draft">{{ $msg('NodeStatus')[item.taskStatus] }}</i>
          <i v-if="['1','2'].includes(item.taskStatus)" class="tag in-approval">{{ $msg('NodeStatus')[item.taskStatus] }}>{{ item.currentActivityName }}</i>
          <i v-if="item.taskStatus === '3'" class="tag in-modify">{{ $msg('NodeStatus')[item.taskStatus] }}>{{ item.currentActivityName }}</i>
          <i v-if="item.taskStatus === '5'" class="tag check">{{ $msg('NodeStatus')[item.taskStatus] }}>{{ item.currentActivityName }}</i>
          <i v-if="item.taskStatus === '4'" class="end">
            <i class="tag end-sign">{{ $msg('NodeStatus')[item.taskStatus] }}>{{ item.currentActivityName }} </i>
          </i>
          <!-- 有无意见 -->
          <i class="flex" v-if="item.taskStatus === '5' || item.taskStatus === '4'">
            <i class="tag has-opinion" v-if="item.hasOpinions == 1">
              <i class="iconfont icon-guanzhu2"></i>
              有实质性意见
            </i>
            <i class="tag has-no-opinion" v-if="item.hasOpinions !== 1">
              <i class="iconfont icon-guanzhu"></i>
              无实质性意见
            </i>
            <i class="tag check" v-if="item.adoptionStatus == 0 && item.taskStatus != '5'">
              <i class="iconfont icon-guanzhu2"></i>
              不采纳
            </i>
            <i class="tag adoption" v-if="item.adoptionStatus == 1 && item.taskStatus != '5'">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tubiao"></use>
              </svg>
              采纳
            </i>
          </i>
        </span>
        <span class="event-status" v-else>
          <i class="tag in-modify">{{ item.ocr_approval_status }}</i>
        </span>
      </div>
      <div class="event-infos" v-if="!item.errorInfo">
        <span class="id">{{ item.taskNumber }}</span>
        <span class="sDate date">发起时间：{{ item.create_time || "--" }}</span>
        <span class="sDate date">更新时间：{{ item.update_time || "--" }}</span>
        <span class="sDate date">上线时间：{{ item.launchDate || "--" }}</span>
        <el-popover placement="bottom" trigger="click" popper-class="popper-persons"
          v-if="item.currentAssignee && item.currentAssignee.length">
          <div style="max-height: 270px; overflow-y: auto" class="trs-scroll assignee-content">
            <div v-for="(child, index) in item.currentAssignee" :key="index" class="person-item">
              <span>{{ child.name }}/{{ child.WorkId }}/{{ child.Institution }}/{{
                child.Dep
              }}</span>
              <span class="reminder" @click="reminderItem(child)">{{
                child.hasReminder ? "已催单" : "催一下"
              }}</span>
            </div>
          </div>
          <span slot="reference" class="handler pointer">当前处理人：{{
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
        {{ item.errorInfo }}
      </div>
    </div>
    <div class="right-operation">
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
      <div class="flex" v-if="item.taskStatus == 5">
        <span class="check icon-op" @click="check(item)">
          <span class="iconfont icon icon-tubiao"></span>
          确认
        </span>
      </div>
      <div v-if="item.taskStatus == '3'" class="flex" @click="modify(item)">
        <span class="modify icon-op">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-xianxingtubiao"></use>
          </svg>
          修改
        </span>
      </div>
      <div class="flex" v-if="item.taskStatus == 0 || item.errorInfo">
        <span class="modify icon-op" @click="modify(item)">
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
      <div v-if="item.taskStatus != 0&&!item.errorInfo">
        <span class="attention no-attention icon-op" v-if="item.concernId != 1" @click="concern(item)">
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
    <!-- 审批浮窗 - 催单对象 -->
    <el-dialog :visible.sync="reminderDialog" align="center" custom-class="reminderDialog" :before-close="closeReminder">
      <p slot="title">请选择催单对象</p>
      <div style="max-height: 270px; overflow-y: auto" class="trs-scroll assignee-content">
        <div v-for="(child, index) in persons" :key="index" class="person-item" style="width: auto;">
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
      //草稿去修改页
      if (item.submitted == 0) {
        this.modify(item)
        return
      }
      window.localStorage.setItem(
        "order-detail",
        JSON.stringify({
          item,
          clickPoint: 'taskName',
        })
      );
      this.$router.push({
        name: "details",
        params: {
          formId: item.taskNumber,
          formManagementId: item.form_management_id,
          taskName: item.taskName
        },
      });
    },
    check(item) {
      window.localStorage.setItem(
        "order-detail",
        JSON.stringify({
          item: item,
          pageFrom: "apply",
          op: "check",
        })
      );
      this.$router.push({
        name: "details",
        params: {
          formId: item.taskNumber,
          formManagementId: item.form_management_id,
          taskName: item.taskName
        },
      });
    },
    showReminderDialog(item) {
      if (item.currentAssignee && item.currentAssignee.length) {
        this.reminderDialog = true;
        this.persons = item.currentAssignee
        return;
      } else {
        this.$message({
          type: "warning",
          message: "此工单当前不存在处理人，无法催单",
        });
      }
    },
    modify(item) {
      this.$router.push({
        name: 'editApply',
        params: {
          id: item.taskNumber,
          formManagementId: item.form_management_id

        }
      })
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
      const param = {
        recordId: item.taskNumber,
        type: 1
      };
      concernApplication(param).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.data.msg);
          item.concernId = item.concernId == 1 ? 0 : 1;
          this.$emit('concern')
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.apply-event-card {
  cursor: default;
  margin: 16px 0;
  padding: 12px 24px 12px 12px;
  border-radius: 8px;
  border: 1px solid #f2f3f5;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .event-info {
    width: calc(100% - 250px);

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
      cursor: pointer;
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

    .del {
      color: #EB5D78;
    }

    .no-attention,
    .del {
      margin-right: 16px !important;
    }
  }
}

.apply-event-card:hover {
  background: #f7f8fa;

  .event-name {
    color: #2D5CF6;
    cursor: pointer;
  }
}
</style>
<style lang="less">
.reminderDialog,
.popper-persons {
  padding: 16px;

  .assignee-content {
    width: 520px;
    padding-right: 10px;
  }

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