<template>
  <div class="file-preview">
    <div class="header">
      <p class="header-total">
        <span class="header-count">共 2/5</span>
        <span class="header-btns">
          <i class="iconfont">&#xe62e;</i>
          <i class="iconfont">&#xe62f;</i>
        </span>
      </p>
      <div class="file-header-swiper"></div>
    </div>
    <div class="preview"></div>
  </div>
</template>

<script>
export default {
  name: 'file-preview',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.file-preview{
  display: flex;
  flex-direction: column;
}
.header{
  background: #F7F8FA;
  &-total{
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
  }
  &-count{
    font-size:  14px;
    color: #1D2128;
    font-weight: bold;
  }
  &-btns{
    i{
      font-size: 18px;
      color: #505968;
      cursor: pointer;
    }
    i+i::before{
      content: ' ';
      width: 1px;
      height: 12px;
      display: inline-block;
      margin: 0 10px;
      background: #CACDD3;
      cursor: default;
    }
  }
}
.preview{
  background: #ffffff;
  flex: 1;
}
</style>