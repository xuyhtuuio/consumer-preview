<template>
  <div class="cCard">
    <div class="card-top">
      <div class="avatar" :style="getStyle(4)">jz</div>
      <div class="content">
        <InputTextarea prevUser="王建国"/>
      </div>
    </div>
    <div class="card-content">
      <div class="card-content-header">
        <span class="left">共 <b>{{ totalCount }}</b> 条评论</span>
        <div class="right">
          <span class="time" @click="changeSort(1)" :class="{ active: orderValue === 1 }">时间</span>
          <span class="zan" @click="changeSort(2)" :class="{ active: orderValue === 2 }">点赞</span>
        </div>
      </div>
      <!-- 一级评论 -->
      <div class="card-item" v-for="(item, i) in commentList" :key="item.id">
        <CommentCardFirst :item="item" :colorStyle="getStyle(i)" @showSecondCommentDialog="showSecondComment"/>
      </div>
    </div>
    <!-- 二级评论弹框 -->
    <w-dialog :showFooter="false" v-model="showSecondCommentDialog" :title="`共${showSecondCommentData.lowCommentNum}条回复`" width="70%" class="second-comment-dialog">
      <CommentCardFirst :item="showSecondCommentData" :colorStyle="colorStyle" @showSecondCommentDialog="showSecondComment" :showLimit="showSecondCommentData.lowCommentNum"/>
      <!-- <comment-card-second :item="showSecondCommentData" :showLimit="showSecondCommentData.lowCommentNum"/> -->
    </w-dialog>
  </div>
</template>
<script>
import InputTextarea from './input-textarea'
import CommentCardFirst from './comment-card-first'
export default {
  name: 'comment-card',
  components: {
    InputTextarea,
    CommentCardFirst
  },
  props: {
  },
  data() {
    return {
      colors: [
        ['#E5E6EB', '#86909c'],
        ['#FFF7E6', '#F9CC45'],
        ['#FFF1F0', '#F98981'],
        ['#F9F0FF', '#B37FEB'],
        ['#E6FFFB', '#5EDFD6'],
      ],
      index: new Array(5).fill(1).map(() => Math.floor(Math.random() * 5)),
      orderValue: 1,
      commentList: [
        {
          canDeleted: 1,
          canSelected: 1,
          commentTime: '2021-08-11',
          content: 'cpr_1698044630677_监管转来投诉数据,监管转来投诉数据监管转来投诉数据监管转来投诉数据监管转来投诉数据',
          id: 1,
          isLiked: 1,
          isSelected: 1,
          extends: 1,
          lowCommentList: [
            {
              canDeleted: 1,
              canSelected: 1,
              commentTime: '2021-08-12',
              content: '111cpr1_1698044630677_监管转来投诉数据,监管转来投诉数据监管转来投诉数据监管转来投诉数据监管转来投诉数据',
              id: 101,
              isLiked: 1,
              isSelected: 1,
              pinYinHeader: 'XY1',
              upvoteCount: 1231,
              userName: '张三1',
              orgName: '发布机构2',
            },
            {
              canDeleted: 1,
              canSelected: 1,
              commentTime: '2021-08-12',
              content: '111cpr1_1698044630677_监管转来投诉数据,监管转来投诉数据监管转来投诉数据监管转来投诉数据监管转来投诉数据',
              id: 103,
              isLiked: 1,
              isSelected: 1,
              pinYinHeader: 'XY1',
              upvoteCount: 1231,
              userName: '张三1',
              orgName: '发布机构2',
            },
            {
              canDeleted: 1,
              canSelected: 1,
              commentTime: '2021-08-12',
              content: '111cpr1_1698044630677_监管转来投诉数据,监管转来投诉数据监管转来投诉数据监管转来投诉数据监管转来投诉数据',
              id: 104,
              isLiked: 1,
              isSelected: 1,
              pinYinHeader: 'XY1',
              upvoteCount: 1231,
              userName: '张三1',
              orgName: '发布机构2',
            }
          ],
          lowCommentNum: 3,
          pinYinHeader: 'XY',
          upvoteCount: 123,
          userName: '张三',
          orgName: '发布机构1',
          oneId: -1
        },
        {
          canDeleted: 1,
          canSelected: 1,
          commentTime: '2021-08-11',
          content: 'cpr_1698044630677_监管转来投诉数据,监管转来投诉数据监管转来投诉数据监管转来投诉数据监管转来投诉数据',
          id: 2,
          isLiked: 1,
          isSelected: 1,
          extends: 1,
          lowCommentList: [
            {
              canDeleted: 1,
              canSelected: 1,
              commentTime: '2021-08-12',
              content: '111cpr1_1698044630677_监管转来投诉数据,监管转来投诉数据监管转来投诉数据监管转来投诉数据监管转来投诉数据',
              id: 102,
              isLiked: 1,
              isSelected: 1,
              pinYinHeader: 'XY1',
              upvoteCount: 1231,
              userName: '张三1',
              orgName: '发布机构2',
            }
          ],
          lowCommentNum: 2,
          pinYinHeader: 'RT',
          upvoteCount: 123,
          userName: '张三',
          orgName: '发布机构1',
          oneId: -1
        }
      ],
      totalCount: 1121,
      data: {
        isLiked: 0,
        isAttention: 0
      },
      showSecondCommentDialog: false,
      showSecondCommentData: {},
      colorStyle: {}
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
  methods: {
    changeSort(value) {
      this.orderValue = value
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
