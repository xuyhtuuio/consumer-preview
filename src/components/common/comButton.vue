<template>
  <div class="g-button" @click="$emit('click')">
    <div :class="['btn',`size-${size}`, `btn-${type}`]">
      <slot>
        提交
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "gButton",
    props : {
      type: {
        typeof: String,
        default: "normal"
      },
      size: {
        typeof: String,
        default: "normal"
      }
    },
  }
</script>

<style lang="less" scoped>
.g-button {
  font-size: 14px;
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      cursor: pointer;
      &.size-normal {
        min-width: 88px;
        height: 34px;
      }
      &.size-big {
        min-width: 118px;
        height: 40px;
      }
      &.btn-normal{
        background: transparent;
        border: 1px solid rgba(202, 205, 211, 1);
        color: rgba(29, 33, 40, 1);
      }
      &.btn-primary {
        background: linear-gradient(180deg, #2F54EB 0%, #2D5CF6 100%);
        color: rgba(255, 255, 255, 1);
      }
      &.btn-primary-active {
        background: rgba(240, 246, 255, 1);
        color: rgba(45, 92, 246, 1);
      }
    }
}

</style>