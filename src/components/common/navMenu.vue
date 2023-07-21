<template>
  <div class="nav">
    <div class="left flex">
      <img src="@/assets/image/logo.png" alt="" class="logo">
      消保管控平台
    </div>
    <div class="center flex">
      <div class="nav-item" v-for="item, index in list" :key="index" @click="handleItem(item.path)">
        <span :class="[activeMenu == item.path ? 'active-menu' : '']">{{ item.name }}</span>
      </div>
    </div>
    <div class="right flex">
      <i v-for="(item, index) in iconList" :key="index" @click="toManagePage(item)" :class="['iconfont', item.href, `icon${index + 1}`]"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { name: "首页", path: "home" },
        { name: "申请中心", path: "apply-list" },
        { name: "审批中心", path: 'approvalCenter' },
        { name: "人员中心" },
        { name: "产业图谱" },
      ],
      activeMenu: 'home',
      iconList: [
        { href: "icon-tongyongtubiao3" },
        { href: "icon-tongyongtubiao5", name: 'manage' },
        { href: "icon-gerenyonghutouxiang2" },
      ]
    }
  },
  watch: {
    $route: {
      handler: function (val) {
        const { fullPath } = val
        this.activeMenu = ''
        if (fullPath.indexOf('home') !== -1) {
          this.activeMenu = 'home'
        }
        if (fullPath.indexOf('apply-list') !== -1) {
          this.activeMenu = 'apply-list'
        }
        if (fullPath.indexOf('approvalCenter') !== -1) {
          this.activeMenu = 'approvalCenter'
        }
      },
      // 深度观察监听
      deep: true
    }

  },
  methods: {
    handleItem(url) {
      this.activeMenu = url
      this.$router.push({
        name:url
      })
    },
    toManagePage(item) {
      if (item.name) {
        this.$router.push({
          name: item.name
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 48px;
  background: #374160;
  font-size: 14px;
  color: #fff;

  .icon-my {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }

  .flex {
    display: flex;
    align-items: center;
    align-items: center;
  }

  .left {
    font-weight: 700;

    .logo {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
  }

  .center {
    flex: 1;
    display: flex;
    align-items: center;

    .nav-item {
      padding: 0px 20px 0px 20px;
      width: 104px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      border-radius: 10px;
      gap: 8px;
      cursor: pointer;

      &:hover {
        background: gray;
      }

    }

    .active-menu {
      position: relative;
      width: 100%;
      font-weight: 700;

    }

    .active-menu::after {
      content: '';
      width: 100%;
      height: 2px;
      border-radius: 10px;
      background: var(--unnamed, #FFF);
      position: absolute;
      left: 0;
      bottom: -14px;


    }
  }

  .right {
    .iconfont {
      margin-left: 32px;
      font-size: 24px;
      color: #fff;
      cursor: pointer;
    }

    .icon3 {
      font-size: 21px !important;
    }
  }
}
</style>