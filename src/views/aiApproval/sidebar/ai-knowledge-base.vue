<template>
    <div class="ocr-aIknowledge-base">
        <p class="poppver-title">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-a-Rectangle143"></use>
            </svg>
            AI知识语料库
        </p>
        <opinionManage :pageConfig="pageConfig"></opinionManage>
    </div>
</template>
<script>
import opinionManage from "../../admin/manage/opinionManage.vue";
export default {
    name: "aiknowledge-base",
    components: { opinionManage },
    data() {
        return {
            pageConfig: {
                pageType: 'nonManage',
                isAll: 0,
                pageSize: 5
            }
        }
    }
};
</script>
<style lang="less" scoped>
.ocr-aIknowledge-base {
    width: 600px;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .poppver-title {
        color: #1d2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 28px;

        .icon {
            font-size: 20px;
        }
    }
}
</style>