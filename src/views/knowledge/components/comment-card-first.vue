<template>
<div class="card-top card-item-top">
  <div class="avatar" :style="colorStyle">{{ item.pinYinHeader }}</div>
  <div class="content">
    <div class="name">
      <div class="name-left">{{ item.userName }}</div>
      <el-popover
        placement="bottom-start"
        :width="100"
        trigger="hover"
        popper-class="k-card">
        <ul class="content">
          <li @click="setWinnow">设为精选</li>
          <li @click="copyClipboard(item.content)">复制</li>
          <li @click="deleteKnowledge">删除</li>
        </ul>
        <template #reference>
          <b class="title-menu">...</b>
        </template>
      </el-popover>
    </div>
    <div class="desc ellipsis ellipsis_2" style="color:#434343;margin: 4px 0;">
      {{ item.content }}
    </div>
    <div class="meta-info">
      <div class="meta-left">
        <span class="time">{{ item.commentTime }}</span>来自:
        <span class="dept">{{ item.orgName }}</span>
      </div>
      <div class="meta-right">
        <span class="item" @click="handleCollect(item)">
          <img v-if="item.isSelected > 0" src="@/assets/image/knowledge/精选.svg" style="width:20px;" />
          <img v-else src="@/assets/image/knowledge/精选1.svg" style="width:20px;" />
        </span>
        <span class="item" @click="openComment(item)">
          <img v-if="item.extends > 0" src="@/assets/image/knowledge/评论1.svg" />
          <img v-else src="@/assets/image/knowledge/评论.svg" />
        </span>
        <span class="item" @click="handleZan(item)">
          <img v-if="item.isLiked > 0" src="@/assets/image/knowledge/赞1.svg" />
          <img v-else src="@/assets/image/knowledge/赞.svg" />
          <span>{{ item.upvoteCount }}</span>
        </span>
      </div>
    </div>
    <InputTextarea ref="textareaCommon" :defaultShow="defaultShow" @hiddenInput="defaultShow=false" :prevUser="item.userName"/>
    <!-- 二级评论 -->
    <CommentCardSecond ref="CommentCardSecond" :item="item" :showLimit="showLimit"/>
    <div class="second-count" v-if="showLimit <= 2 && item.lowCommentNum > 2" @click="handleSecondCommitExtend(item)">
      共 {{ item.lowCommentNum }} 条回复
      <i class="el-icon-caret-bottom"></i>
    </div>
  </div>
</div>
</template>
<script>
import { copyText } from '@/utils/Clipboard';
import InputTextarea from './input-textarea'
import CommentCardSecond from './comment-card-second'
export default {
  name: 'comment-card-first',
  components: {
    InputTextarea,
    CommentCardSecond
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    // 二级评论的数量限制
    showLimit: {
      type: Number,
      default: 2,
    },
    colorStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      defaultShow: false
    }
  },
  methods: {
    openComment() {
      this.$nextTick(() => {
        this.defaultShow = true
        this.$refs['textareaCommon'].selectFocus()
      })
    },
    setWinnow() {

    },
    deleteKnowledge() {

    },
    handleCollect(item) {
      if (item.isSelected) {
        item.isSelected = 0;
        return;
      }
      item.isSelected = 1;
      this.$set(item, 'isSelected', 1)
    },
    handleSecondCommitExtend(item) {
      this.$emit('showSecondCommentDialog', {
        showSecondCommentData: item,
        colorStyle: this.colorStyle
      })
    },
    copyClipboard(val) {
      copyText(
        val,
        msg => {
          this.$message.success(msg);
        },
        err => {
          this.$message.success(err);
        }
      );
    }
  }
}
</script>
<style lang="less" scoped>
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
.second-count {
  cursor: pointer;
  color:#2D5CF6;
}
</style>
