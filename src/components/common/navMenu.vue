<template>
  <div class="menu">
    <div class="left menu-item">
      <g-icon class="right-icon"  stylePx="32" href="#icon-xianxingtubiao1"/>
      消保管控平台
    </div>
    <div class="center menu-item">
      <div :class="['center-item',currentIndex === index?'center-item-hover':'']" v-for="item,index in list"  :key="index" @click="handleItem(item.path,index)">
      <span :class="['item-main',currentIndex === index?'item-main-hover':'']">{{item.name}}</span>
    </div>
    </div>
    <div class="right menu-item">
      <g-icon class="right-icon"  v-for="item,index in iconList" :key="index" :style="{color:item.color}" stylePx="32" :href="item.href"/>
    </div>
  </div>
</template>

<script>
  export default {

    data() {
      return {
        currentIndex:0,
        list : [
          {name: "首页",path: "home"},
          {name: "申请中心",},
          {name: "审批中心"},
          {name: "人员中心"},
          {name: "产业图谱"},
        ],
        iconList: [
          {href: "#icon-tongyongtubiao" ,color: "#fff"},
          {href: "#icon-tongyongtubiao1",color: "#fff"},
          {href: "#icon-tongyongtubiao-1",color: "#fff"},
        ]
      }
    },
    methods: {
      handleItem(item,idx) {
      console.log(item);
      this.$router.push(item)
      this.currentIndex = idx
    }
    }
  }
</script>

<style lang="less" scoped>
 .menu {
   display: flex;
   align-items: center;
  padding: 0 24px;
  height: 48px;
  background: #374160;
  font-size:14px;
  color: #fff;
  .icon-my {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
    .menu-item {
      display: flex;
      align-items: center;
    }
  .left {
    font-weight: 700;
  }
  .center {
    flex: 1;
    display: flex;
    align-items: center;
    .center-item {
    padding: 0px 20px 0px 20px;
    width: 104px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: 10px;
    gap: 8px;
    cursor: pointer;
    &.center-item-hover {
      font-weight: 700;
    }
    &:first-child {
      margin-left: 10px;
    }
    .item-main {
      display: inline-block;
      // justify-content: center;
      height: 100%;
    }
    .item-main-hover {
      border-bottom: 2px solid rgba(255, 255, 255, 1);
    }
     
  }
  }
  .right {
    .right-icon {
      &:not(:last-child) {
        margin-right: 32px;
      }
    }
  }
 }
</style>