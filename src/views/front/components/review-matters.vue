<template>
  <div class="review-matters" v-if="list.length">
    <g-table-card :title="title">
      <template v-slot:content>
        <div class="content df">
          <g-button
            class="btn"
            size="big"
            v-for="(item, index) in list"
            :key="index"
            :type="currentId === item.recordId? 'primary': 'primary-active'"
            @click.native="handleClick(item.recordId)"
          >
            <g-icon
              :class="['icon']"
              :stylePx="30"
              :href="item.icon"
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
      currentId: 0,
    };
  },
  created() {},
  watch: {
    list(val) {
      this.currentId = val[0].recordId;
      this.$emit('handleTo',this.currentId)
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
    padding-top: 16px;
    padding-bottom: 4px;
    .btn {
      &:not(:last-child) {
        margin-right: 8px;
      }
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