<template>
  <div class="breadcrunm">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item,index in getBcList" :key="index">
        <a class="item" @click="handle(item.name)">{{item.title}}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'gBreadcrunm',
  data() {
    return {}
  },
  computed: {
    getNowRouteName() {
      return this.$route.name
    },
    getBcList() {
      return [{ path: '/', title: '消保管控' }, ...this.$store.state.breadcrumbList]
    }
  },
  methods: {
    handle(name) {
      if (this.getNowRouteName === name) return
      if (name) {
        this.$router.push({ name })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.breadcrunm {
  .item {

  }
  /deep/.el-breadcrumb__item {

    &:nth-child(n+1) {
    .el-breadcrumb__separator, .el-breadcrumb__inner a {
          color: rgba(0, 0, 0, 1)
      }
    }
    &:first-child {
      .el-breadcrumb__separator,.el-breadcrumb__inner a {
        color: rgba(134, 144, 156, 1);
     }
    }
    .el-breadcrumb__inner {
      padding: 0 2px;
      font-size: 14px;

      a {
font-weight: normal;
      }
    }
  }
}
</style>
