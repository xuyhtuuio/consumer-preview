<template>
  <el-menu router :default-active="$route.path">
    <el-menu-item v-for="item in list" :key="item.name" :index="item.path"
      :class="{ 'is-active': $route.name === item.pathName }">
      {{ item.name }}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  mounted() {
    this.getNav();
    this.$route.name === 'manage' && this.$router.push({
      name: this.list[0].pathName
    })
  },
  methods: {
    getNav() {
      const { permissionsPage = {} } = this.$store.state
      // 按展示顺序增删 pathNames, code(code与 权限code保持一致)  不存在code时，去掉该字段
      const pathNames = [{
        name: '用户管理',
        pathName: 'UserManage',
        path: '/admin/manage/userManage',
        code: 'userManagement'
      }, {
        name: '角色/权限管理',
        pathName: 'RolePermission',
        path: '/admin/manage/rolePermission',
        code: 'rolePermManagement'
      }, {
        name: '表单管理',
        pathName: 'FormManage',
        path: '/admin/manage/formManage',
        code: 'formManagement'
      }, {
        name: '流程管理',
        pathName: 'FlowManage',
        path: '/admin/manage/flowManage',
        code: 'flowableManagement'
      }, {
        name: '标签管理',
        pathName: 'LabelManage',
        path: '/admin/manage/labelManage',
        code: 'tagManagement'
      }, {
        name: '意见管理',
        pathName: 'OpinionManage',
        path: '/admin/manage/opinionManage',
        code: 'opinionManagement'
      }];
      this.list = pathNames
        .map((item) => {
          const exist = permissionsPage.funPerms?.find((f) => (f.code === item.code));
          if ((exist && exist?.type) || !exist) {
            return item
          } else {
            return false;
          }
        }).filter((e) => e)
    },
  },
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
