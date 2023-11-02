<template>
  <div class="recommend">
    <CommentTextarea v-if="!knowledgeId" @updateList="getSearchList"/>
    <FilterKnowledge ref="filterKnowledge" v-loading="loadingList" :total="page.total" @changeSort="changeSort" @changeTags="changeCheckedTags"/>
    <div class="list">
      <div v-for="(k, i) in kCardList" :key="i" v-loading="loadingList">
        <KnowledgeCard :data="k" @fetchList="getRecommendList(paramsDefalut)" @setLoading="loadingList=true"/>
      </div>
      <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
        v-if="page.total">
      </TrsPagination>
    </div>
    <el-empty description="暂无数据" v-if="kCardList.length === 0 && loadingList === false"></el-empty>
  </div>
</template>
<script>
import { getRecommendList, getOneKnowledge } from '@/api/knowledge/knowledgeCollect'
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
        orderValue: 2,
        pageNum: 1,
        pageSize: 10,
        tagIds: []
      },
      knowledgeId: null
    }
  },
  created() {
    const { knowledgeId, extend } = this.$route.query
    if (knowledgeId) {
      this.knowledgeId = knowledgeId
      this.getOneKnowledge(knowledgeId, extend)
      return;
    }
    this.getRecommendList(this.paramsDefalut)
  },
  methods: {
    // 通过ID获取数据
    async getOneKnowledge(knowledgeId, extend) {
      const res = await getOneKnowledge(knowledgeId)
      if (res.data.success) {
        const { data } = res.data
        data.extends = extend ? 1 : 0
        data.showCollaplse = false
        data.isCollaplse = true
        this.page.total = 1
        this.kCardList = [data]
      }
    },
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
.list {
  background: #FFFFFF;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding-bottom: 16px;
}
</style>
