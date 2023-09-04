<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-08-31 17:21:49
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-09-04 17:54:45
 * @FilePath: /consumer-preview/src/views/approvalCenter/image-preview.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
      default: '',
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
}</style>
