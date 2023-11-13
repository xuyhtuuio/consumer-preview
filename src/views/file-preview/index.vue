<!--
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-11-02 11:36:53
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-11-03 10:22:15
 * @FilePath: /consumer-preview/src/views/filePreview/file-preview.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="file-preview">
    <file-preview :url="previewUrl" v-if="previewUrl"></file-preview>
  </div>
</template>
<script>
import FilePreview from '@/components/filePreview'
// import { filePreview } from '@/api/knowledge/knowledgeCollect'
export default {
  components: { FilePreview },
  data() {
    return {
      previewUrl: ''
    }
  },
  async created() {
    const { url } = this.$route.query
    this.previewUrl = `http://192.168.210.51:9090/cpr/${url}`
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
</style>
