<template>
  <div class="recommend">
    <CommentTextarea/>
    <FilterKnowledge/>
    <div v-for="(k, i) in kCardList" :key="i">
      <KnowledgeCard :data="k"/>
    </div>
    <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
      v-if="page.total">
    </TrsPagination>
  </div>
</template>
<script>
import CommentTextarea from './components/comment-textarea'
import FilterKnowledge from './components/filter'
import KnowledgeCard from './components/knowledge-card'
export default {
  name: 'recommendKnowledge',
  components: {
    CommentTextarea,
    FilterKnowledge,
    KnowledgeCard
  },
  data() {
    return {
      kCardList: [
        {
          extends: 1,
          canSelected: 1,
          canDeleted: 1
        }
      ],
      page: {
        pageNow: 1,
        total: 10
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page.pageNow = val
    }
  }
}
</script>
<style lang="less" scoped>

</style>
