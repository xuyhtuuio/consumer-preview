<template>
  <div class="manage">
    <LeftMenu/>
    <components :is="$route.name"></components>
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
}
</style>
