<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-25 17:05:44
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-10-26 17:16:29
 * @FilePath: /consumer-preview/src/views/knowledge/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
.knowledge{
  overflow: hidden;
}
.view-content{
  height: calc(100% - 48px);
}
.manage {
  display: flex;
}
</style>
