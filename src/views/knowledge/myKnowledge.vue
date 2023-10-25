<template>
  <div class="my">
    <FilterKnowledge style="margin-top: 0; border-top-left-radius: 0; border-top-right-radius: 0;"/>
    <div v-for="(k, i) in kCardList" :key="i">
      <KnowledgeCard :data="k"/>
    </div>
    <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
      v-if="page.total">
    </TrsPagination>
  </div>
</template>
<script>
import FilterKnowledge from './components/filter'
import KnowledgeCard from './components/knowledge-card'
export default {
  name: 'myKnowledge',
  components: {
    FilterKnowledge,
    KnowledgeCard
  },
  data() {
    return {
      kCardList: [
        {
          extends: 0,
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
    },
  }
}
</script>
<style lang="less" scoped>
</style>
