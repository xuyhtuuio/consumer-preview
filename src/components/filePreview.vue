<template>
  <iframe v-if="url" title="file-preview" class="iframe" id="iframe" frameborder="no" border="0" ref="iframe" :src="iframeUrl"></iframe>
  <!-- <div v-else>暂无数据</div> -->
</template>

<script>
import '@/utils/base64.min';
export default {
  name: 'file-preview',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      route: ''
    }
  },
  computed: {
    iframeUrl() {
      // eslint-disable-next-line
      const encondeUrl = encodeURIComponent(Base64.encode(this.url))
      return this.$GLOBAL.filePreviewUrl + '?url=' + encondeUrl
    }
  }
}
</script>
<style lang="less" scoped>
.iframe {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
