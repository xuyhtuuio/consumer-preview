<template>
    <div class="approved-opinion">
        <p class="poppver-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-Rectangle143"></use>
            </svg>
            已审查意见
        </p>
        <div class="opinion-content">
          <approvedOpinionCard :sidebarParam="sidebarParam" :status="0"></approvedOpinionCard>
        </div>
    </div>
</template>
<script>
import approvedOpinionCard from '@/components/card/approved-opinion-card'
export default {
  name: 'ocr-approved-opinion',
  props: {
    sidebarParam: {
      type: Object,
      default: () => { }
    }
  },
  components: { approvedOpinionCard },
  data() {
    return {

    }
  }

}
</script>
<style lang="less" scoped>
.approved-opinion {
    width: 600px;
    height: 100%;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;

    .poppver-title {
        color: #1D2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 16px;
        height: 24px;

        .icon {
            font-size: 20px;

        }
    }

    .opinion-content {
   flex: 1;
        overflow: auto;

    }

}
</style>
