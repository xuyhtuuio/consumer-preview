<template>
  <div class="review-matters">
    <g-table-card title="审查事项类型">
      <template v-slot:content>
        <div class="content df">
          <g-button class="btn" size="big"  type="primary" v-for="item,index in list" :key="index" @click.native="handleClick(item.recordId)">
          <g-icon :class="[`icon-${item.href}`]" style="color:#fff;margin-right:7px" :stylePx="30" :href="href"/>
          {{item.examineTypesName}}
          </g-button>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
  export default {
    props :{
      list: {
        typeof: Array,
        required: true
      }
    },
    data() {
      return {
        href:"#icon-chanpin",
        currentId: -1
        // list: [
        //   {title: '产品类', href:"#icon-chanpin"},
        //   {title: '活动类', href:"#icon-chanpin"},
        //   {title: '客户类', href:"#icon-chanpin"},
        //   {title: '其他类', href:"#icon-chanpin"},
        // ]
      }
    },
    created() {
    },
    methods: {
      handleClick(id) {
        if(id === this.currentId)return
        this.currentId = id
        this.$emit("handleTo",id)
      }
    }

  }
</script>

<style lang="less" scoped>
.review-matters {
  .content {
    .btn {
      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
}
</style>