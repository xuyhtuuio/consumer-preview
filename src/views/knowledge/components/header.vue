<template>
  <div class="nav">
    <div class="main">
      <img class="logo" src="@/assets/image/knowledge/logo.svg" />
      <span class="name">知识库</span>
      <span
        class="menu"
        v-for="item in menus"
        :key="item.name"
        @click="changeMenu(item)"
        :class="{ active: activeName === item.name }"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'knowledge-header',
  data() {
    return {
      activeName: 'collectKnowledge',
      menus: []
    }
  },
  mounted() {
    this.getNav();
    this.$route.name === 'knowledge' && this.$router.push({
      name: this.menus[0].name
    })
  },
  methods: {
    changeMenu(menu) {
      this.activeName = menu.name
      this.$router.push({
        name: menu.name
      })
    },
    getNav() {
      const { permissionsPage = {} } = this.$store.state
      // 按展示顺序增删 name
      const pathNames = [
        {
          label: '知识集市',
          name: 'collectKnowledge',
          code: 'collectKnowledge'
        },
        {
          label: '法规库',
          name: 'rulesBase',
          code: 'rulesBase'
        }
      ];
      this.menus = pathNames
        .map((item) => {
          const exist = permissionsPage.funPerms?.find((f) => (f.code === item.code));
          if ((exist && exist?.type) || !exist) {
            return item
          } else {
            return false;
          }
        }).filter((e) => e)
    },
  }
}
</script>
<style lang="less" scoped>
.nav {
  height: 42px;
  line-height: 42px;
  margin: -16px -80px 16px;
  background: #ffffff;
  .main {
    margin: 0 100px;
    .name {
      position: relative;
      top: 3px;
      left: 2px;
      color: #1d2128;
      font-family: YouSheBiaoTiHei;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-right: 24px;
    }
    .menu {
      padding: 8px 0;
      cursor: pointer;
      color: #505968;
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      margin: 0 32px;
    }
    .active {
      color: #2d5cf6;
      border-bottom: 2px solid #2d5cf6;
    }
  }
}
</style>
