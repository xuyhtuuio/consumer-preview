<template>
  <div class="warn-info">
      <g-icon v-if="info.length" class="right-icon" stylePx="20" href="#icon-guanzhu1"/>
       <slot>
        {{info}}
       </slot>
  </div>
</template>

<script>
export default {
  components: { },
  props: {
    info: {
      typeof: String,
      // required:true
    }
  }
    
  }
</script>

<style lang="less" scoped>
.warn-info {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba(235, 87, 87, 1);
  .right-icon {
    margin-right: 8px;
  }
}
</style>