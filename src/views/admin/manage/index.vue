<template>
  <div class="manage">
    <LeftMenu/>
    <div class="view-content">
      <transition name="router-fade" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script>
import LeftMenu from './leftMenu'
export default {
  name: 'manage',
  components: {
    LeftMenu,
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
    // height: fit-content;
    padding: 24px;
    background: #ffffff;
    border-radius: 4px;
  }
}

</style>
