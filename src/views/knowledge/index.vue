<template>
  <div class="knowledge">
    <KnowledgeHeader />
    <el-backtop target=".main_right" :visibility-height="windowHeight">
      <div
        class="show-top"
        :class="topBtnState ? 'active' : ''"
        @click="changeState(2)"
        @mouseenter="changeState(1)"
        @mouseleave="changeState(0)"
      >
        <img
          v-if="!topBtnState"
          style="width: 12px; height: 18px; margin-bottom: 10px"
          src="@/assets/image/top-icon.png"
        />
        <img
          v-else
          style="width: 12px; height: 18px; margin-bottom: 10px"
          src="@/assets/image/top-icon1.png"
        />
        置顶
      </div>
    </el-backtop>
    <div class="view-content main_right">
      <transition name="router-fade" mode="out-in">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import KnowledgeHeader from './components/header'
export default {
  name: 'knowledge',
  components: {
    KnowledgeHeader
  },
  data() {
    return {
      topBtnState: false
    }
  },
  computed: {
    ...mapState(['windowHeight'])
  },
  created() {
    this.$store.commit('setWindowHeight')
  },
  watch: {
    $route: {
      handler() {
        const dom = document.getElementsByClassName('view-content')?.[0]
        dom.scrollTop = 0
      },
      deep: true
    }
  },
  methods: {
    // 更改置顶状态
    changeState(type) {
      if (type === 2) {
        setTimeout(() => {
          this.topBtnState = false
        }, 1000)
        return
      }
      this.topBtnState = Boolean(type)
    }
  }
}
</script>
<style lang="less" scoped>
.knowledge {
  overflow: hidden;
}
.view-content {
  height: calc(100% - 48px);
}
.manage {
  display: flex;
}
.show-top {
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 4px;
  border-radius: 8px 0 0 8px !important;
  width: 26px;
  height: 86px;
  writing-mode: vertical-lr;
  font-size: 12px;
  color: #505968;
}

.active {
  color: #80a6ff;
}
/deep/.el-backtop {
  right: 0 !important;
  bottom: 74px !important;
  letter-spacing: 4px;
  border-radius: 8px 0 0 8px !important;
  width: 26px;
  height: 86px;
  writing-mode: vertical-lr;
  font-size: 12px;
  color: #505968;
}
.main_right {
  max-height: calc(100vh - 130px);
  overflow: auto;
}
</style>
