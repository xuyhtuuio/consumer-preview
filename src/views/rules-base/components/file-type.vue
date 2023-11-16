<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-10-24 15:26:22
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-11-16 12:27:38
 * @FilePath: /consumer-preview/src/views/rules-base/components/file-type.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <svg class="icon" aria-hidden="true" v-if="fileType === 'pdf'">
    <use xlink:href="#icon-law-pdf"></use>
  </svg>

  <svg class="icon" aria-hidden="true" v-else-if="fileType === 'doc'">
    <use xlink:href="#icon-law-word"></use>
  </svg>
</template>
<script>
export default {
  name: 'file-type',
  props: {
    fileName: {
      type: String,
      default: ''
    }
  },
  computed: {
    fileType() {
      const suffix = this.fileName.split('.')[this.fileName.split('.').length - 1]
      let type = 'txt'
      if (['jpeg', 'jpg', 'png'].includes(suffix)) {
        type = 'png'
      } else if (['xls', 'xlsx'].includes(suffix)) {
        type = 'xls'
      } else if (['doc', 'docx'].includes(suffix)) {
        type = 'doc'
      } else if (['mp4'].includes(suffix)) {
        type = 'mp4'
      } else if (['pptx', 'ppt'].includes(suffix)) {
        type = 'ppt'
      } else if (['pdf'].includes(suffix)) {
        type = 'pdf'
      } else if (['zip'].includes(suffix)) {
        type = 'zip'
      }
      return type
    }
  }
}
</script>
