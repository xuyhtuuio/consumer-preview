<template>
  <div id="app">
    <NavMenu v-if="!noNavMenu.includes($route.name)"></NavMenu>
    <transition name="router-fade" mode="out-in">
      <router-view
        v-if="!$route.meta.keepAlive"
        class="view-box"
        :style="{
          padding:
            noPaddingRoute.indexOf($route.name) !== -1 ? '0' : '16px 80px',
          'overflow-y': noBodyScroll.includes($route.name) ? 'hidden' : 'auto'
        }"
      />
    </transition>
  </div>
</template>

<script>
import NavMenu from '@/components/common/navMenu'
export default {
  components: { NavMenu },
  data() {
    return {
      noPaddingRoute: [
        'aiApproval',
        'approval-aiApproval',
        'compare',
        'user-agreement',
        'privacy-policy'
      ],
      noBodyScroll: ['baseSetting', 'processDesign', 'proSetting', 'collectKnowledge'],
      noNavMenu: ['login', 'showReview', 'privacy-policy', 'user-agreement']
    }
  },
  methods: {}
}
</script>
<style lang="less">
@import '@/assets/global';

:focus {
  outline: -webkit-focus-ring-color auto 0px;
}

.view-box {
  padding: 16px 80px;
  background: #f7f8fa;
}

body {
  margin: 0;
  min-width: 1060px;
  background-color: #f5f6f6;
}

body,
html {
  margin: 0;
  height: 100%;
}
.nav-menu {
  position: sticky;
  width: 100%;
  z-index: 10;
  height: 48px;
}

ul {
  padding: 0;
  margin: 0;

  li {
    list-style-type: none;
  }
}

.ov-tip {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-desc {
  font-size: small;
  color: #5e5e5e;
}
</style>
