<template>
  <div class="outer" style="padding: 0;">
    <div class="logo-area">
      <img src="@/assets/image/logo.png" alt="" class="logo" />
      TRS数星云
    </div>
    <div class="middle-area">数星云服务平台用户协议</div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {}
  },
  created() {},
  components: {}
}
</script>

<style lang="less" scoped>
.outer {
  // width: 1440px;
  padding: 0px;

  .logo-area {
    width: 100%;
    display: flex;
    align-items: center;
    font-family: Microsoft YaHei;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    text-align: left;
    color: rgba(45, 92, 246, 1);
    font-style: oblique 45deg;
    padding: 30px;
    .logo {
      width: 32px;
      height: 32px;
    }
  }

  .middle-area {
    width: 100%;
    height: 48px;
    // background-color: #F7F8FA;
    background: red;
    border: 1px solid rgba(229, 230, 235, 1);
  }
}
</style>
