<template>
  <el-menu @select="handleSelect">
    <el-menu-item
      v-for="item in list"
      :key="item.name"
      :index="item.name"
      :class="{ 'is-active': name === item.name }">
      {{ item.label }}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      name: 'RecommendKnowledge'
    };
  },
  computed: {
    list() {
      const pathNames = [{
        name: 'FollowKnowledge',
        label: '关注'
      }, {
        name: 'RecommendKnowledge',
        label: '推荐'
      }, {
        name: 'MyKnowledge',
        label: '我的'
      }]
      return pathNames
    }
  },
  methods: {
    handleSelect(name) {
      this.name = name
      this.$emit('changeLeftMenu', name)
    }
  }
};
</script>
<style lang="less" scoped>
.el-menu {
  padding: 8px 12px 0;
  width: 200px;
  margin-right: 16px;
  border-right: none;
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  .el-menu-item.is-active {
    color: #306ef5;
    background: #dfe8ff;
    font-weight: 700;
  }
}

</style>
