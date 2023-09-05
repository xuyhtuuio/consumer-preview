<template>
  <el-menu router :default-active="$route.path">
    <el-menu-item
      v-for="item in list"
      :key="item.name"
      :index="item.path"
      :class="{ 'is-active': $route.name === item.pathName }">
      {{ item.name }}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    list() {
      const { permissionsPage = {} } = this.$store.state
      const pathNames = [{
        name: 'FlowManage',
        path: '/admin/manage/flowManage'
      },{
        name: 'UserManage',
        path: '/admin/manage/userManage'
      },{
        name: 'FormManage',
        path: '/admin/manage/formManage'
      },{
        name: 'RolePermission',
        path: '/admin/manage/rolePermission'
      },{
        name: 'LabelManage',
        path: '/admin/manage/labelManage'
      },{
        name: 'OpinionManage',
        path: '/admin/manage/opinionManage'
      }]
      const listArr = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm]?.map(item => {
        const exsit = pathNames.find(p => (p.name === item.pathName && item.type))
        if (exsit) {
          item.path = exsit.path
          return item;
        }
        return;
      }).filter(e => e)
      return listArr || []
    }
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
    margin-bottom: 10px;
    text-align: center;
  }
  .el-menu-item.is-active {
    color: #306ef5;
    background: #dfe8ff;
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
