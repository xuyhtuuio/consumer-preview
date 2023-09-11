<template>
  <div class="tableCard">
    <div class="head">
      <div class="left">
        <g-icon
          class="right-icon"
          :wProp="20"
          :hProp="hProp"
          :href="iconHref"
        />
        <slot name="head-title"
          ><span class="content">{{ title }}</span></slot
        >
      </div>
      <div class="right">
        <slot name="head-right"></slot>
      </div>
      <slot name="cardInfo"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gTableCard',
  props: {
    iconHref: {
      typeof: String,
      default: '#icon-a-Rectangle143'
    },
    title: {
      typeof: String,
      required: true
    },
    hProp: {
      typeof: Number | String,
      default: 32
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.tableCard {
  padding: 16px 24px 12px;
  // background: rgba(255, 255, 255, 1);
  // border-radius: 10px;
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 700;
    }

    .content {
      margin-right: 8px;
    }
  }
}
</style>
