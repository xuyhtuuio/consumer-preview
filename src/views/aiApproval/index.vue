<template>
  <div>
    <el-button @click="init">添加审查意见</el-button>
    <el-button @click="initFile">添加文件來源</el-button>

    <add-review ref="addReview"></add-review>
    <add-file-source ref="addFileSource"></add-file-source>
  </div>
</template>
<script >
import addFileSource from './dialogs/add-file-source.vue'
import addReview from './dialogs/add-review.vue'
export default {
  components: { addReview, addFileSource },
  data() {
    return {}
  },
  methods: {
    init() {
      this.$refs['addReview'].init()

    },
    initFile() {
      this.$refs['addFileSource'].init()

    }
  }

}
</script>
