<template>
  <el-menu @select="handleSelect">
    <el-menu-item
      v-for="item in list"
      :key="item.name"
      :index="item.name"
      :class="{ 'is-active': name === item.name }">
      <img :src="name === item.name ? item.icon1 : item.icon" alt="" style="position: relative; bottom: 2px;margin-right:10px;"/>
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
        label: '关注',
        icon: require('@/assets/image/knowledge/关注.svg'),
        icon1: require('@/assets/image/knowledge/关注1.svg')
      }, {
        name: 'RecommendKnowledge',
        label: '推荐',
        icon: require('@/assets/image/knowledge/推荐.svg'),
        icon1: require('@/assets/image/knowledge/推荐1.svg')
      }, {
        name: 'MyKnowledge',
        label: '我的',
        icon: require('@/assets/image/knowledge/我的.svg'),
        icon1: require('@/assets/image/knowledge/我的1.svg')
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
    font-size: 12px;
  }
  .el-menu-item.is-active {
    color: #306ef5;
    background: #dfe8ff;
    font-weight: 700;
  }
}

</style>
