<template>
  <div class="nav">
    <div class="main">
      <img class="logo" src="@/assets/image/knowledge/logo.svg"/>
      <span class="name">知识库</span>
      <span class="menu" v-for="item in menus" :key="item.name" :class="{ active: activeName === item.name }">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'knowledge-header',
  data() {
    return {
      activeName: 'knowledge-base',
      menus: [
        {
          label: '知识集市',
          name: 'knowledge-base'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.nav {
  height: 42px;
  line-height: 42px;
  margin: -16px -80px 16px;
  background: #FFFFFF;
  .main {
    margin: 0 100px;
    .name {
      position: relative;
      top: 3px;
      left: 2px;
      color: #1D2128;
      font-family: YouSheBiaoTiHei;
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      margin-right: 24px;
    }
    .menu {
      padding: 8px 0;
      cursor: pointer;
      color: #505968;
      font-family: Microsoft YaHei;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
    }
    .active {
      color: #2D5CF6;
      border-bottom: 2px solid #2D5CF6;
    }
  }
}
</style>
