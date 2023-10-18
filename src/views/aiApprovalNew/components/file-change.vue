<template>
  <div class="file-change">
    <div class="pre-btn"></div>
    <div class="fileList">
      <div class="fileList-list-item" @click="changeFile(index)" v-for="(file, index) in files" :key="index"
        :class="{
          'swiper-slide-img': ['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName))
        }">
        <span class="">{{ index + 1 }}.</span>
        <el-image v-if="['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName))"
          :src="file.url"></el-image>
        <file-type class="icon" v-else :fileName="file.fileName"></file-type>
        <span class="fileList-list-item-fileName">{{ getfileName(file.fileName) }}
          <i class="fileList-list-item-fileSuf">.{{ getfileType(file.fileName) }}</i>
        </span>
      </div>
    </div>
    <div class="next-btn"></div>
  </div>
</template>

<script>
import fileType from '@/components/common/file-type'

export default {
  name: 'fileChange',
  components: {
    fileType
  },
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="less" scoped>

</style>
