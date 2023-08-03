<template>
  <svg class="icon" aria-hidden="true" v-if="fileType === 'png'">
    <use xlink:href="#icon-picture"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-else-if="fileType === 'xls'">
    <use xlink:href="#icon-mianxingtubiao-1"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-else-if="fileType === 'doc'">
    <use xlink:href="#icon-mianxingtubiao-2"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-else-if="fileType === 'mp4'">
    <use xlink:href="#icon-mp4"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-else-if="fileType === 'ppt'">
    <use xlink:href="#icon-file-ppt"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-else-if="fileType === 'pdf'">
    <use xlink:href="#icon-mianxingtubiao"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-else-if="fileType === 'zip'">
    <use xlink:href="#icon-zip1"></use>
  </svg>
  <svg class="icon" aria-hidden="true" v-else-if="fileType === 'txt'">
    <use xlink:href="#icon-file-txt"></use>
  </svg>
</template>

<script>
export default {
  name: 'file-type',
  props: {
    fileName: {
      type: String,
      default: '',
    },
  },
  computed: {
    fileType() {
      const suffix = this.fileName.split('.')[this.fileName.split('.').length - 1];
      let type = 'txt';
      if (['jpeg', 'jpg', 'png'].includes(suffix)) {
        type = 'png'
      } else if (['xls', 'xlsx'].includes(suffix)) {
        type = 'xls'
      } else if (['doc','docx'].includes(suffix)) {
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
    },
  },
}
</script>