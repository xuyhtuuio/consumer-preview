<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-25 17:05:44
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-11-03 10:49:02
 * @FilePath: /consumer-preview/src/views/knowledge/components/header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="nav">
    <div class="main">
      <img class="logo" src="@/assets/image/knowledge/logo.svg" />
      <span class="name">知识库</span>
      <span
        class="menu"
        v-for="item in menus"
        :key="item.name"
        @click="changeMenu(item)"
        :class="{ active: activeName === item.name }"
      >
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
      activeName: 'collectKnowledge',
      menus: [
        {
          label: '知识集市',
          name: 'collectKnowledge'
        },
        {
          label: '法规库',
          name: 'rulesBase'
        }
      ]
    }
  },
  watch: {
    $route: {
      handler(val) {
        const { name } = val

        this.activeName = name === 'CollectKnowledge' ? 'collectKnowledge' : 'rulesBase'
      },
      immediate: true
    }
  },
  methods: {
    changeMenu(menu) {
      this.activeName = menu.name
      this.$router.push({
        path: `/knowledge/${menu.name}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
.nav {
  height: 42px;
  line-height: 42px;
  margin: -16px -80px 16px;
  background: #ffffff;
  .main {
    margin: 0 100px;
    .name {
      position: relative;
      top: 3px;
      left: 2px;
      color: #1d2128;
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
      margin: 0 32px;
    }
    .active {
      color: #2d5cf6;
      border-bottom: 2px solid #2d5cf6;
    }
  }
}
</style>
