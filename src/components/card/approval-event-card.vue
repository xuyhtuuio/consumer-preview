<template>
  <div class="approval-event-card">
    <div class="event-info" @click="toDetail(item)">
      <div class="event-name-status" ref="event-name-status">
        <!-- 加急 -->
        <span class="order-status" ref="order-status">
          <svg class="icon urgent-icon" aria-hidden="true" v-if="item.urgent == 1">
            <use xlink:href="#icon-shenpiyemiantubiao"></use>
          </svg>
          <svg class="icon urgent-icon" aria-hidden="true" v-if="item.dismissalMark == 1">
            <use xlink:href="#icon-tongyongtubiao2"></use>
          </svg>
          <span class="id" v-if="item.orderNo">{{ item.orderNo }}</span>
        </span>
        <span class="event-name pointer" ref="event-name">{{
          item.entryName
        }}</span>
        <span class="event-status" ref="event-status">
          <i :class="{
                'tag draft': ['0'].includes(item.taskStatus),
                'tag in-approval': ['1', '2'].includes(item.taskStatus),
                'tag in-modify': ['3'].includes(item.taskStatus),
                'tag check': ['5', '6'].includes(item.taskStatus),
                'tag end-sign': ['4'].includes(item.taskStatus)
              }">{{ $msg('NodeStatus')[item.taskStatus] }}>{{ item.nodeName }}</i>
          <!-- 有无意见 -->
          <i v-if="['4', '5', '6'].includes(item.taskStatus)" class="flex">
            <i class="tag has-opinion" v-if="item.substantiveOpinions == 1">
              <i class="iconfont icon-guanzhu2"></i>
              有实质性意见
            </i>
            <i class="tag has-no-opinion" v-if="item.substantiveOpinions !== 1">
              <i class="iconfont icon-guanzhu"></i>
              无实质性意见
            </i>
            <i class="tag check" v-if="item.adoptSign == 0 && item.taskStatus != '5'">
              <i class="iconfont icon-guanzhu2"></i>
              不采纳
            </i>
            <i class="tag adoption" v-if="item.adoptSign == 1 && item.taskStatus != '5'">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tubiao"></use>
              </svg>
              采纳
            </i>
          </i>
        </span>
      </div>
      <div class="event-infos">
        <span class="sDate date">发起时间：{{ item.createTime | timeFormate }}</span>
        <span class="sDate date">更新时间：{{ item.updateTime | timeFormate }}</span>
        <span class="sDate date">上线时间：{{ item.uptime | timeFormate }}</span>
        <span class="handler date">发起人：{{ item.originator && item.originator.name }}</span>
        <span class="handler" v-if="item.institutional && item.institutional[item.institutional.length - 1]">
          <i class="iconfont icon-dept"></i>
          {{ item.institutional && item.institutional[item.institutional.length - 1] }}</span>
      </div>
    </div>
    <!-- 任务状态（0:草稿 1：审查中 2：待修改 3：待确认 4：已完成 -->
    <div class="right-operation">
      <!-- 待审核状态显示审查 -->
      <span class="attention icon-op" v-if="item.taskStatus == '1' && crtSign !== 'approvedCount' && hasAuth"
        @click="toApproval(item)">
        <svg class="icon urgent-icon" aria-hidden="true">
          <use xlink:href="#icon-tubiao3"></use>
        </svg>
        审查
      </span>

      <!-- 待确认状态的工单 需要该审批人确认的工单-->
      <span class="attention check icon-op" v-if="item.taskStatus == 5 && crtSign !== 'approvedCount' && hasAuth"
        @click="check(item)">
        <span class="iconfont icon icon-tubiao urgent-icon"></span>
        确认</span>
      <span class="attention check icon-op" v-if="item.taskStatus == 6 && crtSign !== 'approvedCount' && hasAuth"
        @click="compare(item)">
        <span class="iconfont icon icon-compare urgent-icon"></span>
        比对</span>
      <!-- 超级管理员的删除功能 -->
      <span class="attention icon-op del" v-if="crtSign == 'allTask'&&showExport" @click="del(item)">
        <svg class="icon urgent-icon" aria-hidden="true">
          <use xlink:href="#icon-xianxingtubiao-1"></use>
        </svg>
        删除
      </span>
      <!-- 关注 -->
      <span class="attention no-attention icon-op" v-if="item.followed != 1" @click="concern(item)">
        <svg class="icon urgent-icon" aria-hidden="true">
          <use xlink:href="#icon-tubiao-1"></use>
        </svg>
        关注</span>
      <span class="attention has-attention icon-op" v-if="item.followed == 1" @click="concern(item)">
        <svg class="icon urgent-icon" aria-hidden="true">
          <use xlink:href="#icon-guanzhu-1"></use>
        </svg>已关注</span>
    </div>
  </div>
</template>
<script>
import { concernApplication } from '@/api/approvalCenter'
// eslint-disable-next-line
import dayjs from 'dayjs'
export default {
  name: 'applyEventCard',
  props: {
    item: {
      type: Object,
      default: () => { }
    },
    crtSign: {
      type: String,
      default: ''
    },
    showExport: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      hasAuth: false
    }
  },
  watch: {
    item: {
      handler(val) {
        let { currentProcessor } = val
        currentProcessor = currentProcessor?.map((v) => {
          return Object.keys(v)[0]
        })
        const { id } = JSON.parse(window.localStorage.getItem('user_name'))
        this.hasAuth = currentProcessor?.includes(id + '') || false
        this.item.hasAuth = currentProcessor?.includes(id + '') || false
        this.$nextTick(() => {
          const fatherWidth = this.$refs['event-name-status']?.offsetWidth
          const statusWidth = this.$refs['order-status']?.offsetWidth || 0
          const taskWidth = this.$refs['event-status']?.offsetWidth || 0
          const nameWidth = fatherWidth - statusWidth - taskWidth
          this.$refs['event-name'].style.maxWidth = nameWidth + 'px'
          this.$refs['event-name'].style.minWidth = 10 + 'px'
        })
      },
      immediate: true
    }
  },
  mounted() { },
  methods: {
    async toApproval(item) {
      // 判断是领导审批 还是 OCR 审批
      const { targetPage } = item
      // eslint-disable-next-line
      switch (targetPage) {
        case 'LEADER':
          this.toDetail(item)
          break
        case 'CONFIRM':
          this.toDetail(item)
          break
        case 'CONTRAST':
          this.$router.push({
            name: 'compare',
            params: { item }
          })
          break
        case 'XIAOBAO':
          this.$router.push({
            name: 'aiApprovalNew',
            // name: 'aiApproval',
            params: { item }
          })
          break
      }
    },
    toDetail(item) {
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item
        })
      )
      this.$router.push({
        name: 'approval-details',
        params: {
          formId: item.recordId,
          taskName: item.taskName,
          processInstanceId: item.processInstanceId,
          formManagementId: item.formManagementId,
          nodeId: item.nodeId,
          processTemplateId: item.processTemplateId
        }
      })
    },
    check(item) {
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item,
          pageFrom: 'apply',
          op: 'check',
          check: item.comments
        })
      )
      this.$router.push({
        name: 'approval-details',
        params: {
          formId: item.recordId,
          taskName: item.taskName,
          processInstanceId: item.processInstanceId,
          formManagementId: item.formManagementId,
          nodeId: item.nodeId,
          processTemplateId: item.processTemplateId,
          taskId: item.taskId
        }
      })
    },
    // 超级管理员的删除功能
    del(item) {
      // eslint-disable-next-line
      this.$confirm('确定删除该工单吗？', '', {
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
    modify(item) {
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item
        })
      )
      this.$router.push({
        name: 'approval-details',
        params: {
          formId: item.recordId,
          taskName: item.taskName,
          processInstanceId: item.processInstanceId,
          formManagementId: item.formManagementId
        }
      })
    },
    concern(item) {
      const param = {
        recordId: item.taskNumber,
        type: 2
      }
      concernApplication(param).then((res) => {
        if (res.status === 200) {
          item.followed = item.followed === 1 ? 0 : 1
          this.$message.success(res.data.msg)
          this.$emit('concern')
        }
      })
    },
    // 比对功能
    compare(item) {
      this.$router.push({
        name: 'compare',
        params: {
          item
        }
      })
    }
  },

  filters: {
    timeFormate(val) {
      return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
    }
  }
}
</script>
<style lang="less" scoped>
.approval-event-card {
  margin: 16px 0;
  padding: 12px 24px 12px 12px;
  border-radius: 8px;
  border: 1px solid #f2f3f5;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: default;
  width: 100%;

  .event-info {
    // flex: 1;
    width: calc(100% - 250px);

    .event-name-status {
      margin-bottom: 17px;
      display: flex;
      align-items: center;

      .order-status {
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
      color: #1D2128;
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
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 12px;
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
  }

  .right-operation {
    width: 250px;
    display: flex;
    justify-content: flex-end;

    .icon {
      width: 20px !important;
      height: 20px !important;
      margin-right: 2px;
    }

    .icon-op {
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

    .icon-op:last-of-type {
      margin-right: 0;
    }

    .attention {
      padding: 4px 8px 4px 4px;
      display: flex;
      color: #2d5cf6;

      /* 157.143% */
    }

    .check {
      border-radius: 4px;
      color: #14c9c9;

      .icon {
        font-size: 20px;
      }
    }

    .attention:hover {
      border-radius: 2px;
      background: #e7f0ff;
      padding: 4px 8px 4px 4px;
    }

    .check:hover {
      border-radius: 2px;
      background: #e6fffb;
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

    .del {
      color: #f76560;
    }

    .del:hover {
      border-radius: 2px;
      background: #fff1f0;
      padding: 4px 8px 4px 4px;
    }

    .no-attention,
    .del {
      margin-right: 16px !important;
    }
  }
}

.approval-event-card:hover {
  background: #f7f8fa;
  cursor: pointer;
}
</style>
