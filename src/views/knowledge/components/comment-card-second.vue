<template>
  <div :class="{ 'comment-second-dialog trs-scroll' : showLimit > 2 }">
    <div class="second-comment" v-for="(s, index) in (item.lowCommentList || []).slice(0, showLimit)" :key="s.id">
      <div class="content">
        {{ s.userName }} {{ showLimit }}
        <div class="desc ellipsis ellipsis_2" style="color:#434343;margin: 4px 0;">
          {{ s.content }}
        </div>
        <div class="meta-info">
          <div class="meta-left">
            <span class="time">{{ s.commentTime }}</span>来自:
            <span class="dept">{{ s.orgName }}</span>
          </div>
          <div class="meta-right">
            <span v-if="!!s.canDeleted" class="item" @click="deleteKnowledge(s, index)">
              <img src="@/assets/image/knowledge/删除.svg" />
            </span>
            <span class="item" @click="openComment(s, index)">
              <img v-if="s.extends > 0" src="@/assets/image/knowledge/评论1.svg" />
              <img v-else src="@/assets/image/knowledge/评论.svg" />
            </span>
            <span class="item" @click="handleZan(s)">
              <img v-if="s.isLiked > 0" src="@/assets/image/knowledge/赞1.svg" />
              <img v-else src="@/assets/image/knowledge/赞.svg" />{{ s.upvoteCount }}
            </span>
          </div>
        </div>
        <InputTextarea :ref="`textareaCommon${index}`" :id="s.id" :defaultShow="!!s.defaultShow" @hiddenInput="hiddenInput($event, s)" :prevUser="item.userName"  v-on="$listeners"/>
      </div>
    </div>
  </div>
</template>
<script>
import { setLike, deleteKnowledge } from '@/api/knowledge/knowledgeCollect'
import InputTextarea from './input-textarea'
export default {
  name: 'comment-card-second',
  components: {
    InputTextarea
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    showLimit: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
    }
  },
  methods: {
    openComment(s, index) {
      this.$set(s, 'defaultShow', true)
      this.$nextTick(() => {
        // debugger
        this.$refs[`textareaCommon${index}`][0].selectFocus()
      })
    },
    async deleteKnowledge(s, index) {
      const res = await deleteKnowledge({
        deleteType: 2,
        id: s.id
      })
      if (res.data.success) {
        this.item.lowCommentList.splice(index, 1)
        this.$message.success('删除成功')
      }
    },
    hiddenInput(e, s) {
      this.$set(s, 'defaultShow', false)
    },
    async handleZan(item) {
      const res = await setLike({
        type: 2,
        isLike: item.isLiked ? 0 : 1,
        id: item.id
      })
      if (res.data.success) {
        if (item.isLiked) {
          this.$message.success('取消点赞成功')
          item.isLiked = 0;
          item.upvoteCount -= 1
          return;
        }
        this.$message.success('点赞成功')
        item.isLiked = 1;
        item.upvoteCount += 1
        this.$set(item, 'isLiked', 1)
      }
    },
  }
}
</script>
<style lang="less" scoped>
.second-comment {
  padding: 6px 6px 6px 12px;
  border-left: 1px solid #E5E6EB;
  .content {
    width: calc(100%);
  }
  .meta-right {
    visibility: hidden;
  }
  &:hover {
    .meta-right {
      visibility: visible;
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
.comment-second-dialog {
  max-height: 300px;
  overflow: scroll;
}
</style>
