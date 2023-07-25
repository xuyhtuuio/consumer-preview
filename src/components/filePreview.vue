<template>
  <iframe v-if="url" class="iframe" id="iframe" frameborder="no" border="0" ref="iframe" :src="iframeUrl"></iframe>
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
      const encondeUrl =  encodeURIComponent(Base64.encode(this.url))
      // console.log(encondeUrl)
      return 'http://192.168.210.52:31400/onlinePreview?url=' + encondeUrl
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