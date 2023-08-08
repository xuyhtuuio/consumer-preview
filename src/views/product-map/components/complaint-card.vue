<template>
  <div class="complaint-item" @click="showMore">
    <div class="item-content" :class="{ ell: !isShow }">
      {{ item.content }}
    </div>
    <div class="item-tag">
      <div
        class="tag-item"
        v-for="(tagItem, index) in item.tag"
        :key="'tag' + index"
      >
        {{ tagItem }}
      </div>
    </div>
    <div class="item-time">
      <span class="span">{{item.time}}</span>
      <span>来自 {{ item.source }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    isShow: false,
  }),
  methods: {
    showMore() {
      this.isShow = !this.isShow;
    },
  },
};
</script>

<style lang="less" scoped>
.complaint-item {
  padding: 16px;
  cursor: pointer;
  .item-content {
    color: #1d2128;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
  .ell {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .item-tag {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .tag-item {
      padding: 4px 12px;
      border-radius: 4px;
      background: #f0f6ff;
      color: #306ef5;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      margin: 0 12px 8px 0;
    }
  }
  .item-time {
    color: #505968;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    .span {
      margin-right: 24px;
    }
  }
}
</style>