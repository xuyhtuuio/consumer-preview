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
import FormManage from './formManage'
export default {
  name: 'manage',
  components: {
    LeftMenu,
    UserManage,
    FormManage
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
    width: calc(100% - 140px);
    padding: 24px;
    background: #ffffff;
    border-radius: 4px;
  }
}
</style>
