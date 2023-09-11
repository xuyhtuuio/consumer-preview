<template>
  <div class="nav">
    <div class="left flex" @click="returnHome">
      <img src="@/assets/image/logo.png" alt="" class="logo">
      消保管控平台
    </div>
    <div class="center flex">
      <template v-if="$route.name !== 'home'">
        <div class="nav-item" v-for="item, index in list" :key="index" @click="handleItem(item)">
          <span :class="[activeMenu == item.sign ? 'active-menu' : '']">{{ item.title }}</span>
        </div>
      </template>
    </div>
    <div class="right flex">
      <i v-for="(item, index) in iconList" :key="index" @click="toManagePage(item)"
        :class="['iconfont', item.href, `icon${index + 1}`]"></i>
      <!-- 个人中心 -->
      <el-popover placement="bottom" trigger="click" @show="updateInfo" width="320">
        <div class="userInfo">
          <img class="ocr-avatar" src="@/assets/image/ai-approval/ocr-avatar.png" alt="" />
          <p>
            <span class="nickname"> {{ userInfo && userInfo.fullname }}{{ userInfo && ` / ${userInfo.id}` }} </span>
            <span class="role" v-if="userInfo.role">{{ userInfo.role }}</span>
          </p>
          <p class="orgs" v-if="userInfo?.org">
            <i class="iconfont icon-dept"></i>
            {{ userInfo?.org?.join('/') }}
          </p>
          <el-button class="logout" @click="logout"><i class="iconfont icon-tuichudenglu"></i> 退出登录</el-button>
        </div>
        <i slot="reference" :class="['iconfont', 'icon-gerenyonghutouxiang2']"></i>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMenu: 'home',
      userInfo: {}
    }
  },
  computed: {
    manageAuth() {
      const { permissionsPage = {} } = this.$store.state
      return [...permissionsPage.funPerms, ...permissionsPage.defaultPerm]?.find(item => item.name === '后台管理' && item.type)
    },
    list() {
      const { permissionsPage = {} } = this.$store.state
      const navList = [
        { title: '申请中心', name: 'apply-list', sign: 'applycenter' },
        { title: '审批中心', name: 'approval-list', sign: 'approvalcenter' },
        { title: '产品图谱', name: 'productmap', sign: 'productmap' },
        { title: '统计中心', name: 'statistical-center', sign: 'statistical-center' },
        { title: '人员中心', name: 'personCenter', sign: 'personcenter' },
      ]
      return navList.map(item => {
        const exist = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm]?.find(f => f.pathName === item.name)
        if (exist?.type) {
          return item;
        }
        return false;
      }).filter(e => e)
    },
    iconList() {
      if (this.manageAuth) {
        return [
          { href: 'icon-tongyongtubiao5', name: 'manage' }
        ]
      }
      return []
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.routeActived(val)
      },
      // 深度观察监听
      deep: true
    }
  },
  activated() {

  },
  mounted() {
    this.routeActived(this.$route)
  },
  methods: {
    routeActived(val) {
      const { fullPath } = val
      this.activeMenu = ''
      if (fullPath.indexOf('home') !== -1) {
        this.activeMenu = 'home'
      }
      if (fullPath.indexOf('applycenter') !== -1) {
        this.activeMenu = 'applycenter'
      }
      if (fullPath.indexOf('approvalcenter') !== -1) {
        this.activeMenu = 'approvalcenter'
      }
      if (fullPath.indexOf('productmap') !== -1) {
        this.activeMenu = 'productmap'
      }
      if (fullPath.indexOf('statistical-center') !== -1) {
        this.activeMenu = 'statistical-center'
      }
      if (fullPath.indexOf('person-center') !== -1) {
        this.activeMenu = 'personcenter'
      }
    },
    logout() {
      this.$router.push({
        name: 'login'
      })
    },
    returnHome() {
      this.$router.push('/home')
    },
    updateInfo() {
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      const org = user.orgs?.[0] ? this.getOrgs(user.orgs[0], []) : ''
      const role = user.roles.filter(item => item.clientId === 'cpr')
      this.userInfo = {
        ...user,
        org,
        role: role?.[0]?.name?.split('-')?.[1]
      }
    },
    getOrgs(item, org) {
      org.push(item.name)
      if (item?.child?.name) {
        return this.getOrgs(item.child, org)
      } else {
        return org;
      }
    },
    handleItem(item) {
      this.activeMenu = item.sign
      this.$router.push({
        name: item.name
      })
    },
    toManagePage(item) {
      const { funPerms } = this.$store.state.permissionsPage
      const rout = funPerms.filter(item1 => item1.path?.indexOf('/admin/') !== -1 && item1.pathName !== 'manage').find(i => i.type)
      if (item.name && rout) {
        this.$router.push({
          name: rout.pathName
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
    cursor: pointer;

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

.userInfo {
  padding: 4px 12px;

  .ocr-avatar {
    width: 32px;
  }

  p {
    margin: 8px 0;
  }

  .nickname {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #1D2128;
  }

  .role {
    margin-left: 8px;
    padding: 4px 12px;
    background: linear-gradient(180deg, #FFF7E6 0%, rgba(255, 247, 230, 0) 100%);
    color: #FA8C16;
    font-size: 13px;
    font-weight: 700;
    line-height: 20px;
  }

  .orgs {
    display: flex;
    background: linear-gradient(180deg, #F7F8FA 0%, rgba(247, 248, 250, 0) 100%);
    padding: 8px;
    border-radius: 4px;
    color: #505968;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    gap: 10px;

    .icon-dept {
      color: #2D5CF6;
      font-size: 22px;
    }
  }

  .logout {
    width: 100%;
    border: none;
    background: #F7F8FA;
    color: #1D2128;
    font-size: 14px;
    font-weight: 400;
    line-height: 30px;

    &:hover {
      background: #F7F8FA;
      color: #1D2128;
    }

    /deep/ span {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .icon-tuichudenglu {
      color: #2D5CF6;
      margin-right: 8px;
      font-size: 18px;
    }
  }
}
</style>
