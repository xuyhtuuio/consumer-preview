<template>
  <div class="review-matters" v-if="list.length">
    <g-table-card :title="title">
      <template v-slot:content>
        <div class="content df">
          <g-button
            class="button-btn"
            :class="{disabled: !allawChange}"
            size="big"
            v-for="(item, index) in list"
            :key="index"
            :type="currentId === item.recordId ? 'primary-active' : 'normal'"
            @click.native="handleClick(item)"
          >
            <!-- <g-icon
              v-show="currentId !== item.recordId"
              class="icon button-icon"
              :stylePx="18"
              href="#icon-Vector"
            />
            <g-icon
              v-show="currentId === item.recordId"
              class="icon button-icon"
              style="position: relative; top: 4px; left: -3px"
              :stylePx="30"
              href="#icon-chanpin1"
            /> -->
            <img class="icon button-img" :src="item.icon" alt="" />
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
    },
    formManagementId: {
      typeof: Number | String,
      required: true
    },
    allawChange: {
      typeof: Boolean,
      default: true
    }
  },
  data() {
    return {
      title: '审查事项类型',
      currentId: -1,
      urgentTimeLimit: 0,
    };
  },
  created() {},
  watch: {
    list: {
      handler(val) {
        if (this.currentId === -1) {
          this.currentId = Number(val[0].recordId);
          this.urgentTimeLimit = val[0].urgentTimeLimit
        }
        this.$emit('handleTo', this.currentId, this.urgentTimeLimit, val[0].examineTypesName);
      },
      deep: true
    },
    formManagementId(val) {
      if (Number(val) !== -1) this.currentId = val;
    }
  },
  methods: {
    clearData() {
      this.currentId = -1;
    },
    handleClick({ recordId: id, urgentTimeLimit, examineTypesName }) {
      if (id === this.currentId || !this.allawChange) return;
      this.currentId = id;
      this.urgentTimeLimit = urgentTimeLimit
      this.$emit('handleTo', id, urgentTimeLimit, examineTypesName);
    }
  }
};
</script>

<style lang="less" scoped>
.review-matters {
  .icon {
    position: relative;
    top: 2px;
    width: 30px;
    height: 30px;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    padding-top: 16px;
    padding-bottom: 4px;
    .button-btn {
      margin-bottom: 10px;
      &.disabled{
        /deep/ .btn{
          cursor: not-allowed;
        }
      }
      /deep/.btn {
        min-width: auto;
        padding: 10px 24px;
        font-size: 14px;
      }
      .button-icon {
        display: flex;
        align-items: center;
        font-size: 24px;
      }
      .button-img {
        top: 1px;
        margin-right: 7px;
        width: 18px;
        height: 18px;
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
      border: 1px solid transparent;
    }
    /deep/.btn-primary-active {
      font-weight: 700;
      border: 1px solid #a8c5ff;
    }
  }
}
</style>
