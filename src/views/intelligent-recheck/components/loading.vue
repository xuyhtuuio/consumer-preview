<template>
  <div class="loading">
    <i class="el-icon-loading"></i>
    <div class="loading-tip">加载中…</div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true
  })
}
</script>

<style lang="less" scoped>
.loading {
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .loading-icon {
    width: 30px;
    height: 30px;
  }
  .loading-tip {
    margin-left: 10px;
    font-size: 14px;
  }
}
</style>
