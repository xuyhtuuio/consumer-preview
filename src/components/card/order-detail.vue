
<template>
  <div class="order-detail">
    <div class="header">
      <slot name="breadcrumb"> </slot>
      <div class="flex pointer">
        <div class="back flex" @click="$router.go(-1)">
          <i class="iconfont icon-fanhui1"></i>
          <i class="btn">返回</i>
        </div>
        <div class="back flex">
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
        <div class="back flex white">
          <i class="iconfont icon-tijiao"></i>
          <i class="btn">提交</i>
        </div>
      </div>
    </div>
    <div class="flex" style="align-items: flex-start">
      <!-- 左侧工单信息 -->
      <div class="left-info">
        <div class="order-name">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-shenpiyemiantubiao"></use>
          </svg>
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-tongyongtubiao2"></use>
          </svg>
          睿远平衡18月产品宣传图审核
          <span class="order-class tag">产品类</span>
          <span class="end tag">已结束</span>
        </div>
        <order-basic-info></order-basic-info>
      </div>
      <div class="right">
        <!-- 消保审查/详情页/审批中预览 -->
        <div v-if="status == 1">
          <nav class="nav active-nav">
            <span class="active-nav" style="text-align: left"
              >审批记录明细</span
            >
          </nav>
        </div>
        <!-- 消保审查/详情页/审批人审批（非消保 -->
        <div v-if="status == 2">
          <nav class="nav">
            <span
              :class="crtComp == 'editorialOpinionCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'editorialOpinionCard';
                }
              "
              >编辑意见</span
            >
            <span
              :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvalRecordCard';
                }
              "
              >审批记录明细</span
            >
          </nav>
        </div>
        <!-- 消保审查/详情页/审批人审批（非消保 -->
        <div v-if="status == 3">
          <nav class="nav">
            <span
              :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvedOpinionCard';
                }
              "
              >审查意见书</span
            >
            <span
              :class="crtComp == 'uploadFileCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'uploadFileCard';
                }
              "
              ><i style="color: #eb5757">*</i> 最终上线材料</span
            >
            <span
              :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvalRecordCard';
                }
              "
              >审批记录明细</span
            >
          </nav>
        </div>
        <!-- 已经结束-->
        <div v-if="status == 4">
          <nav class="nav">
            <span
              :class="crtComp == 'approvedOpinionCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvedOpinionCard';
                }
              "
              >审查意见书</span
            >
            <span
              :class="crtComp == 'uploadFileCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'uploadFileCard';
                }
              "
              ><i style="color: #eb5757">*</i> 最终上线材料</span
            >
            <span
              :class="crtComp == 'approvalRecordCard' ? 'active-nav' : ''"
              @click="
                () => {
                  crtComp = 'approvalRecordCard';
                }
              "
              >审批记录明细</span
            >
          </nav>
        </div>
        <component :is="crtComp" :status="status">
          <template slot="head">
            <div class="approved-opinion-head">
              <h2>消保审查意见书</h2>
              <p>
                <i>拟同意********活动，并提出以下消保审查意见，</i
                >请您确认是否采纳以下意见：
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
  </div>
</template>
<script>
import orderBasicInfo from "@/components/card/order-basic-info.vue";
import editorialOpinionCard from "@/components/card/editorial-opinion-card.vue";
import approvalRecordCard from "@/components/card/approval-record-card.vue";
import approvedOpinionCard from "@/components/card/approved-opinion-card.vue";
import uploadFileCard from "@/components/card/upload-file-card";

export default {
  name: "order-details",
  components: {
    orderBasicInfo,
    approvalRecordCard,
    editorialOpinionCard,
    approvedOpinionCard,
    uploadFileCard,
  },

  data() {
    return {
      status: 4,
      crtComp: "",
    };
  },
  mounted() {
    if (this.status == 1) {
      this.crtComp = "approvalRecordCard";
    } else if (this.status == 2) {
      this.crtComp = "editorialOpinionCard";
    } else if (this.status == 3) {
      this.crtComp = "approvedOpinionCard";
    }
    else if (this.status == 4) {
      this.crtComp = "approvedOpinionCard";
    }
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
}
</style>