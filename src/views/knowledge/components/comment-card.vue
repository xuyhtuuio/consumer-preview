<template>
  <div class="cCard">
    <div class="card-top">
      <div class="avatar" :style="getStyle(4)">{{ pinyin }}</div>
      <div class="content">
        <InputTextarea ref="inputTextarea" :prevUser="fullName" @publishComment="publishComment"/>
      </div>
    </div>
    <div class="card-content" v-if="totalCount">
      <div class="card-content-header">
        <span class="left">共 <b>{{ totalCount }}</b> 条评论</span>
        <div class="right">
          <span class="time" @click="changeSort(1)" :class="{ active: orderValue === 1 }">时间</span>
          <span class="zan" @click="changeSort(2)" :class="{ active: orderValue === 2 }">点赞</span>
        </div>
      </div>
      <!-- 一级评论 -->
      <div v-loading="loadingList">
      <div class="card-item" v-for="(item, i) in commentList" :key="item.id">
        <CommentCardFirst :item="item" :colorStyle="getStyle(i)" @showSecondCommentDialog="showSecondComment"/>
      </div>
      <TrsPagination :pageSize="5" :pageNow="paramsDefualt.pageNum" :total="totalCount" @getList="handleCurrentChange" scrollType="scrollCom" scrollName="scrollCom"
        v-if="totalCount">
      </TrsPagination>
      </div>
    </div>
    <!-- 二级评论弹框 -->
    <w-dialog :showFooter="false" v-model="showSecondCommentDialog" :title="`共${showSecondCommentData.lowCommentNum}条回复`" width="70%" class="second-comment-dialog">
      <CommentCardFirst :item="showSecondCommentData" :colorStyle="colorStyle" @showSecondCommentDialog="showSecondComment" :showLimit="showSecondCommentData.lowCommentNum"/>
    </w-dialog>
  </div>
</template>
<script>
import { addComment, getCommentList, getPinYin } from '@/api/knowledge/knowledgeCollect'
import InputTextarea from './input-textarea'
import CommentCardFirst from './comment-card-first'
export default {
  name: 'comment-card',
  components: {
    InputTextarea,
    CommentCardFirst
  },
  props: {
    id: {
      type: [String, Number]
    },
    fullName: {
      type: String
    }
  },
  data() {
    return {
      loadingList: false,
      pinyin: '',
      colors: [
        ['#E5E6EB', '#86909c'],
        ['#FFF7E6', '#F9CC45'],
        ['#FFF1F0', '#F98981'],
        ['#F9F0FF', '#B37FEB'],
        ['#E6FFFB', '#5EDFD6'],
      ],
      index: new Array(5).fill(1).map(() => Math.floor(Math.random() * 5)),
      orderValue: 1,
      commentList: [],
      totalCount: 0,
      showSecondCommentDialog: false,
      showSecondCommentData: {},
      colorStyle: {},
      paramsDefualt: {
        orderType: 'desc',
        orderValue: 1,
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  computed: {
    getStyle() {
      return (i) => {
        return {
          background: this.colors[this.index[i % 5]][0],
          color: this.colors[this.index[i % 5]][1]
        }
      }
    },
  },
  created() {
    this.getPinYin()
    this.getCommentList()
  },
  methods: {
    async getPinYin() {
      const res = await getPinYin()
      if (res.data.success) {
        this.pinyin = res.data.data
      }
    },
    async publishComment(content, pid) {
      this.$refs['inputTextarea'].loading = true
      const res = await addComment({
        knowledgeId: this.id,
        content,
        pid
      })
      if (res.data.success) {
        this.commentList.unshift({
          ...res.data.data
        })
        this.totalCount += 1
      } else {
        this.$message.error('发布失败')
      }
      this.$refs['inputTextarea'].textarea = ''
      this.$refs['inputTextarea'].loading = false
    },
    async getCommentList() {
      this.loadingList = true
      const res = await getCommentList({
        ...this.paramsDefualt,
        knowledgeId: this.id,
      })
      if (res.data.success) {
        this.commentList = (res.data.data.list || []).map(item => {
          item.extends = 0
          return item;
        })
        this.totalCount = res.data.data.totalCount
      }
      this.loadingList = false
    },
    changeSort(value) {
      if (this.orderValue !== value) {
        this.orderValue = value
        this.paramsDefualt.pageNum = 1
        this.getCommentList()
      }
    },
    handleCurrentChange(val) {
      this.paramsDefualt.pageNum = val
      this.getCommentList()
    },
    showSecondComment({ showSecondCommentData, colorStyle }) {
      this.showSecondCommentData = showSecondCommentData
      this.colorStyle = colorStyle
      this.showSecondCommentDialog = true
    },
  }
}
</script>
<style lang="less" scoped>
.cCard {
  padding: 0 16px 16px;
  width: calc(100vw - 372px);
  background: #FFFFFF;
}
.card-top {
  display: flex;
  background: #FFFFFF;
  padding: 16px 0;
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin: 0 16px 0 0;
    font-size: 14px;
    border-radius: 50%;
  }
  .content {
    position: relative;
    width: calc(100% - 60px);
    font-size: 14px;
  }
}
.card-content {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #F2F3F5;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px solid #F2F3F5;
    .right {
      padding: 2px 4px;
      display: flex;
      justify-content: space-between;
      border-radius: 4px;
      background: #F2F3F5;
      .time,
      .zan {
        display: inline-block;
        padding: 4px;
        cursor: pointer;
      }
      .active {
        border-radius: 2px;
        background: #FFF;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.10);
      }
    }
  }
  .card-item {
    &-top {
      color: #86909C;
    }
    .name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title-menu {
        position: relative;
        bottom: 5px;
        cursor: pointer;
      }
    }
  }
}
.meta-info {
  display: flex;
  justify-content: space-between;
  color: #86909C;
  font-weight: 400;
  font-size: 12px;
  .time {
    margin-right: 6px;
  }
  .dept {
    text-decoration: underline;
  }
  .meta-right {
    display: flex;
    align-items: center;
    .item {
      display: flex;
      align-items: center;
      margin-left: 20px;
      img {
        margin-right: 4px;
        cursor: pointer;
      }
      .active {
        color: #2D5CF6;
      }
    }
  }
}
</style>
<style lang="less">
.second-comment-dialog {
  .name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title-menu {
      position: relative;
      bottom: 5px;
      cursor: pointer;
    }
  }
}
</style>
