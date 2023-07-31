
<template>
  <div class="order-detail">
    <div class="header">
      <slot name="breadcrumb"> </slot>
      <div class="flex pointer">
        <div class="back flex" @click="goback">
          <i class="iconfont icon-fanhui1"></i>
          <i class="btn">返回</i>
        </div>
        <!-- 只有有修改权限的人能看到 -->
        <div class="back flex white" v-if="status == 5">
          <i class="iconfont icon-xianxingtubiao"></i>
          <i class="btn">去修改</i>
        </div>
        <div class="back flex" @click="keep" v-if="(status == 3 || status == 5) && info && info.op == 'check'">
          <i class="iconfont icon-baocun"></i>
          <i class="btn">保存</i>
        </div>
        <div class="back flex white" @click="submit" v-if="(status == 3 || status == 5) && info && info.op == 'check'">
          <i class="iconfont icon-tijiao"></i>
          <i class="btn">提交</i>
        </div>
        <div v-if="status == 2" class="flex">
          <div class="back flex" @click="transferDialog = true">
            <i class="iconfont icon-zhuanban1"></i>
            <i class="btn">转办</i>
          </div>
          <div class="back flex">
            <i class="iconfont icon-xianxingtubiao"></i>
            <i class="btn">修改申请单</i>
          </div>
          <div class="back flex">
            <i class="iconfont icon-baocun"></i>
            <i class="btn">保存</i>
          </div>
          <div class="back flex white" @click="submit">
            <i class="iconfont icon-tijiao"></i>
            <i class="btn">提交</i>
          </div>
        </div>
      </div>
    </div>
    <div class="flex" style="align-items: flex-start">
      <!-- 左侧工单信息 -->
      <div class="left-info">
        <div class="order-name">
          <svg class="icon urgent-icon" aria-hidden="true" v-if="orderBaseInfo.urgent == 1">
            <use xlink:href="#icon-shenpiyemiantubiao"></use>
          </svg>
          <svg class="icon urgent-icon" aria-hidden="true" v-if="orderBaseInfo.dismissalMark == 1">
            <use xlink:href="#icon-tongyongtubiao2"></use>
          </svg>
          {{ orderBaseInfo.taskName }}
          <span class="order-class tag">{{ orderBaseInfo.formCategory }}</span>
          <span class="event-status">
            <i v-if="orderBaseInfo.taskStatus === '0'" class="tag draft">草稿</i>
            <i v-if="orderBaseInfo.taskStatus === '1'" class="tag in-approval">审批中</i>
            <i v-if="orderBaseInfo.taskStatus === '2'" class="tag in-modify">待修改</i>
            <i v-if="orderBaseInfo.taskStatus === '3'" class="tag check">待确认</i>
            <i v-if="orderBaseInfo.taskStatus === '4'" class="end">
              <i class="tag end-sign"> 已结束 </i>
            </i>
          </span>
        </div>
        <order-basic-info @preview='previewFile' @sendbaseInfo="sendbaseInfo"></order-basic-info>
      </div>
      <div class="right">
        <!-- 消保审查/详情页/审批中预览 -->
        <div v-if="status == 0">
          <nav class="nav active-nav">
            <span class="active-nav" style="text-align: left">审批记录明细</span>
          </nav>
        </div>
        <!-- 消保审查/详情页/审批人审批（非消保 -->
        <div v-if="status == 2">
          <nav class="nav">
            <span :class="crtComp == 'leaderEditOpinion' ? 'active-nav' : ''" @click="() => {
              crtComp = 'leaderEditOpinion';
            }
              ">编辑意见</span>
            <span :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvalRecordCard';
            }
              ">审批记录明细</span>
          </nav>
        </div>
        <!-- 消保审查/详情页/审批人审批（非消保 -->
        <div v-if="status == 3">
          <nav class="nav">
            <span :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvedOpinionCard';
            }
              ">审查意见书</span>
            <span :class="crtComp == 'uploadFileCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'uploadFileCard';
            }
              "><i style="color: #eb5757">*</i> 最终上线材料</span>
            <span :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvalRecordCard';
            }
              ">审批记录明细</span>
          </nav>
        </div>
        <!-- 已经结束-->
        <div v-if="status == 4">
          <nav class="nav">
            <span :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvedOpinionCard';
            }
              ">审查意见书</span>
            <span :class="crtComp == 'uploadFileCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'uploadFileCard';
            }
              "><i style="color: #eb5757">*</i> 最终上线材料</span>
            <span :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvalRecordCard';
            }
              ">审批记录明细</span>
          </nav>
        </div>
        <div v-if="status == 5">
          <nav class="nav">
            <span :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvedOpinionCard';
            }
              ">审查意见书</span>
            <span :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''" @click="() => {
              crtComp = 'approvalRecordCard';
            }
              ">审批记录明细</span>
          </nav>
        </div>
        <component :is="crtComp" :status="status" ref="child">
          <template slot="head">
            <div class="approved-opinion-head">
              <h2>消保审查意见书</h2>
              <p>
                <i>拟同意********活动，并提出以下消保审查意见，</i>请您确认是否采纳以下意见：
              </p>
            </div>
          </template>
          <template slot="foot">
            <div class="approved-opinion-foot">
              <p>以上为消保审查办公室建议，请酌情考虑。</p>
              <p style="text-align: right; color: #1d2128; padding: 16px 0">
                消保审查中心<br />
                2021-09-08 12：20：30
              </p>
            </div>
          </template>
        </component>
      </div>
    </div>
    <el-dialog :visible.sync="transferDialog" width="800px" center custom-class="transfer-dialog">
      <span slot="title">请选择转办对象</span>

      <div>
        <el-input v-model="staff.keyword" placeholder="搜索人员，支持拼音、姓名">
          <i slot="prefix" class="el-input__icon el-icon-search pointer"></i></el-input>
        <el-radio-group v-model="staff.people" class="trs-scroll">
          <el-radio :label="item.code" v-for="(item, index) in peoples" :key="index">
            <span class="avatar"><img src="@/assets/image/apply-center/avatar.png" alt="" /></span>
            {{ item.name }}</el-radio>
        </el-radio-group>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="transferDialog = false" type="text" class="cancel">取消</el-button>
        <el-button type="text" @click="transferDialog = false" class="submit-btn">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="previewDialog" width="800px" custom-class="preview-dialog">
      <filePreview :url="previewUrl"></filePreview>
    </el-dialog>
  </div>
</template>
<script>
import orderBasicInfo from "@/components/card/order-basic-info.vue";
import leaderEditOpinion from "@/components/card/leader-edit-opinion.vue";
import approvalRecordCard from "@/components/card/approval-record-card.vue";
import approvedOpinionCard from "@/components/card/approved-opinion-card.vue";
import uploadFileCard from "@/components/card/upload-file-card";
import filePreview from '@/components/filePreview'
export default {
  name: "order-details",
  components: {
    orderBasicInfo,
    approvalRecordCard,
    leaderEditOpinion,
    approvedOpinionCard,
    uploadFileCard,
    filePreview
  },

  data() {
    return {
      status: 4,
      crtComp: "",
      transferDialog: false,
      staff: {
        keyword: "",
        people: "",
      },
      info: {},
      previewDialog: false,
      previewUrl: '',
      orderBaseInfo: {},
      peoples: [
        { name: "王明明", code: 1 },
        { name: "王明明", code: 2 },
        { name: "王明明", code: 3 },
        { name: "王明明", code: 4 },
        { name: "王明明", code: 5 },
        { name: "王明明", code: 6 },
        { name: "王明明", code: 7 },
      ],
    };
  },
  activated() {
    this.judgeStatus();
  },
  mounted() {
    this.judgeStatus();
  },
  created() { },
  methods: {
    sendbaseInfo(val) {
      this.orderBaseInfo = val
    },
    previewFile(url) {
      this.previewDialog = true
      this.previewUrl = url
    },
    judgeStatus() {
      // 一般进入详情页：展示返回按钮 及 审批记录详细
      // 已经结束的工单 展示: 返回按钮、审批记录详细、审查意见书、最终上线材
      // <!-- 任务状态（1：审查中 2：待修改 3：待确认 4：已完成 -->
      let { item } = JSON.parse(window.sessionStorage.getItem("order-detail"));
      const info = JSON.parse(window.sessionStorage.getItem("order-detail"));
      this.info = info

      // 审批中、草稿
      if (item.taskStatus == 0 || item.taskStatus == 1) {
        this.status = 0;
        this.crtComp = "approvedOpinionCard";
      }
      // 已经结束的工单
      if (item.taskStatus == 4) {
        this.status = 4;
        this.crtComp = "approvedOpinionCard";
      }
      // 状态待修改  有实质性、已确认 返回按钮、去修改，审查意见书、审批记录详细；采纳实质意见的确认人、二次会签的指定人右上角会看到去修改按钮      有修改权限的人（全部采纳实质意见的确认人、二次会签指定的人）看到的页面，在右上角增加【去修改】按钮，点击【去修改】进入修改申请单页面；
      if (item.taskStatus == 2) {
        this.status = 5;
        this.crtComp = "approvedOpinionCard";
      }
      // 从申请那里过来 == 点击了确认按钮
      if (info && info.op == "check") {
        // 有实质性意见
        if (item.hasOpinions == 1) {
          this.status = 5;
        } else {
          //无实质性意见
          this.status = 3;
        }
        this.crtComp = "approvedOpinionCard";
      }
      // 从申请那里过来 == 点击了确认按钮
      if (info && info.op == "approve") {
        this.status = 2;
        this.crtComp = "leaderEditOpinion";
      }
    },
    keep() {
      if (this.crtComp == 'approvedOpinionCard') {
        this.$refs["child"].keep();
      }
    },
    goback() {
      // 如果是从审批页进来；二次弹窗
      // 申请页 正常返回
      if (this.info && this.info.pageFrom == "approval") {
        this.$confirm("是否保存本审查项目的审查意见？", "", {
          customClass: "confirmBox",
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "warning",
        })
          .then(() => {
            this.$router.go(-1);
          })
          .catch(() => {
            this.$router.go(-1);
          });
        // this.$router.go(-1);
      } else {
        this.$router.go(-1);
      }
    },
    submit() {
      if (this.crtComp == "approvedOpinionCard") {
        this.$refs["child"].submit();
      }
      if (this.crtComp == "leaderEditOpinion") {
        this.$refs["child"].opinionSubmit();
      }
    },
  },

};
</script>
<style lang="less" scoped>
.order-detail {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .back {
      align-items: center;
      color: #2d5cf6;
      font-weight: 400;
      line-height: 22px;
      padding: 6px 16px;
      border-radius: 6px;
      background: #fff;
      margin-left: 8px;

      .iconfont {
        font-size: 20px;
        margin-right: 4px;
      }

      .btn {
        font-size: 14px;
      }
    }

    .white {
      color: #fff;
      background: #2d5cf6;
    }
  }

  .left-info {
    flex: 1;
    padding: 20px 24px;
    border-radius: 10px;
    background: #fff;

    .order-name {
      color: #1d2128;
      font-size: 14px;
      font-weight: 700;
      line-height: 22px;
      margin-bottom: 17px;

      .icon {
        margin-right: 4px;
      }
    }

    .tag {
      display: inline-block;
      padding: 2px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
    }

    .order-class {
      background: #f0f6ff;

      color: #2d5cf6;
      margin: 0 4px;
    }

    .event-status {
      display: inline-block;



      .draft {
        background: #f0f6ff;
        color: #2d5cf6;
      }

      .in-approval {
        border-radius: 4px;
        background: #fff7e6;
        color: #fa8c16;
      }

      .check {
        border-radius: 4px;
        background: #e6fffb;
        color: #0da5aa;
      }

      .in-modify {
        background: #fff1f0;
        color: #eb5757;
      }

    }

    .end {
      background: #ecfeec;
      color: #50b142;
    }

    .waitConfirm {
      color: #0da5aa;
      background: #e6fffb;
    }

    .inApproval {
      color: #fa8c16;
      background: #fff7e6;
    }
  }

  .right {
    width: 420px;
    margin-left: 16px;
    padding: 22px 20px 20px 20px;
    display: inline-block;
    border-radius: 10px;
    background: #fff;
    height: auto;

    .nav {
      padding: 2px 0px;
      padding-bottom: 12px;
      border-bottom: 1px dashed #e5e6eb;
      margin-bottom: 16px;
      display: flex;
      font-size: 14px;
      line-height: 22px;

      span {
        flex: 1;
        text-align: center;
        cursor: pointer;
      }
    }

    .active-nav {
      font-style: normal;
      font-weight: 700;

      color: #2d5cf6;
    }
  }

  .approved-opinion-head {
    h2 {
      color: #1d2128;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      line-height: 22px;
      margin-bottom: 12px;
    }

    p {
      color: #505968;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      margin-bottom: 12px;

      i {
        color: #2d5cf6;
      }
    }
  }

  .approved-opinion-foot {
    p {
      font-weight: 400;
      line-height: 22px;
      font-size: 14px;
      color: #306ef5;
    }
  }

  /deep/ .transfer-dialog {
    border-radius: 10px;
    background: #fff;
    padding: 40px 60px;
    /* 阴影/大 */
    box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);

    .el-dialog__header {
      padding: 0;
      color: var(--gray-gray-9, #1d2128);
      text-align: center;

      /* 二级标题/加粗 */
      font-family: Microsoft YaHei;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;

      /* 150% */
      .el-dialog__headerbtn {
        right: 60px;
        top: 40px;
        font-size: 20px;
        color: #505968;
      }
    }

    .el-dialog__body {
      margin: 16px 0;
      padding: 0;
      width: 100%;
      padding: 16px;
      border-radius: 4px;
      border: 1px solid var(--gray-gray-4, #e5e6eb);

      .el-input {
        width: 100%;
        border-radius: 4px;
        margin-bottom: 8px;

        .el-input__inner {
          border: 1px solid var(--gray-gray-4, #e5e6eb);
          background: var(--gray-gray-1, #fff);
        }
      }

      .el-radio-group {
        display: flex;
        flex-direction: column;
        height: 284px;
        overflow-y: auto;

        .el-radio {
          padding: 6px 12px;
          margin-bottom: 4px;
          font-weight: 400;

          .avatar {
            width: 32px;
            height: 32px;
            display: inline-block;
            background: #e8faf7;
            border-radius: 50%;
            margin: 0 8px;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .el-dialog__footer {
      .el-button {
        width: 140px;
        padding: 6px 16px;
        border-radius: 6px;
        border: 1px solid #e5e6eb;
        background: #fff;
        color: #1d2128;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
      }

      .submit-btn {
        border-radius: 6px;
        background: #2d5cf6;
        font-weight: 700;
        font-size: 14px;
        color: #fff;
      }
    }
  }

  /deep/ .preview-dialog {
    height: 80vh;

    .el-dialog__body {
      height: 96%;
    }
  }
}</style>