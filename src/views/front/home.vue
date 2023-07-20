<template>
  <div>
    home
    <button @click="handle">点击1</button>
  </div>
</template>

<script>
export default {
  methods: {
    handle() {
      this.$router.push('addApply')
    }
  }
}
</script>

<style lang="less" scoped></style>