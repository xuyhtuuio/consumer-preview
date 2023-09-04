<template>
  <div class="preview">
    <img :src="url" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: () => '',
    },
  },
};
</script>

<style lang="less" scoped>
.preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  -webkit-user-select: none;
  user-select: none;
  cursor: move;
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
