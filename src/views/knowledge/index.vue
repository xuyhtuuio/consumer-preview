<template>
  <div class="knowledge">
    <KnowledgeHeader/>
    <div class="manage">
      <LeftMenu @changeLeftMenu="changeLeftMenu"/>
      <component :is="componentId"></component>
    </div>
  </div>
</template>
<script>
import KnowledgeHeader from './components/header'
import LeftMenu from './components/leftMenu'
import FollowKnowledge from './followKnowledge'
import RecommendKnowledge from './recommendKnowledge'
import MyKnowledge from './myKnowledge'
export default {
  name: 'knowledge',
  components: {
    KnowledgeHeader,
    LeftMenu,
    FollowKnowledge,
    RecommendKnowledge,
    MyKnowledge
  },
  data() {
    return {
      componentId: 'RecommendKnowledge'
    }
  },
  methods: {
    changeLeftMenu(name) {
      this.componentId = name
    }
  }
}
</script>
<style lang="less" scoped>
.manage {
  display: flex;
}
</style>
