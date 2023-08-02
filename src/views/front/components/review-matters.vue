<template>
  <div class="review-matters" v-if="list.length">
    <g-table-card :title="title">
      <template v-slot:content>
        <div class="content df">
          <g-button
            class="button-btn"
            size="big"
            v-for="(item, index) in list"
            :key="index"
            :type="currentId === item.recordId ? 'primary-active' : 'normal'"
            @click.native="handleClick(item.recordId)"
          >
            <g-icon
              class="icon"
              :stylePx="currentId === item.recordId ?30: 18"
              :href="currentId === item.recordId ? '#icon-chanpin1' : '#icon-Vector'"
            />
            {{ item.examineTypesName }}
          </g-button>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      typeof: Array,
      required: true
    }
  },
  data() {
    return {
      title: '审查事项类型',
      currentId: 0
    };
  },
  created() {},
  watch: {
    list(val) {
      this.currentId = val[0].recordId;
      this.$emit('handleTo', this.currentId);
    }
  },
  methods: {
    handleClick(id) {
      if (id === this.currentId) return;
      this.currentId = id;
      this.$emit('handleTo', id);
    }
  }
};
</script>

<style lang="less" scoped>
.review-matters {
  .content {
    display: flex;
    flex-wrap: wrap;
    padding-top: 16px;
    padding-bottom: 4px;
    .button-btn {
      margin-bottom: 10px;

      /deep/.btn {
        min-width: auto;
        padding: 10px 24px;
        font-size: 14px;
      }
      .icon {
        display: flex;
        align-items: center;
        font-size: 24px;
      }
      &:not(:last-child) {
        margin-right: 24px;
      }
    }
    .g-button {
      width: max-content;
    }
    /deep/.btn-normal {
      background: #f7f8fa;
      border: 0;
    }
    /deep/.btn-primary-active {
      font-weight: 700;
    }
    .icon {
      position: relative;
      top: 2px;
      width: 30px;
      height: 30px;
    }
  }
}



</style>