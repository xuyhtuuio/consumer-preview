<template>
  <div :class="{ 'comment-second-dialog trs-scroll' : showLimit > 2 }">
    <div class="second-comment" v-for="(s, index) in (item.lowCommentList || []).slice(0, showLimit)" :key="s.id">
      <div class="content">
        {{ s.userName }} {{ showLimit }}
        <div class="desc ellipsis ellipsis_2" style="color:#434343;margin: 4px 0;">
          关于兴业银行侵害消费者权益情况的通报：近日，中国银保监会消费者权益保护局发布2021年第12号通报《关于兴业银行侵害消费者权益情况的通情的情况的
          近日，中国银保监会消费者权益保护局发布2021年第12号但是，关于兴业银行侵害但是，关于兴业银行侵害消费者权益情况的通报。关于兴业银行侵害但是，关于兴业银行侵害消费者权益情况的通报
        </div>
        <div class="meta-info">
          <div class="meta-left">
            <span class="time">08:23</span>来自:
            <span class="dept">消费者权益保护(客户服务)中心</span>
          </div>
          <div class="meta-right">
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
        <InputTextarea :ref="`textareaCommon${index}`" :id="s.id" :defaultShow="!!s.defaultShow" @hiddenInput="hiddenInput($event, s)" prevUser="王建国"/>
      </div>
    </div>
  </div>
</template>
<script>
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
        this.$refs[`textareaCommon${index}`][0].selectFocus()
      })
    },
    hiddenInput(e, s) {
      this.$set(s, 'defaultShow', false)
    },
    handleZan(item) {
      if (item.isLiked) {
        item.isLiked = 0;
        return;
      }
      item.isLiked = 1;
      this.$set(item, 'isLiked', 1)
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
