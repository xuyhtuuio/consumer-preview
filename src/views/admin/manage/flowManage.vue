<template>
  <div class="flow">
    <el-button type="primary" @click="addFlow">去流程图</el-button>
  </div>
</template>
<script>
export default {
  name: 'flowManage',
  methods: {
    addFlow() {
      this.$router.push({
        name: 'design'
      })
    }
  }
}
</script>