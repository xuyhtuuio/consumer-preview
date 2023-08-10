
<template>
  <div class="apply-order-detail">
    <order-detail>
      <template slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/applycenter' }">消保审查</el-breadcrumb-item>
          <el-breadcrumb-item><a>申请中心</a></el-breadcrumb-item>
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
  data(){
    return{
      ids:{}
    }
  },
  watch: {
    '$route'(val) {
      if (val.name !== 'details') {
        window.sessionStorage.removeItem('order-detail')
      }
    }
  },
  mounted() {
  },
  data() {
    return {
    };
  },

};
</script>
<style lang="less" scoped>
.apply-order-detail {}
</style>