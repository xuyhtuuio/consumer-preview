<template>
  <div class="ocr-txt">
    <div class="header">
      <span>禁用词</span>
      <span>敏感词</span>
      <el-input v-model="keyWords" placeholder="请输入关键字" @keyup.enter.native="search" size="medium">
        <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="search"></i>
      </el-input>
    </div>
    <div class="results"></div>
  </div>
</template>

<script>
export default {
  name: 'ocr-txt',
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
.ocr-txt{
  display: flex;
  flex-direction: column;
}
.header{
  background: #F7F8FA;
  padding: 12px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  >span{
    padding: 3px 16px;
    border-radius: 4px;
    line-height: 24px;
    font-weight: 700;
    white-space: pre;
    background: #ffffff;
    color: #EB5D78;
    cursor: pointer;
    height: fit-content;
    +span{
      color: #FDB123;
    }
  }
  .el-input{
    /deep/ input{
      border: none;
      border-radius: 18px;
      font-size: 12px;
      color: #1D2128;
    }
    /deep/ .el-icon-search{
      color: #86909C;
      font-size: 16px;
    }
  }
}
.results{
  background: #ffffff;
  flex: 1;
}
</style>