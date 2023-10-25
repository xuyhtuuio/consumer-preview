<template>
  <div class="follow">
    <div class="tabs" v-if="!showTagDetail">
      <div class="tab" :class="{ active: active === '知识' }" @click="changeTab('知识')">知识</div>
      <div class="tab" :class="{ active: active === '标签' }" @click="changeTab('标签')">标签</div>
    </div>
    <div class="tag-detail" v-else>
      <div class="tag-name"><img src="@/assets/image/knowledge/标签.svg" style="margin-right:8px;"/>{{ currentTag.name }}</div>
      <div class="info">
        <div class="left">
          <div class="left-item">
            <p class="title">讨论量</p>
            <p class="num">{{ currentTag.discussNum }}</p>
          </div>
          <div class="left-item">
            <p class="title">精选量</p>
            <p class="num">{{ currentTag.selectedNum }}</p>
          </div>
          <div class="left-item">
            <p class="title">关注量</p>
            <p class="num">{{ currentTag.attentionCount }}</p>
          </div>
        </div>
        <div class="right" style="text-align:center;margin:16px;">
          <el-button type="primary" v-if="currentTag.isAttention === 1">已关注</el-button>
          <el-button type="primary" v-else plain icon="el-icon-plus">加关注</el-button>
        </div>
      </div>
    </div>
    <template v-if="active === '知识'">
      <FilterKnowledge style="margin-top: 0; border-top-left-radius: 0; border-top-right-radius: 0;"/>
      <div v-for="(k, i) in kCardList" :key="i">
        <KnowledgeCard :data="k"/>
      </div>
    </template>
    <template v-else>
      <TagList @toTagDetail="toTagDetail"/>
    </template>
    <TrsPagination :pageSize="10" :pageNow="page.pageNow" :total="page.total" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
      v-if="page.total">
    </TrsPagination>
  </div>
</template>
<script>
import FilterKnowledge from './components/filter'
import KnowledgeCard from './components/knowledge-card'
import TagList from './components/tag-list'
export default {
  name: 'followKnowledge',
  components: {
    FilterKnowledge,
    KnowledgeCard,
    TagList
  },
  data() {
    return {
      active: '知识',
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
      },
      showTagDetail: false,
      currentTag: {}
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page.pageNow = val
    },
    changeTab(val) {
      if (val !== this.active) {
        this.page.pageNow = 1
        this.active = val
      }
    },
    toTagDetail(tag) {
      this.currentTag = tag
      this.page.pageNow = 1
      this.active = '知识'
      this.showTagDetail = true
    }
  }
}
</script>
<style lang="less" scoped>
.follow {
  .tabs {
    display: flex;
    padding: 16px 24px 0;
    background: #FFFFFF;
    border-radius: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: 1px solid #E5E6EB;
    cursor: pointer;
    .tab {
      padding-bottom: 10px;
      font-size: 14px;
      margin-right: 32px;
    }
    .active {
      font-weight: 700;
      color: #1D2128;
      border-bottom: 2px solid #1D2128;
    }
  }
  .tag-detail {
    background: #e5e6eb;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    .tag-name {
      padding: 16px 24px;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
    }
  }
}
.info {
  display: flex;
  justify-content: space-between;
  justify-items: center;
  background: #FFFFFF;
  border-radius: 16px 16px 0px 0px;
  border-bottom: 1px solid #E5E6EB;
  .left {
    display: flex;
    justify-content: space-around;
    justify-items: center;
  }
  .left-item {
    padding: 12px 24px 12px 24px;
    font-size: 12px;
    text-align: center;
    line-height: 22px;
  }
  .title {
    color: #86909C;
  }
  .num {
    font-weight: 700;
  }
}
.el-button--primary.is-plain {
  color: #2D5CF6;
  background: #F0F6FF;
  border-color: #F0F6FF;
  border-radius: 6px;
}
</style>
