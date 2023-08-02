<template>
  <div class="show-review">
    <file-preview :url="url"></file-preview>
  </div>
</template>

<script>
import FilePreview from '@/components/filePreview';
export default {
  props: {},
  data() {
    return {
      url: this.$route.query.url
    };
  },
  created() {
    console.log(this.$route.query.url);
  },
  components: {
    FilePreview
  }
};
</script>

<style lang="less" scoped>
.show-review {
  width: 100%;
  height: 100%;
}
</style>