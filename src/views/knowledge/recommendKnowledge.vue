<template>
  <div class="recommend">
    <CommentTextarea/>
    <FilterKnowledge/>
  </div>
</template>
<script>
import CommentTextarea from './components/comment-textarea'
import FilterKnowledge from './components/filter'
export default {
  name: 'recommendKnowledge',
  components: {
    CommentTextarea,
    FilterKnowledge
  },
}
</script>
<style lang="less" scoped>

</style>
