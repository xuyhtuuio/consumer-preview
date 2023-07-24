<template>
    <div class="approval-record-detail">
        <p class="poppver-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-Rectangle143"></use>
            </svg>
            审批记录明细
        </p>
        <div class="workflow">
            <approvalRecordCard></approvalRecordCard>
        </div>
    </div>
</template>
<script>
  import approvalRecordCard from '@/components/card/approval-record-card.vue'
export default {
    components: {
        approvalRecordCard
    },
    data() {
        return {

        }
    }
}
</script>
<style lang="less" scoped>
.approval-record-detail {
    width: 600px;
    height: 100%;
    overflow-y: hidden;

    .poppver-title {
        color: #1D2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 16px;

        .icon {
            font-size: 20px;

        }
    }

    .workflow {
        margin-left: 4px;
        height: 96%;
        overflow-y: auto;
    }



}
</style>