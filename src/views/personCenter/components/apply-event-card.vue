<template>
  <div class="apply-event-card">
    <div class="event-info">
      <div class="event-name-status" ref="event-name-status">
        <!-- 加急 -->
        <span class="order-status" ref="order-status">
        <svg
          class="icon urgent-icon"
          aria-hidden="true"
          v-if="item.urgent == 1"
        >
          <use xlink:href="#icon-shenpiyemiantubiao"></use>
        </svg>
        <svg
          class="icon urgent-icon"
          aria-hidden="true"
          v-if="item.dismissalMark == 1"
        >
          <use xlink:href="#icon-tongyongtubiao2"></use>
        </svg>
        <span class="id" v-if="item.orderNo">{{ item.orderNo }}</span>
      </span>
        <span class="event-name " @click="toDetail(item)" ref="event-name">{{
          item.taskName
        }}</span>
        <span class="event-status" v-if="!item.errorStatus" ref="event-status">
          <i v-if="item.taskStatus === '0'" class="tag draft">{{
            $msg('NodeStatus')[item.taskStatus]
          }}</i>
          <i v-if="['1', '2'].includes(item.taskStatus)" class="tag in-approval"
            >{{ $msg('NodeStatus')[item.taskStatus] }}>{{
              item.currentActivityName
            }}</i
          >
          <i v-if="item.taskStatus === '3'" class="tag in-modify"
            >{{ $msg('NodeStatus')[item.taskStatus] }}>{{
              item.currentActivityName
            }}</i
          >
          <i v-if="['5', '6'].includes(item.taskStatus)" class="tag check"
            >{{ $msg('NodeStatus')[item.taskStatus] }}>{{
              item.currentActivityName
            }}</i
          >
          <i v-if="item.taskStatus === '4'" class="end">
            <i class="tag end-sign"
              >{{ $msg('NodeStatus')[item.taskStatus] }}>{{
                item.currentActivityName
              }}
            </i>
          </i>
          <!-- 有无意见 -->
          <i class="flex" v-if="['4', '5', '6'].includes(item.taskStatus)">
            <i class="tag has-opinion" v-if="item.substantiveOpinions == 1">
              <i class="iconfont icon-guanzhu2"></i>
              有实质性意见
            </i>
            <i class="tag has-no-opinion" v-if="item.substantiveOpinions !== 1">
              <i class="iconfont icon-guanzhu"></i>
              无实质性意见
            </i>
            <i
              class="tag check"
              v-if="item.isAdopted == 0 && item.taskStatus != '5'"
            >
              <i class="iconfont icon-guanzhu2"></i>
              不采纳
            </i>
            <i
              class="tag adoption"
              v-if="item.isAdopted == 1 && item.taskStatus != '5'"
            >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tubiao"></use>
              </svg>
              采纳
            </i>
          </i>
        </span>
        <span class="event-status" v-if="item.errorStatus" ref="event-status">
          <i class="tag in-modify">{{ item.errorStatus }}</i>
        </span>
      </div>
      <div class="event-infos" v-if="!item.errorInfo">
        <span class="sDate date">发起时间：{{ item.create_time || '--' }}</span>
        <span class="sDate date">更新时间：{{ item.update_time || '--' }}</span>
        <span class="sDate date"
          >上线时间：{{ item.productLaunchDate || '--' }}</span
        >
        <span v-if="item.taskStatus!=='4' && item.submitted !== 0">
        <el-popover
          placement="bottom"
          trigger="click"
          popper-class="popper-persons"
          v-if="item.currentAssignee && item.currentAssignee.length"
        >
          <div
            style="max-height: 270px; overflow-y: auto"
            class="trs-scroll assignee-content"
          >
            <div
              v-for="(child, index) in item.currentAssignee"
              :key="index"
              class="person-item"
            >
              <span
                >{{ child.fullname }}/{{ child.id }}<i v-show="child.Institution">/{{
                  child.Institution
                }}</i></span
              >
              <!-- <span class="reminder" @click="reminderItem(child)">{{
                child.hasReminder ? "已催单" : "催一下"
              }}</span> -->
            </div>
          </div>
          <span slot="reference" class="handler pointer">
            当前处理人：{{
              (item.currentAssignee && item.currentAssignee[0].fullname) || '--'
            }}
            <i v-if="item.currentAssignee && item.currentAssignee.length > 1"
              >+{{ item.currentAssignee && item.currentAssignee.length - 1 }}</i
            ></span
          >
        </el-popover>
        <span class="handler" v-else>当前处理人：--</span>
      </span>
      </div>
      <div class="event-infos error" v-else>
        <svg class="icon urgent-icon" aria-hidden="true">
          <use xlink:href="#icon-baocuo1"></use>
        </svg>
        {{ item.errorInfo }}
      </div>
    </div>
  </div>
</template>
<script>
import { getTemplatedetail } from '@/api/applyCenter'

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      reminderDialog: false,
      allowConcernClick: true,
      persons: [],
      revoked: false, // 是否可以撤销
      canCompared: false // 当前登录用户可以使用对比功能
    }
  },
  watch: {
    item: {
      handler(val) {
        // 判断智能解析中
        if (val.errorStatus?.includes('智能解析中')) {
          this.item.errorInfo = ''
        }
        // 判断是否可以撤销
        val.taskStatus === '1' ? this.getCanBeRoved(val) : ''
        // 判断当前节点审批人是不是当前用户
        val.taskStatus === '6' ? this.getTemplatedetail(val) : ''
        // 获取info的长度
        this.$nextTick(() => {
          const fatherWidth = this.$refs['event-name-status'].offsetWidth
          const statusWidth = this.$refs['order-status']?.offsetWidth || 0
          const taskWidth = this.$refs['event-status']?.offsetWidth || 0
          const nameWidth = fatherWidth - statusWidth - taskWidth
          this.$refs['event-name'].style.maxWidth = nameWidth + 'px'
        })
      },
      immediate: true
    }
  },
  methods: {
    /**
     * @description: 查询当前节点的审批人是否包含当前登录用户
     * @return {*}
     */
    async getTemplatedetail() {
      const params = {
        processInstanceId: this.item.processInstanceId
      }
      const res = await getTemplatedetail(params)
      if (res.data) {
        const { data } = res.data
        const assignedUser = data[data.length - 1].props['assignedUser']
          ?.filter((v) => v.type !== 'dept')
          ?.map((v) => v.id)
        const user = JSON.parse(window.localStorage.getItem('user_name'))
        this.canCompared = assignedUser.includes(user.id + '')
      }
    },
    getCanBeRoved() {
      // const params = {
      //   nodeId: item.nodeId,
      //   processInstanceId: item.process_instance_id
      // }
      this.revoked = false
      // canRoved(params).then(res => {
      //   // this.revoked = true
      //   const {data} = res.data
      //   this.revoked= data =='true'
      // })
    },
    /**
     * @description: 去比对
     * @return {*}
     */
    //
    compare(item) {
      this.$router.push({
        name: 'compare',
        params: {
          item
        }
      })
    },
    toDetail(item) {
      // 草稿去修改页
      if (item.submitted === 0) {
        this.modify(item)
        return
      }
      // 判断是否解析中
      if (item.errorInfo || item.errorStatus) {
        return false
      }
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item
        })
      )
      this.$router.push({
        name: 'details',
        params: {
          formId: item.taskNumber,
          processInstanceId: item.processInstanceId,
          formManagementId: item.form_management_id,
          processTemplateId: item.processTemplateId,
          taskName: item.taskName,
        }
      })
    },
    check(item) {
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item,
          pageFrom: 'apply',
          op: 'check'
        })
      )
      this.$router.push({
        name: 'details',
        params: {
          formId: item.taskNumber,
          formManagementId: item.form_management_id,
          taskName: item.taskName
        }
      })
    },
    showReminderDialog(item) {
      if (item.currentAssignee && item.currentAssignee.length) {
        this.reminderDialog = true
        this.persons = item.currentAssignee
        return false
      } else {
        this.$message({
          type: 'warning',
          message: '此工单当前不存在处理人，无法催单'
        })
      }
    },
    modify(item) {
      this.$router.push({
        name: 'editApply',
        params: {
          ...item,
          id: item.taskNumber,
          formManagementId: item.form_management_id
        }
      })
    },
    cancel(item) {
      this.$confirm('确定撤销该申请吗？', '', {
        customClass: 'confirmBox',
        confirmButtonText: '撤销',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('quash', item)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤销'
          })
        })
    },
    del(item) {
      this.$confirm('确定删除该草稿吗？', '', {
        customClass: 'confirmBox',
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('del', item.taskNumber)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    reminderItem(item) {
      if (item.hasReminder) {
        return false
      } else {
        item.hasReminder = !item.hasReminder
      }
    },
    urgentOrder(item) {
      this.persons = item.currentAssignee
    },
    closeReminder() {
      this.reminderDialog = false
      this.persons = []
    },
  }
}
</script>
<style lang="less" scoped>
.apply-event-card {
  cursor: default;
  margin: 16px 0;
  padding: 12px 24px 12px 12px;
  border-radius: 8px;
  border: 1px solid #f2f3f5;
  background: #fff;
  .event-info {
    width: 100%;

    .event-name-status {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      .order-status{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
      }
    }

    .urgent-icon {
      margin-right: 8px;
      width: 16px;
      height: 16px;
    }

    .event-name {
      color: #1d2128;
      white-space: nowrap;
      overflow: hidden; //文本超出隐藏
      text-overflow: ellipsis; //文本超出省略号替代

      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px;
      /* 157.143% */
    }
    .id {
        color: #2d5cf6;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-right: 12px;
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
        word-break: keep-all;
        white-space: pre;

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
      .date:after {
        content: '';
        display: inline-block;
        width: 1px;
        height: 10px;
        background: #e5e6eb;
        margin: 0 12px;
      }
      .date:last-of-type::after{
        display: none;
      }

      .sDate {
        color: #86909c;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        /* 157.143% */
      }

      .handler {
        color: #1d2128;
        font-family: Microsoft YaHei;
        font-size: 12px;
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

}

.apply-event-card:hover {
  background: #f7f8fa;

  .event-name {
    color: #2d5cf6;
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
}</style>
