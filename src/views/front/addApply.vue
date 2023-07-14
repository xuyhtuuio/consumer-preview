<template>
  <div class="addApply">
    <g-breadcrunm :title="title"/>
    <div class="content">
      <g-table-card :title="title">
        <template v-slot:cardInfo>
            <div class="cardInfo">
              <g-icon class="right-icon" stylePx="20" href="#icon-guanzhu1"/>
              {{cardInfo}}
            </div>
        </template>
      </g-table-card>
    </div>
  </div>
</template>

<script>
  export default {
    data:()=>({
      title: "审查类型",
      cardInfo: "提醒：产品类内容审查，需于在产品上线/宣传前14天进行提交。"
    }),
    methods: {
    },
    created(){
      this.initialData()
    },
    methods: {
     initialData(){

     } 
    },
    computed: {
      
    }
  }
</script>

<style lang="less" scoped>
.addApply {
  .content {
    .cardInfo {
      display: flex;
      align-items: center;
      padding: 0 12px;
      border-radius: 20px;
      background: rgba(255, 252, 232, 1);
      color: rgba(250, 140, 22, 1);

    }
  }
}
</style>