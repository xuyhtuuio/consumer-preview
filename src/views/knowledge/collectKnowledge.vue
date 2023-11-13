<template>
  <div class="collect-knowledge">
    <el-input v-char placeholder="请输入标题、正文、标签等关键词查询" v-model.trim="searchText" @keypress.native.enter="changeSearch" size="mini">
      <el-button slot="append" icon="el-icon-search" size="mini" type="primary" @click="changeSearch"></el-button>
    </el-input>
    <div class="manage">
      <LeftMenu @changeLeftMenu="changeLeftMenu"/>
      <component :is="componentId" ref="kCompnent"></component>
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
  name: 'knowledge-collect',
  components: {
    KnowledgeHeader,
    LeftMenu,
    FollowKnowledge,
    RecommendKnowledge,
    MyKnowledge
  },
  data() {
    return {
      componentId: 'RecommendKnowledge',
      searchText: ''
    }
  },
  methods: {
    changeLeftMenu(name) {
      this.componentId = name
      this.$router.push({
        name: this.$route.name,
        query: {}
      })
    },
    changeSearch() {
      this.$refs['kCompnent'].getSearchList({ keyword: this.searchText })
    }
  }
}
</script>
<style lang="less" scoped>
.manage {
  display: flex;
}
.el-input {
  position: absolute;
  right: 80px;
  top: 55px;
  width: 400px;
  /deep/.el-input__inner {
    background-color: #f7f8fa;
  }
}
.el-input-group__append button.el-button {
  height: 28px;
  position: relative;
  top: 2px;
  border-color: #2d5cf6;
  background-color: #2d5cf6;
  /deep/.el-icon-search {
    position: relative;
    top: -2px;
    color: #FFFFFF;
  }
}
</style>
