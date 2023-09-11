<template>
  <div class="approval-event-card">
    <div class="event-info">
      <div class="event-name-status">
        <!-- 加急 -->
        <svg class="icon urgent-icon" aria-hidden="true" v-if="item.urgent == 1">
          <use xlink:href="#icon-shenpiyemiantubiao"></use>
        </svg>
        <svg class="icon urgent-icon" aria-hidden="true" v-if="item.dismissalMark == 1">
          <use xlink:href="#icon-tongyongtubiao2"></use>
        </svg>
        <span class="event-name pointer" @click="toDetail(item)">{{
          item.entryName
        }}</span>
        <span class="event-status">
          <i v-if="item.taskStatus === '0'" class="tag draft">{{
            $msg('NodeStatus')[item.taskStatus]
          }}</i>
          <i v-if="['1', '2'].includes(item.taskStatus)" class="tag in-approval">{{ $msg('NodeStatus')[item.taskStatus]
          }}>{{ item.nodeName }}</i>
          <i v-if="item.taskStatus === '3'" class="tag in-modify">{{ $msg('NodeStatus')[item.taskStatus] }}>{{
            item.nodeName }}</i>
          <i v-if="['5', '6'].includes(item.taskStatus)" class="tag check">{{ $msg('NodeStatus')[item.taskStatus] }}>{{
            item.nodeName }}</i>
          <i v-if="item.taskStatus === '4'" class="end">
            <i class="tag end-sign">
              {{ $msg('NodeStatus')[item.taskStatus] }}>{{ item.nodeName }}
            </i>
          </i>
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
        <span class="id">{{ item.orderNo }}</span>
        <span class="sDate date">发起时间：{{ item.createTime | timeFormate }}</span>
        <span class="sDate date">更新时间：{{ item.updateTime | timeFormate }}</span>
        <span class="sDate date">上线时间：{{ item.uptime | timeFormate }}</span>
        <span class="handler date">发起人：{{ item.originator && item.originator.name }}</span>
        <span class="handler" v-if="item.institutional && item.institutional[1]">
          <i class="iconfont icon-dept"></i>
          {{ item.institutional && item.institutional[1] }}</span>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import * as dayjs from 'dayjs'
import { concernApplication } from '@/api/approvalCenter'
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
    }
  },
  data() {
    return {
      hasAuth: false
    }
  },
  mounted() {
    let { currentProcessor } = this.item
    if (currentProcessor) {
      currentProcessor = currentProcessor?.map((v) => {
        return Object.keys(v)[0]
      })
      const { id } = JSON.parse(window.localStorage.getItem('user_name'))
      this.hasAuth = currentProcessor.includes(id + '')
      this.item.hasAuth = currentProcessor.includes(id + '')
    }
  },
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
            name: 'aiApproval',
            params: { item }
          })
          break
      }
    },
    toDetail(item) {
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item,
          clickPoint: 'taskName'
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
          processTemplateId: item.processTemplateId
        }
      })
    },
    // 超级管理员的删除功能
    del(item) {
      return this.$message.info('此功能暂未开放')
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
      return val ? dayjs(val).format('YYYY-MM-DD') : '--'
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
  cursor: default;
  width: 100%;

  .event-info {
    // flex: 1;
    width: 100%;

    .event-name-status {
      margin-bottom: 17px;
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
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
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
}

.approval-event-card:hover {
  background: #f7f8fa;

  .event-name {
    color: #2d5cf6;
  }
}
</style>
