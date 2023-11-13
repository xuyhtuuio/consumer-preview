<template>
  <div style="width: 100%">
    <el-empty
      :image="require('@/assets/image/empty.png')"
      :image-size="imageSize"
    ></el-empty>
  </div>
</template>
<script>
export default {
  props: {
    imageSize: {
      type: Number,
      default: 292
    }
  }
}
</script>
