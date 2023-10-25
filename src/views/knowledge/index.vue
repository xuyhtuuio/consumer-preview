<template>
  <div class="knowledge">
    <KnowledgeHeader/>
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
import KnowledgeHeader from './components/header'
export default {
  name: 'knowledge',
  components: {
    KnowledgeHeader,
  },
  data() {
    return {
      componentId: 'RecommendKnowledge'
    }
  }
}
</script>
<style lang="less" scoped>
.manage {
  display: flex;
}
</style>
