
<template>
  <div class="apply-order-detail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">消保审查</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">申请中心</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">申请中心</a></el-breadcrumb-item>
    </el-breadcrumb>
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
      <div class="right">ddd</div>
    </div>
  </div>
</template>
<script>
import orderBasicInfo from "@/components/card/order-basic-info.vue";
export default {
  components: {
    orderBasicInfo,
  },
  data() {
    return {
      xx: "x",
    };
  },
};
</script>
<style lang="less" scoped>
.apply-order-detail {
  .el-breadcrumb {
    margin-bottom: 22px;
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
      .icon{
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
    width: 380px;
    margin-left: 16px;
    padding: 22px 20px 20px 20px;
    display: inline-block;
    border-radius: 10px;
    background: #fff;
    height: auto;
  }
}
</style>