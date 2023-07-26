<template>
  <div class="manage">
    <LeftMenu/>
    <div class="view-content">
      <components :is="$route.name"></components>
    </div>
  </div>
</template>
<script>
import LeftMenu from './leftMenu'
import UserManage from './userManage'
import FlowManage from './flowManage'
import FormManage from './formManage'
import RolePermission from './rolePermission'
export default {
  name: 'manage',
  components: {
    LeftMenu,
    UserManage,
    FlowManage,
    FormManage,
    RolePermission
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="less" scoped>
.manage {
  display: flex;
  .view-content {
    width: calc(100% - 140px - 16px);
    padding: 24px;
    background: #ffffff;
    border-radius: 4px;
  }
}
</style>
