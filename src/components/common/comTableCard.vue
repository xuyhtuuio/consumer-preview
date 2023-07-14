<template>
  <div class="tableCard">
    <div class="head">
       <div class="left">
        <g-icon class="right-icon" :key="index" :wProp="20" :hProp="32" :href="iconHref"/>
       <span class="content">{{title}}</span>
       </div>
      <slot name="cardInfo"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "gTableCard",
    props: {
      iconHref: {
        typeof: String,
        default: "#icon-a-Rectangle143"
      },
      title: {
        typeof: String,
        required: true
      }
    },
    data(){
      return {}
    }
  }
</script>

<style lang="less" scoped>
.tableCard {
  background: rgba(255, 255, 255, 1);
padding: 16px 24px;
  .head {
    display: flex;
    align-items: center;
    .left {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    }
    

    .content {
      margin-right:  8px;
    }
  }
}
</style>