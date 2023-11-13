<template>
  <div class="my" v-loading="loadingList">
    <FilterKnowledge ref="filterKnowledge"  :total="page.total" @changeSort="changeSort" @changeTags="changeCheckedTags" style="margin-top: 0; border-top-left-radius: 10px; border-top-right-radius: 10px;"/>
    <div class="list">
      <div v-for="(k, i) in kCardList" :key="i">
        <KnowledgeCard :data="k" @fetchList="getRecommendList(paramsDefalut)" @setLoading="loadingList=true"/>
      </div>
      <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
        v-if="page.total" style="margin: -16px 11px 0 0;">
      </TrsPagination>
    </div>
    <Empty v-if="kCardList.length === 0 && loadingList === false"></Empty>
  </div>
</template>
<script>
import { getRecommendList } from '@/api/knowledge/knowledgeCollect'
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
      kCardList: [],
      page: {
        pageNow: 1,
        total: 0
      },
      loadingList: false,
      paramsDefalut: {
        keyword: '',
        justSelected: 0,
        listType: 3,
        orderType: 'desc',
        orderValue: 2,
        pageNum: 1,
        pageSize: 10,
        tagIds: []
      }
    }
  },
  created() {
    this.getRecommendList(this.paramsDefalut)
  },
  methods: {
    getSearchList(params) {
      this.paramsDefalut = this.$options.data().paramsDefalut
      this.$refs['filterKnowledge'].resetForm()
      this.getRecommendList({
        ...this.paramsDefalut,
        ...params
      })
    },
    async getRecommendList(data) {
      this.loadingList = true
      const res = await getRecommendList(data)
      if (res.data.success) {
        this.kCardList = (res.data.data.list || []).map(item => {
          item.extends = 0
          return item;
        })
        this.page.total = res.data.data.totalCount
      } else {
        this.kCardList = []
        this.page.total = 0
      }
      this.loadingList = false
    },
    changeSort(params) {
      this.page.total = 0
      this.paramsDefalut = {
        ...this.paramsDefalut,
        ...params
      }
      this.getRecommendList({
        ...this.paramsDefalut,
      })
    },
    changeCheckedTags(tagIds) {
      this.paramsDefalut = {
        ...this.paramsDefalut,
        tagIds,
      }
      this.getRecommendList({
        ...this.paramsDefalut
      })
    },
    handleCurrentChange(val) {
      this.page.pageNow = val
      this.getRecommendList({
        ...this.paramsDefalut,
        pageNum: val
      })
    },
  }
}
</script>
<style lang="less" scoped>
.list {
  background: #FFFFFF;
  border-radius: 10px;
  padding-bottom: 16px;
}
</style>
