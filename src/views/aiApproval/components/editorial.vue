<template>
  <div class="editorial">
    <div class="header">
      <span class="active">推荐意见 9</span>
      <i>|</i>
      <span>已编辑意见 5</span>
    </div>
    <div class="results"></div>
  </div>
</template>

<script>
export default {
  name: 'editorial',
  data() {
    return {
      keyWords: '',
    }
  },
  methods: {
    search() {}
  }
}
</script>

<style lang="less" scoped>
.editorial{
  display: flex;
  flex-direction: column;
}
.header{
  background: #F7F8FA;
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-around;
  >span{
    flex: 1;
    display: inline-block;
    text-align: center;
    padding: 4px 10px;
    line-height: 22px;
    font-size: 14px;
    white-space: pre;
    color: #86909C;
    cursor: pointer;
    height: fit-content;
    &.active{
      color: #333333;
      font-weight: 700;
    }
  }
  i{
    color: #86909C;
    margin: 0 10px;
  }
}
.results{
  background: #ffffff;
  flex: 1;
}
</style>