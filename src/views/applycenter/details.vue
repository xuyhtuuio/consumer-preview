
<template>
  <div class="apply-order-detail">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">消保审查</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">申请中心</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">申请中心</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 左侧工单信息 -->
    <div class="left-info">
      <div class="order-name">
        睿远平衡18月产品宣传图审核
        <span class="order-class tag">tag</span>
        <span class="taskvalue tag" >状态</span>
      </div>
      <order-basic-info></order-basic-info>
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
      xx: 'x',
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
    padding: 20px 24px;
    border-radius: 10px;
    background: #fff;
    .order-name {
      color: #1d2128;
      font-size: 14px;
      font-weight: 700;
      line-height: 22px;
      margin-bottom: 17px;
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
    .taskvalue {
      background: #ecfeec;

      color: #50b142;
    }
  }
}
</style>