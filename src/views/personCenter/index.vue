<template>
  <div class="person-center">
    <div class="person-approval">
      <div class="approval-top">
        <div class="top-com">
          <div class="com-tit">贡献值分布</div>
          <div class="com-echarts" ref="contribution"></div>
        </div>
        <div class="top-com">
          <div class="com-tit">接受率分布</div>
          <div class="com-echarts" ref="acceptance"></div>
        </div>
        <div class="top-com">
          <div class="com-tit">平均处理时长分布</div>
          <div class="com-echarts" ref="processing"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  name: 'person-center-index',
  data() {
    return {
    }
  },
  mounted() {
  },
  watch: {
  },
  created() {
  },
  methods: {
  },
}
</script>
<style lang="less" scoped>
.person-center {
  .person-approval {
    .approval-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .top-com {
        width: calc((100% - 32px) / 3);
        height: 290px;
        padding: 16px;
        box-sizing: border-box;
        border-radius: 10px;
        background: #FFFFFF;

        .com-tit {
          position: relative;
          padding-left: 13px;
          font-size: 14px;
          font-weight: 700;
          line-height: 22px;
          color: #1D2128;

          &::before {
            content: '';
            display: block;
            width: 5px;
            height: 20px;
            background: #306EF5;
            border-radius: 0px 10px 0px 10px;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
}
</style>
