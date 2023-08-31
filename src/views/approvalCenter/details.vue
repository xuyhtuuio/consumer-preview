
<template>
  <div class="apply-order-detail">
    <order-detail pagePath="approval">
      <template slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/approvalcenter' }">消保审查</el-breadcrumb-item>
          <el-breadcrumb-item><a>审批中心</a></el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </order-detail>
  </div>
</template>
  <script>
import orderDetail from "@/components/card/order-detail";
export default {
  name:'approval-details',
  components: {
    orderDetail,
  },
  watch: {
    '$route'(val) {
      if (val.name !== 'approval-details') {
        window.sessionStorage.removeItem('order-detail')
      }
    }
  },
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
</style>