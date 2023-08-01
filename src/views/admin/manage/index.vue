<template>
  <div class="manage">
    <LeftMenu/>
    <div class="view-content">
      <transition name="router-fade" mode="out-in">
        <keep-alive>
          <components :is="$route.name"></components>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script>
import LeftMenu from './leftMenu'
import UserManage from './userManage'
import FlowManage from './flowManage'
import FormManage from './formManage'
import RolePermission from './rolePermission'
import LabelManage from './labelManage.vue'
import OpinionManage from "./opinionManage.vue"
export default {
  name: 'manage',
  components: {
    LeftMenu,
    UserManage,
    FlowManage,
    FormManage,
    RolePermission,
    LabelManage,
    OpinionManage
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
