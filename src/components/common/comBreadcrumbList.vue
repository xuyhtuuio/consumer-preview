<template>
  <div class="breadcrunm">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item,index in getBcList" :key="index">
        <a @click="handle(item.path)">{{item.title}}</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "gBreadcrunm",
    data() {
      return {}
    },
    computed: {
      getNowRouteName(){
        return this.$route.name
      },
      getBcList() {
        return [{path: 'front',title: "消保管控"},...this.$store.state.breadcrumbList]
      }
    },
    methods: {
      handle(path) {
        if(this.getNowRouteName == path) return
        this.$router.push(path)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>