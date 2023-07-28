
<template>
  <div class="apply-order-detail">
    <order-detail>
      <template slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">消保审查</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">申请中心</a></el-breadcrumb-item>
        </el-breadcrumb>

      </template>
    </order-detail>
  </div>
</template>
<script>
import orderDetail from "@/components/card/order-detail";
export default {
  components: {
    orderDetail,
  },
  data() {
    return {
    };
  },
};
</script>
<style lang="less" scoped>
.apply-order-detail {
}</style>