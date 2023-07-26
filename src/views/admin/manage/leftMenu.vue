<template>
  <el-menu router :default-active="$route.path">
    <el-menu-item index="/admin/manage/userManage" :class="{'is-active': $route.name === 'UserManage'}" >用户管理</el-menu-item>
     <el-menu-item index="/admin/manage/rolePermission" :class="{'is-active': $route.name === 'RolePermission'}" >角色/权限</el-menu-item>
    <el-menu-item index="/admin/manage/FlowManage" :class="{'is-active': $route.name === 'FlowManage'}" >流程管理</el-menu-item>
    <el-menu-item index="/admin/manage/formManage" :class="{'is-active': $route.name === 'FormManage'}" >表单管理</el-menu-item>
  </el-menu>

</template>

<script>
export default {
  data() {
    return {
    };
  }
};
</script>
<style lang="less" scoped>
.el-menu {
  width: 140px;
  margin-right: 16px;
  border-right: none;
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .el-menu-item.is-active {
    color: #306EF5;
    background: #DFE8FF;
    font-weight: 700;
    &::before {
      content: '|';
      font-size: 20px;
      position: absolute;
      left: 0;
    }
  }
}
</style>
