<template>
  <div class="recommend">
    <CommentTextarea/>
    <FilterKnowledge ref="filterKnowledge" v-loading="loadingList" :total="page.total" @changeSort="changeSort" @changeTags="changeCheckedTags"/>
    <div v-for="(k, i) in kCardList" :key="i" v-loading="loadingList">
      <KnowledgeCard :data="k" @fetchList="getRecommendList(paramsDefalut)"/>
    </div>
    <el-empty description="暂无数据" v-if="kCardList.length === 0 && loadingList === false"></el-empty>
    <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
      v-if="page.total">
    </TrsPagination>
  </div>
</template>
<script>
import { getRecommendList } from '@/api/knowledge/knowledgeCollect'
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
      kCardList: [],
      page: {
        pageNow: 1,
        total: 0
      },
      loadingList: false,
      paramsDefalut: {
        keyword: '',
        justSelected: 0,
        listType: 1,
        orderType: 'desc',
        orderValue: 1,
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
    // 搜索获取
    getSearchList(params) {
      this.paramsDefalut = this.$options.data().paramsDefalut
      this.$refs['filterKnowledge'].resetForm()
      this.paramsDefalut = {
        ...this.paramsDefalut,
        ...params
      }
      this.getRecommendList(this.paramsDefalut)
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
