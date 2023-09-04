<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-08-31 17:21:49
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-09-04 18:31:20
 * @FilePath: /consumer-preview/src/views/approvalCenter/details.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="apply-order-detail">
    <order-detail pagePath="approval">
      <template slot="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/approvalcenter' }"
            >消保审查</el-breadcrumb-item
          >
          <el-breadcrumb-item><a>审批中心</a></el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </order-detail>
  </div>
</template>
<script>
import orderDetail from '@/components/card/order-detail'
export default {
  name: 'approval-details',
  components: {
    orderDetail
  },
  watch: {
    $route(val) {
      if (val.name !== 'approval-details') {
        window.sessionStorage.removeItem('order-detail')
      }
    }
  },
  data() {
    return {}
  }
}
</script>
